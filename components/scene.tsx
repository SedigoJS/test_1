"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** Shared with the DOM: which project the reader is pointing at (-1 = none). */
export const hover = { index: -1 };

// Section ids in page order. Each section owns one 3D group stacked on the Y axis.
export const SECTION_IDS = ["hero", "work", "specs", "about", "contact"];
const SPACING = 22;
const FLOOR_Y = -2.6;
const TILES: [string, string][] = [
  ["01", "Lume E-Commerce"],
  ["02", "LMS x AAI"],
  ["03", "SurfxBini"],
  ["04", "ALAW Projects"],
  ["05", "Randomizer"],
  ["06", "CloudCast"],
];

function labelTexture(index: string, title: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 300;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgba(255,255,255,0.92)";
  g.fillRect(0, 0, 512, 300);
  g.fillStyle = "#7c3aed";
  g.font = "600 28px Inter, sans-serif";
  g.fillText(index, 44, 76);
  g.fillStyle = "#111827";
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
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.9;

    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(-4, 9, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.radius = 8;
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);

    // Frosted, iridescent glass: the look of the reference.
    const glass = (rough = 0.06) =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: rough,
        transmission: 0.82,
        thickness: 1.2,
        ior: 1.45,
        iridescence: 1,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [200, 600],
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      });
    const solid = (color: number) =>
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.6 });

    const groups = SECTION_IDS.map((_, i) => {
      const g = new THREE.Group();
      g.position.y = -i * SPACING;
      scene.add(g);
      // Soft shadow catcher under each section's object.
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 22),
        new THREE.ShadowMaterial({ opacity: 0.1 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = FLOOR_Y;
      floor.receiveShadow = true;
      g.add(floor);
      return g;
    });
    const cast = (m: THREE.Mesh) => {
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };

    // Hero: glass pyramid, tilted slabs, a sphere and a cube
    const heroMeshes: THREE.Mesh[] = [];
    const pyramid = cast(new THREE.Mesh(new THREE.ConeGeometry(1.9, 3.4, 4), glass()));
    pyramid.rotation.y = Math.PI / 4;
    pyramid.position.y = -0.2;
    heroMeshes.push(pyramid);
    const slab = cast(new THREE.Mesh(new RoundedBoxGeometry(3.6, 0.14, 2.2, 4, 0.05), glass(0.04)));
    slab.position.set(-2.6, -1.2, 0.4);
    slab.rotation.set(0.25, -0.5, -0.12);
    heroMeshes.push(slab);
    const slab2 = cast(new THREE.Mesh(new RoundedBoxGeometry(2.4, 0.1, 1.6, 4, 0.04), glass(0.04)));
    slab2.position.set(2.8, 1.2, -1.2);
    slab2.rotation.set(-0.3, 0.6, 0.2);
    heroMeshes.push(slab2);
    const orb = cast(new THREE.Mesh(new THREE.SphereGeometry(0.6, 64, 64), glass(0.02)));
    orb.position.set(2.2, -1.6, 1.6);
    heroMeshes.push(orb);
    const cube = cast(new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.9, 0.9, 3, 0.12), glass()));
    cube.position.set(-1.8, 1.6, 1.4);
    heroMeshes.push(cube);
    heroMeshes.forEach((m) => groups[0].add(m));

    // Work: a ring of frosted cards that turns to face the hovered project
    const ring = new THREE.Group();
    groups[1].add(ring);
    const tiles = TILES.map(([idx, title], i) => {
      const a = (i / TILES.length) * Math.PI * 2;
      const R = 4.8;
      const tile = new THREE.Group();
      tile.position.set(Math.sin(a) * R, 0, Math.cos(a) * R);
      tile.rotation.y = a;
      const body = cast(new THREE.Mesh(new RoundedBoxGeometry(3.2, 2.0, 0.2, 6, 0.14), glass(0.15)));
      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(2.9, 1.7),
        new THREE.MeshBasicMaterial({ map: labelTexture(idx, title), transparent: true })
      );
      face.position.z = 0.115;
      tile.add(body, face);
      ring.add(tile);
      return tile;
    });

    // Specs: six iridescent spheres in a 3 x 2 grid
    const specs = [0, 1, 2, 3, 4, 5].map((i) => {
      const m = cast(new THREE.Mesh(new THREE.SphereGeometry(0.7, 64, 64), glass(0.04)));
      m.position.set((i % 3 - 1) * 2.4, i < 3 ? 0.9 : -0.9, 0);
      groups[2].add(m);
      return m;
    });

    // About: framed portrait
    const pm = new THREE.MeshStandardMaterial({ roughness: 0.5 });
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.5), pm);
    const frame = cast(new THREE.Mesh(new RoundedBoxGeometry(3.9, 4.8, 0.2, 6, 0.2), solid(0xffffff)));
    frame.position.z = -0.15;
    groups[3].add(frame, photo);
    new THREE.TextureLoader().load("/profile.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      pm.map = tex;
      pm.needsUpdate = true;
    });

    // Contact: glass torus knot
    const knot = cast(new THREE.Mesh(new THREE.TorusKnotGeometry(1.4, 0.42, 220, 40), glass(0.05)));
    groups[4].add(knot);

    // Section centres in page coordinates, so the camera follows the scroll.
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
      camera.position.set(pointerX * 0.4, curY + 1.2 + pointerY * 0.25, dist);
      camera.lookAt(-shift, curY, 0);

      if (!reduce) {
        pyramid.rotation.y += dt * 0.12;
        slab.rotation.z += dt * 0.08;
        orb.position.y = -1.6 + Math.sin(time * 0.9) * 0.2;
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
