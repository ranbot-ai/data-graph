import GraphCard from "./GraphCard";
import type { GraphConfig } from "@/lib/types";

interface Props {
  graphs: GraphConfig[];
  rows: Record<string, unknown>[];
  defaultGraphCount: number;
  onRemove: (id: string) => void;
}

export default function GraphGrid({
  graphs,
  rows,
  defaultGraphCount,
  onRemove,
}: Props) {
  if (graphs.length === 0) return null;

  return (
    <div
      className="grid gap-4 mt-4"
      style={{
        gridTemplateColumns: `repeat(${defaultGraphCount}, minmax(0, 1fr))`,
      }}
    >
      {graphs.map((config) => (
        <GraphCard
          key={config.id}
          config={config}
          rows={rows}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
