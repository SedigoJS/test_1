"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Palette mirrors the sheet: drafting paper, ink, graphite, and one signal red.
const PAPER = 0xf5f2ea;
const GROUND = 0xe2ddd1;
const INK = 0x1c2127;
const GRAPHITE = 0x6b7079;
const SIGNAL = 0xc2412d;

// Six works on one site. Heights are massing studies, not data.
const SITE = [
  { x: -2.4, z: -1.4, h: 3.2 },
  { x: 0, z: -1.4, h: 2.2 },
  { x: 2.4, z: -1.4, h: 2.8 },
  { x: -2.4, z: 1.4, h: 3.9 },
  { x: 0, z: 1.4, h: 1.6 },
  { x: 2.4, z: 1.4, h: 2.5 },
];
const FOOT = 1.8;
const OFFSET = new THREE.Vector3(9, 8, 9); // fixed axonometric view direction

/** Extension lines and a dimension line along the front edge of a volume. */
function dimension(x: number, z: number) {
  const y = 0.01;
  const zz = z + FOOT / 2 + 0.35;
  const a = x - FOOT / 2;
  const b = x + FOOT / 2;
  const t = 0.1;
  const pts = new Float32Array([
    a, y, z + FOOT / 2, a, y, zz + t,
    b, y, z + FOOT / 2, b, y, zz + t,
    a, y, zz, b, y, zz,
    a, y, zz - t, a, y, zz + t,
    b, y, zz - t, b, y, zz + t,
  ]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: GRAPHITE }));
}

export default function Massing({
  activeIndex = null,
  onSelect,
}: {
  activeIndex?: number | null;
  onSelect?: (i: number) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<(i: number | null) => void>(() => {});
  const selectRef = useRef(onSelect);

  useEffect(() => {
    selectRef.current = onSelect;
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 6, -6, 0.1, 200);
    camera.position.copy(OFFSET);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minZoom = 0.7;
    controls.maxZoom = 2.4;
    controls.maxPolarAngle = Math.PI / 2.2;

    // Site: ground plate and a survey grid.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshBasicMaterial({ color: GROUND })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const grid = new THREE.GridHelper(14, 14, GRAPHITE, GRAPHITE);
    const gridMat = grid.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.18;
    scene.add(grid);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(-5, 10, 4);
    scene.add(sun);

    // Volumes rise from their base on load, one after another.
    const volumes = SITE.map((s, i) => {
      const geo = new THREE.BoxGeometry(FOOT, s.h, FOOT);
      geo.translate(0, s.h / 2, 0); // pivot at the base
      const mat = new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.95 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(s.x, 0, s.z);
      mesh.scale.y = reduce ? 1 : 0.001;
      mesh.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color: INK })
        )
      );
      scene.add(mesh);
      scene.add(dimension(s.x, s.z));
      return { mesh, mat, grow: reduce ? 1 : 0, delay: i * 0.12 };
    });

    // Camera flight between the overview and a single volume.
    const target = new THREE.Vector3();
    let zoomGoal = 1;
    let flying = false;

    focusRef.current = (i) => {
      volumes.forEach((v, j) => v.mat.color.setHex(j === i ? SIGNAL : PAPER));
      if (i === null) {
        target.set(0, 0, 0);
        zoomGoal = 1;
      } else {
        const s = SITE[i];
        target.set(s.x, s.h / 2, s.z);
        zoomGoal = 1.7;
      }
      flying = true;
    };

    controls.addEventListener("start", () => {
      flying = false;
    });

    // Click or tap a volume to select it (ignored if the pointer dragged).
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down: [number, number] | null = null;
    const onDown = (e: PointerEvent) => {
      down = [e.clientX, e.clientY];
    };
    const onUp = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(volumes.map((v) => v.mesh), false)[0];
      if (hit) {
        const i = volumes.findIndex((v) => v.mesh === hit.object);
        selectRef.current?.(i);
      }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    // Keep the orthographic frustum matched to the container shape.
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      const half = 5.5;
      const a = w / h;
      if (a >= 1) {
        camera.left = -half * a;
        camera.right = half * a;
        camera.top = half;
        camera.bottom = -half;
      } else {
        camera.left = -half;
        camera.right = half;
        camera.top = half / a;
        camera.bottom = -half / a;
      }
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let elapsed = 0;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      elapsed += clock.getDelta();

      volumes.forEach((v) => {
        if (v.grow < 1) {
          v.grow = Math.min(1, Math.max(0, (elapsed - v.delay) / 1.4));
          v.mesh.scale.y = Math.max(0.001, 1 - Math.pow(1 - v.grow, 3));
        }
      });

      if (flying) {
        controls.target.lerp(target, 0.08);
        camera.position.lerp(controls.target.clone().add(OFFSET), 0.08);
        camera.zoom += (zoomGoal - camera.zoom) * 0.08;
        camera.updateProjectionMatrix();
        if (controls.target.distanceTo(target) < 0.001 && Math.abs(zoomGoal - camera.zoom) < 0.001) {
          flying = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      volumes.forEach((v) => {
        v.mesh.geometry.dispose();
        v.mat.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    focusRef.current(activeIndex);
  }, [activeIndex]);

  return <div ref={mountRef} className="h-full w-full" />;
}
