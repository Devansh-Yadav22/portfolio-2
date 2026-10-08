import { useEffect, useRef, useState } from 'react';
import { constellationNodes, skillCategories } from '../content/skills';
import { projects } from '../content/projects';

interface GraphNode {
  id: string;
  label: string;
  isProject?: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  linkedProjectIds: string[];
}

interface GraphEdge {
  sourceId: string;
  targetId: string;
}

export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    // Taller canvas per Item E
    const height = (canvas.height = 580);

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Project nodes spread across central ellipse
    projects.forEach((proj, i) => {
      const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
      const rx = width * 0.28;
      const ry = height * 0.28;
      nodes.push({
        id: proj.id,
        label: proj.title,
        isProject: true,
        x: width / 2 + Math.cos(angle) * rx,
        y: height / 2 + Math.sin(angle) * ry,
        vx: 0,
        vy: 0,
        radius: 8,
        linkedProjectIds: [proj.id],
      });
    });

    // Skill nodes spread across outer ring
    constellationNodes.forEach((skill, i) => {
      const angle = (i / constellationNodes.length) * Math.PI * 2 + 0.2;
      const rx = width * 0.42 + (i % 2) * 25;
      const ry = height * 0.40 + (i % 3) * 20;
      nodes.push({
        id: skill.id,
        label: skill.label,
        x: width / 2 + Math.cos(angle) * rx,
        y: height / 2 + Math.sin(angle) * ry,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: 4.5,
        linkedProjectIds: skill.linkedProjects,
      });

      // Edges linking skill to projects
      skill.linkedProjects.forEach((projId) => {
        edges.push({
          sourceId: skill.id,
          targetId: projId,
        });
      });
    });

    nodesRef.current = nodes;
    edgesRef.current = edges;

    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Subtle alive floating motion
      nodes.forEach((node, i) => {
        if (!node.isProject) {
          node.x += Math.sin(t + i) * 0.12;
          node.y += Math.cos(t * 0.8 + i) * 0.12;
        }
      });

      // Highlighted IDs: active node and its direct neighbors
      const highlightedIds = new Set<string>();
      if (activeNodeId) {
        highlightedIds.add(activeNodeId);
        edges.forEach((e) => {
          if (e.sourceId === activeNodeId) highlightedIds.add(e.targetId);
          if (e.targetId === activeNodeId) highlightedIds.add(e.sourceId);
        });
      }

      // 1. Draw Edges
      edges.forEach((edge) => {
        const s = nodes.find((n) => n.id === edge.sourceId);
        const tg = nodes.find((n) => n.id === edge.targetId);
        if (!s || !tg) return;

        const isHighlighted = activeNodeId && (s.id === activeNodeId || tg.id === activeNodeId);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tg.x, tg.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#FFB23E';
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = 0.95;
        } else {
          ctx.strokeStyle = '#1B2430';
          ctx.lineWidth = 1;
          ctx.globalAlpha = activeNodeId ? 0.15 : 0.45;
        }
        ctx.stroke();
      });

      // 2. Draw Nodes
      nodes.forEach((node) => {
        const isSelf = node.id === activeNodeId;
        const isConnected = highlightedIds.has(node.id);
        const isDimmed = activeNodeId !== null && !isConnected;

        ctx.globalAlpha = isDimmed ? 0.2 : 1.0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.isProject) {
          ctx.fillStyle = isSelf || isConnected ? '#FFB23E' : '#E9E5DD';
          ctx.strokeStyle = '#06080C';
          ctx.lineWidth = 2.5;
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = isConnected ? '#FFB23E' : '#7B8794';
          ctx.fill();
        }

        // Target Item E: Show labels only for project nodes, hovered node and its neighbours
        const shouldShowLabel = node.isProject || isSelf || isConnected;

        if (shouldShowLabel) {
          ctx.font = node.isProject
            ? '600 13px "JetBrains Mono", monospace'
            : '400 12px "JetBrains Mono", monospace';

          ctx.fillStyle = isConnected || isSelf ? '#FFB23E' : '#E9E5DD';
          // Offset text slightly
          ctx.fillText(node.label, node.x + node.radius + 6, node.y + 4);
        }
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let hovered: GraphNode | null = null;
      for (const node of nodes) {
        const d = Math.hypot(node.x - mx, node.y - my);
        if (d < node.radius + 10) {
          hovered = node;
          break;
        }
      }
      setActiveNodeId(hovered ? hovered.id : null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeNodeId]);

  return (
    <section id="skills" className="relative z-10 w-full py-28 px-6 sm:px-12 md:px-20 lg:px-28 max-w-7xl mx-auto">
      {/* Heading per Item C: Skills (no ampersand, short plain subhead) */}
      <div className="mb-10">
        <h2 className="font-serif text-3xl sm:text-5xl text-bone font-normal tracking-tight">
          Skills
        </h2>
        <p className="font-serif text-base text-mute mt-3 max-w-xl">
          Click a technology to see which projects used it.
        </p>
      </div>

      {/* Full-width, taller interactive canvas per Item E */}
      <div className="relative border border-line bg-ink-2/40 p-2 sm:p-4 mb-16 panel-card">
        <canvas
          ref={canvasRef}
          className="w-full h-[580px] cursor-crosshair block"
          aria-label="Constellation graph of skills and projects"
        />
      </div>

      {/* Compact secondary grouped list per Item E with sentence-case muted labels per Item C */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-line text-xs font-mono">
        {skillCategories.map((cat) => (
          <div key={cat.id} className="space-y-2">
            <h3 className="text-mute font-medium">
              {cat.name}
            </h3>
            <ul className="space-y-1 text-mute/80">
              {cat.skills.map((skill) => (
                <li
                  key={skill}
                  className="hover:text-bone cursor-pointer transition-colors"
                  onMouseEnter={() => {
                    const match = constellationNodes.find((n) => n.label.toLowerCase() === skill.toLowerCase());
                    if (match) setActiveNodeId(match.id);
                  }}
                  onMouseLeave={() => setActiveNodeId(null)}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
