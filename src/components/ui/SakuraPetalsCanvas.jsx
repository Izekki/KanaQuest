import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SakuraPetalsCanvas
 * 
 * Implements GPU-accelerated falling sakura petals with Three.js.
 * Built adhering to /three-best-practices:
 * - setup-modern-imports & setup-choose-renderer
 * - mobile-cap-pixel-ratio (cap at 2)
 * - memory-dispose-in-react (recursive disposal of geometry, material, renderer, context loss)
 * - render-delta-time (frame-rate independent motion via THREE.Clock)
 * - render-avoid-allocations (zero allocations in animation loop)
 * - render-visibility-pause (pauses when browser tab is inactive)
 * - drawcall-instanced-mesh (single draw call for all petals)
 * - mobile-touch-and-pointer-events (pointer-events: none)
 * - mobile-adaptive-particle-count (scaled down on mobile screens)
 */
export default function SakuraPetalsCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 22;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // Cap at 2 per mobile-cap-pixel-ratio
    container.appendChild(renderer.domElement);

    // 3. Petal Geometry (Curved stylized petal shape)
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, -0.6);
    petalShape.bezierCurveTo(0.45, -0.4, 0.5, 0.3, 0.1, 0.7);
    petalShape.bezierCurveTo(0, 0.65, -0.1, 0.65, -0.1, 0.7);
    petalShape.bezierCurveTo(-0.5, 0.3, -0.45, -0.4, 0, -0.6);

    const geometry = new THREE.ShapeGeometry(petalShape, 12);

    // 4. Material
    const material = new THREE.MeshBasicMaterial({
      color: 0xf4b7c3,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false, // Prevents alpha sorting glitches
    });

    // 5. Instanced Mesh
    const isMobile = width < 768;
    const COUNT = isMobile ? 24 : 48; // mobile-adaptive-particle-count
    const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT);

    // Pre-allocated reusable objects for animation loop (render-avoid-allocations)
    const dummy = new THREE.Object3D();
    const tempMatrix = new THREE.Matrix4();
    let lastTime = performance.now();

    // Petal physics data
    const particles = new Float32Array(COUNT * 7); // x, y, z, rx, ry, rz, speed

    const X_RANGE = 28;
    const Y_RANGE = 30;
    const Z_RANGE = 14;

    for (let i = 0; i < COUNT; i++) {
      const idx = i * 7;
      particles[idx] = (Math.random() - 0.5) * X_RANGE; // x
      particles[idx + 1] = (Math.random() - 0.5) * Y_RANGE; // y
      particles[idx + 2] = (Math.random() - 0.5) * Z_RANGE; // z
      particles[idx + 3] = Math.random() * Math.PI; // rx
      particles[idx + 4] = Math.random() * Math.PI; // ry
      particles[idx + 5] = Math.random() * Math.PI; // rz
      particles[idx + 6] = 0.8 + Math.random() * 0.9; // fall speed

      dummy.position.set(particles[idx], particles[idx + 1], particles[idx + 2]);
      dummy.rotation.set(particles[idx + 3], particles[idx + 4], particles[idx + 5]);
      const s = 0.55 + Math.random() * 0.45;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(instancedMesh);

    // 6. Visibility pause handling (render-visibility-pause)
    let isPaused = false;
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) lastTime = performance.now(); // Reset delta to prevent teleporting
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 7. Resize handling (setup-resize-handling)
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 8. Render loop with delta time (render-delta-time)
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isPaused) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1); // Cap delta to prevent giant jumps
      lastTime = now;

      for (let i = 0; i < COUNT; i++) {
        const idx = i * 7;

        // Gravity + gentle wind drift
        particles[idx + 1] -= particles[idx + 6] * 1.6 * delta; // Fall downwards
        particles[idx] += Math.sin(particles[idx + 1] * 0.4 + i) * 0.9 * delta; // Horizontal sway

        // Tumbling rotations
        particles[idx + 3] += 1.2 * delta;
        particles[idx + 4] += 0.8 * delta;
        particles[idx + 5] += 0.6 * delta;

        // Wrap around bottom
        if (particles[idx + 1] < -Y_RANGE / 2) {
          particles[idx + 1] = Y_RANGE / 2 + Math.random() * 2;
          particles[idx] = (Math.random() - 0.5) * X_RANGE;
        }

        dummy.position.set(particles[idx], particles[idx + 1], particles[idx + 2]);
        dummy.rotation.set(particles[idx + 3], particles[idx + 4], particles[idx + 5]);
        const s = 0.55 + (i % 4) * 0.12;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 9. Full cleanup on unmount (memory-dispose-in-react)
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();

      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    />
  );
}
