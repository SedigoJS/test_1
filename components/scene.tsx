"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** Shared with the DOM: which project the reader is pointing at (-1 = none). */
export const hover = { index: -1 };

// Section ids in page order. Each section owns one 3D object stacked on the Y axis.
export const SECTION_IDS = ["hero", "work", "specs", "about", "contact"];
const SPACING = 22;
const TILES: [string, string][] = [
  ["01", "Lume E-Commerce"],
  ["02", "LMS x AAI"],
  ["03", "SurfxBini"],
  ["04", "ALAW Projects"],
  ["05", "Randomizer"],
  ["06", "CloudCast"],
];
const SPEC_COLORS = [0x4f46e5, 0x06b6d4, 0x8b5cf6, 0x0ea5e9, 0x6366f1, 0x14b8a6];

function labelTexture(index: string, title: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 300;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 512, 300);
  g.fillStyle = "#4f46e5";
  g.font = "600 28px Inter, sans-serif";
  g.fillText(index, 44, 76);
  g.fillStyle = "#0f172a";
  g.font = "700 46px Inter, sans-serif";
  g.fillText(title, 44, 184);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(4, 8, 6);
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);

    const mat = (color: number, rough = 0.25) =>
      new THREE.MeshPhysicalMaterial({ color, roughness: rough, clearcoat: 1, clearcoatRoughness: 0.15 });

    const groups = SECTION_IDS.map((_, i) => {
      const g = new THREE.Group();
      g.position.y = -i * SPACING;
      scene.add(g);
      return g;
    });

    // Hero: glass core with orbiting spheres
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), mat(0xffffff, 0.08));
    groups[0].add(core);
    [0x4f46e5, 0x06b6d4, 0x8b5cf6].forEach((c, i) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 48), mat(c));
      const a = (i / 3) * Math.PI * 2;
      s.position.set(Math.cos(a) * 3.2, Math.sin(a * 2) * 0.9, Math.sin(a) * 3.2);
      groups[0].add(s);
    });

    // Work: a ring of project cards that turns to face the hovered project
    const ring = new THREE.Group();
    groups[1].add(ring);
    const tiles = TILES.map(([idx, title], i) => {
      const a = (i / TILES.length) * Math.PI * 2;
      const R = 4.8;
      const tile = new THREE.Group();
      tile.position.set(Math.sin(a) * R, 0, Math.cos(a) * R);
      tile.rotation.y = a;
      const body = new THREE.Mesh(new RoundedBoxGeometry(3.2, 2.0, 0.2, 6, 0.14), mat(0xffffff, 0.3));
      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(2.9, 1.7),
        new THREE.MeshBasicMaterial({ map: labelTexture(idx, title), transparent: true })
      );
      face.position.z = 0.115;
      tile.add(body, face);
      ring.add(tile);
      return tile;
    });

    // Specs: six spheres in a 3 x 2 grid
    const specs = SPEC_COLORS.map((c, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat(c, 0.2));
      m.position.set((i % 3 - 1) * 2.4, i < 3 ? 0.9 : -0.9, 0);
      groups[2].add(m);
      return m;
    });

    // About: framed portrait
    const pm = new THREE.MeshStandardMaterial({ roughness: 0.6 });
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.5), pm);
    const frame = new THREE.Mesh(new RoundedBoxGeometry(3.9, 4.8, 0.2, 6, 0.2), mat(0xffffff, 0.4));
    frame.position.z = -0.15;
    groups[3].add(frame, photo);
    new THREE.TextureLoader().load("/profile.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      pm.map = tex;
      pm.needsUpdate = true;
    });

    // Contact: torus knot
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.4, 0.42, 200, 32), mat(0x4f46e5, 0.2));
    groups[4].add(knot);

    // Section centres in page coordinates, measured so the camera follows the scroll.
    const centers: number[] = [];
    const measure = () => {
      centers.length = 0;
      SECTION_IDS.forEach((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        centers.push(r ? r.top + window.scrollY + r.height / 2 : 0);
      });
    };

    // Scroll position -> world height, eased between neighbouring sections.
    const targetYAt = (pos: number) => {
      if (centers.length < 2 || pos <= centers[0]) return 0;
      for (let i = 0; i < centers.length - 1; i++) {
        if (pos < centers[i + 1]) {
          const t = (pos - centers[i]) / (centers[i + 1] - centers[i]);
          const s = t * t * (3 - 2 * t);
          return -(i + s) * SPACING;
        }
      }
      return -(centers.length - 1) * SPACING;
    };

    let pointerX = 0;
    let pointerY = 0;
    const onMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      measure();
    };
    resize();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let curY = 0;
    let ringRot = 0;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = clock.getDelta();
      const time = clock.elapsedTime;

      curY += (targetYAt(window.scrollY + window.innerHeight / 2) - curY) * 0.08;

      // Desktop: keep objects on the right half so the copy has room on the left.
      const aspect = camera.aspect;
      const dist = aspect < 1 ? 26 : 15;
      const visW = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect;
      const shift = aspect >= 1 ? visW * 0.22 : 0;
      camera.position.set(pointerX * 0.4, curY + pointerY * 0.25, dist);
      camera.lookAt(-shift, curY, 0);

      if (!reduce) {
        core.rotation.y += dt * 0.25;
        core.rotation.x += dt * 0.1;
        knot.rotation.y += dt * 0.3;
        specs.forEach((m) => (m.rotation.y += dt * 0.5));
      }

      // Ring turns to face the hovered project, otherwise drifts slowly.
      const want = hover.index >= 0 ? -(hover.index / TILES.length) * Math.PI * 2 : reduce ? 0 : time * 0.05;
      ringRot += (want - ringRot) * 0.06;
      ring.rotation.y = ringRot;
      tiles.forEach((t, i) => {
        const s = hover.index === i ? 1.08 : 1;
        t.scale.setScalar(t.scale.x + (s - t.scale.x) * 0.15);
      });

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      pmrem.dispose();
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 h-screen w-screen" aria-hidden="true" />;
}
