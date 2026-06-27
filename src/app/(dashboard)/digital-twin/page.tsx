"use client";

import { useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
  useNodesState,
  useEdgesState,
  BaseEdge,
  getBezierPath,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { X, Thermometer, Zap, Activity, Battery } from "lucide-react";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { cn, formatNumber, formatPercentage, formatTemperature } from "@/shared/lib/utils";
import { useDigitalTwinStore } from "@/store/digital-twin.store";
import type { ComponentId } from "@/shared/types";

const NODE_CONFIG: Record<ComponentId, { label: string; icon: string; color: string }> = {
  "hydrogen-tank": { label: "Hydrogen Tank", icon: "💧", color: "#14b8a6" },
  "fuel-cell": { label: "Fuel Cell", icon: "⚡", color: "#3b82f6" },
  "battery": { label: "Battery", icon: "🔋", color: "#22c55e" },
  "inverter": { label: "Inverter", icon: "🔄", color: "#a855f7" },
  "traction-motor": { label: "Traction Motor", icon: "⚙️", color: "#f59e0b" },
  "wheels": { label: "Wheels", icon: "🚂", color: "#ef4444" },
};

const INITIAL_NODES: Node[] = [
  { id: "hydrogen-tank", type: "component", position: { x: 50, y: 200 }, data: { componentId: "hydrogen-tank" } },
  { id: "fuel-cell", type: "component", position: { x: 300, y: 200 }, data: { componentId: "fuel-cell" } },
  { id: "battery", type: "component", position: { x: 300, y: 400 }, data: { componentId: "battery" } },
  { id: "inverter", type: "component", position: { x: 550, y: 200 }, data: { componentId: "inverter" } },
  { id: "traction-motor", type: "component", position: { x: 800, y: 200 }, data: { componentId: "traction-motor" } },
  { id: "wheels", type: "component", position: { x: 1050, y: 200 }, data: { componentId: "wheels" } },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1", source: "hydrogen-tank", target: "fuel-cell", type: "powerflow", label: "H₂ Flow", animated: true },
  { id: "e2", source: "fuel-cell", target: "inverter", type: "powerflow", label: "DC Power", animated: true },
  { id: "e3", source: "battery", target: "inverter", type: "powerflow", label: "DC Power", animated: true },
  { id: "e4", source: "fuel-cell", target: "battery", type: "powerflow", label: "Charge", animated: true },
  { id: "e5", source: "inverter", target: "traction-motor", type: "powerflow", label: "AC Power", animated: true },
  { id: "e6", source: "traction-motor", target: "wheels", type: "powerflow", label: "Torque", animated: true },
];

function ComponentNode({ data }: NodeProps) {
  const componentId = data.componentId as ComponentId;
  const config = NODE_CONFIG[componentId];
  const components = useDigitalTwinStore((s) => s.components);
  const selectComponent = useDigitalTwinStore((s) => s.selectComponent);
  const comp = components.find((c) => c.id === componentId);

  return (
    <div
      onClick={() => selectComponent(componentId)}
      className={cn(
        "glass-card p-4 cursor-pointer min-w-[140px] transition-all duration-200",
        "hover:border-[var(--color-primary)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
        comp?.metrics.health && comp.metrics.health < 40 && "border-[var(--color-destructive)]",
        comp?.metrics.health && comp.metrics.health >= 40 && comp.metrics.health < 70 && "border-[var(--color-warning)]",
        comp?.metrics.health && comp.metrics.health >= 70 && "border-[var(--color-glass-border)]",
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{config.icon}</span>
        <span className="text-sm font-semibold text-foreground">{config.label}</span>
      </div>
      {comp ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-muted)]">Power</span>
            <span className="text-foreground font-mono">{comp.metrics.power.toFixed(0)} kW</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-muted)]">Temp</span>
            <span className="text-foreground font-mono">{comp.metrics.temperature.toFixed(1)}°C</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-[var(--color-secondary)] rounded-full h-1.5">
              <div
                className="rounded-full h-1.5 transition-all duration-500"
                style={{
                  width: `${comp.metrics.health}%`,
                  backgroundColor: config.color,
                }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-muted)] mt-0.5 block text-right">
              {comp.metrics.health.toFixed(0)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="h-16 animate-pulse bg-[var(--color-secondary)] rounded" />
      )}
    </div>
  );
}

function PowerFlowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: "rgba(59, 130, 246, 0.4)", strokeWidth: 2 }} />
      <BaseEdge
        path={edgePath}
        style={{
          stroke: "rgba(59, 130, 246, 0.8)",
          strokeWidth: 2,
          strokeDasharray: "8 4",
          animation: "flow 1s linear infinite",
        }}
      />
    </>
  );
}

const nodeTypes = { component: ComponentNode };
const edgeTypes = { powerflow: PowerFlowEdge };

export default function DigitalTwinPage() {
  const [nodes, _setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const { components, selectedComponentId, selectComponent, fetchComponents } = useDigitalTwinStore();
  const selectedComponent = components.find((c) => c.id === selectedComponentId);

  useEffect(() => {
    const interval = setInterval(fetchComponents, 500);
    return () => clearInterval(interval);
  }, [fetchComponents]);

  const metricIcons: Record<string, React.ReactNode> = {
    temperature: <Thermometer className="w-3.5 h-3.5 text-[var(--color-destructive)]" />,
    voltage: <Zap className="w-3.5 h-3.5 text-[var(--color-success)]" />,
    current: <Activity className="w-3.5 h-3.5 text-[var(--color-accent)]" />,
    power: <Zap className="w-3.5 h-3.5 text-[var(--color-info)]" />,
    efficiency: <Activity className="w-3.5 h-3.5 text-[var(--color-accent)]" />,
    health: <Battery className="w-3.5 h-3.5 text-[var(--color-success)]" />,
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <PageHeader title="Digital Twin" description="Interactive system diagram" />

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 glass-card overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.5}
            maxZoom={2}
            defaultEdgeOptions={{
              style: { stroke: "rgba(59, 130, 246, 0.3)", strokeWidth: 2 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="rgba(59, 130, 246, 0.05)" gap={20} />
            <Controls
              className="bg-[var(--color-card)] border border-[var(--color-glass-border)] rounded-lg [&>button]:text-[var(--color-muted)] [&>button]:border-[var(--color-glass-border)] [&>button]:hover:bg-[var(--color-sidebar-hover)]"
            />
            <MiniMap
              nodeColor={() => "rgba(59, 130, 246, 0.3)"}
              maskColor="rgba(10, 14, 23, 0.8)"
              className="glass-card !border-[var(--color-glass-border)]"
            />
          </ReactFlow>
        </div>

        <AnimatePresence>
          {selectedComponent && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-80 flex-shrink-0"
            >
              <GlassPanel className="p-5 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{NODE_CONFIG[selectedComponent.id]?.icon}</span>
                    <h3 className="text-sm font-semibold text-foreground">{selectedComponent.name}</h3>
                  </div>
                  <button
                    onClick={() => selectComponent(null)}
                    className="text-[var(--color-muted)] hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <StatusBadge status={selectedComponent.status} className="mb-4" />

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                    Metrics
                  </h4>
                  {Object.entries(selectedComponent.metrics).map(([key, value]) => {
                    if (typeof value !== "number") return null;
                    const icon = metricIcons[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between py-1.5 border-b border-[var(--color-card-border)] last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="text-xs text-[var(--color-muted)] capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-foreground">
                          {key === "temperature"
                            ? formatTemperature(value)
                            : key === "efficiency" || key === "health"
                              ? formatPercentage(value)
                              : formatNumber(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-card-border)]">
                  <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                    Events
                  </h4>
                  <div className="text-xs text-[var(--color-muted)] text-center py-4">
                    No recent events for this component
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
