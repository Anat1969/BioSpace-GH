import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Subtle forest-tinted wireframe structure that rotates slowly behind the hero.
 * Vanilla three.js (no react-three-fiber). Transparent, pointer-events-none,
 * DPR-capped, and paused while the tab is hidden. Loaded lazily by HeroSection.
 */
export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let w = el.clientWidth || 1;
    let h = el.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Wireframe icosahedron — "architected" organic form
    const geo = new THREE.IcosahedronGeometry(1.55, 1);
    const wire = new THREE.WireframeGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: 0x2f5c42, transparent: true, opacity: 0.6 });
    const mesh = new THREE.LineSegments(wire, mat);
    scene.add(mesh);

    // Faint vertex points
    const ptsMat = new THREE.PointsMaterial({ color: 0x5b8a6b, size: 0.04, transparent: true, opacity: 0.7 });
    const points = new THREE.Points(geo, ptsMat);
    scene.add(points);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (document.hidden) return; // pause work while tab is hidden
      const t = clock.getElapsedTime();
      mesh.rotation.y = t * 0.14;
      mesh.rotation.x = Math.sin(t * 0.1) * 0.25;
      points.rotation.copy(mesh.rotation);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!el) return;
      w = el.clientWidth || 1;
      h = el.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      wire.dispose();
      mat.dispose();
      ptsMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
