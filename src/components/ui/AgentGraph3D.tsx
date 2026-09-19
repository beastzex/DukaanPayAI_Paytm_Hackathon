'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AgentNodeData {
  id: string;
  name: string;
  role: string;
  position: [number, number, number];
  isCentral?: boolean;
}

const AGENTS: AgentNodeData[] = [
  {
    id: 'orchestrator',
    name: 'LangGraph Orchestrator',
    role: 'Central state machine coordinating agent transitions & confidence gates.',
    position: [0, 0, 0],
    isCentral: true,
  },
  {
    id: 'bi',
    name: 'Business Intelligence',
    role: 'Synthesizes daily GMV, margin leakage & credit khata balance.',
    position: [-2.2, 1.2, 0.5],
  },
  {
    id: 'demand',
    name: 'Demand Forecast',
    role: 'Prophet time-series regression for rainfall & festival peaks.',
    position: [2.2, 1.3, -0.4],
  },
  {
    id: 'footfall',
    name: 'Footfall Model',
    role: 'LightGBM pedestrian traffic & rush-hour queue estimation.',
    position: [-1.8, -1.5, 0.8],
  },
  {
    id: 'inventory',
    name: 'Inventory Restock',
    role: 'XGBoost safety stock thresholds & supplier cutoff alerts.',
    position: [1.9, -1.4, 0.6],
  },
  {
    id: 'retention',
    name: 'Customer Retention',
    role: 'RFM segmentation flagging dormant society shoppers.',
    position: [-0.4, 2.4, -1.0],
  },
  {
    id: 'campaign',
    name: 'Campaign Execution',
    role: 'Dispatches 1-tap WhatsApp broadcasts & Soundbox announcements.',
    position: [0.3, -2.4, -0.8],
  },
];

export const AgentGraph3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<AgentNodeData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent to inherit light container

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for rotation
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Node meshes mapping
    const nodeMeshes: { mesh: THREE.Mesh; data: AgentNodeData }[] = [];

    // Materials tailored for white/light theme contrast
    const tealColor = new THREE.Color(0x0d9488); // Deep teal
    const centralColor = new THREE.Color(0x0f172a); // Deep slate

    AGENTS.forEach((agent) => {
      // Geometry: Low-poly icosahedron wireframe
      const geom = new THREE.IcosahedronGeometry(agent.isCentral ? 0.45 : 0.28, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: agent.isCentral ? centralColor : tealColor,
        wireframe: true,
        transparent: true,
        opacity: agent.isCentral ? 0.95 : 0.85,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...agent.position);
      graphGroup.add(mesh);
      nodeMeshes.push({ mesh, data: agent });

      // Connect line to central orchestrator
      if (!agent.isCentral) {
        const linePoints = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(...agent.position),
        ];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: tealColor,
          transparent: true,
          opacity: 0.35,
        });
        const line = new THREE.Line(lineGeom, lineMat);
        graphGroup.add(line);
      }
    });

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const onMouseLeave = () => {
      mouse.x = -100;
      mouse.y = -100;
      setHoveredNode(null);
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        graphGroup.rotation.y += 0.0035;
        graphGroup.rotation.x = Math.sin(graphGroup.rotation.y * 0.5) * 0.15;
      }

      // Check intersections
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) {
          setHoveredNode(hit.data);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredNode(null);
        document.body.style.cursor = 'default';
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 460;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] flex items-center justify-center overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Minimal Tooltip on Node Hover (tailored for light mode) */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none text-left bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-sans max-w-[260px] shadow-md -translate-x-1/2 -translate-y-12"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="font-mono text-[10px] text-teal-700 font-semibold mb-0.5">
            {hoveredNode.isCentral ? 'CORE SYSTEM' : 'SPECIALIZED AGENT'}
          </div>
          <div className="font-semibold text-slate-900 leading-tight mb-1">
            {hoveredNode.name}
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            {hoveredNode.role}
          </p>
        </div>
      )}

      {/* Static corner hint */}
      <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-500">
        LangGraph state machine / Groq LPU
      </div>
    </div>
  );
};
