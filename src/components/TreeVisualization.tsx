import React from 'react';

interface TreeVisualizationProps {
  data: (number | string | null)[];
  highlights?: {
    root?: number;
    comparing?: number[];
    swapping?: number[];
    sorted?: number[];
    active?: number[];
    current?: number;
  };
  maxElements?: number;
  showIndices?: boolean;
}

interface TreeNode {
  value: number | string | null;
  index: number;
  x: number;
  y: number;
}

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  data,
  highlights = {},
  maxElements = 15,
  showIndices = true
}) => {
  const visibleData = data.slice(0, maxElements);
  const n = visibleData.length;
  if (n === 0) return <div className="tree-container" style={{textAlign: 'center', color: 'var(--text-muted)', padding: '2rem'}}>Empty</div>;

  // Calculate tree depth
  const depth = Math.ceil(Math.log2(n + 1));
  const nodeRadius = 18;
  const levelHeight = 55;
  const svgHeight = depth * levelHeight + 40;
  const svgWidth = Math.max(400, n * 45);

  // Position nodes
  const nodes: TreeNode[] = [];
  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const x = svgWidth / 2 + (posInLevel - (nodesInLevel - 1) / 2) * (svgWidth / (nodesInLevel + 1));
    const y = 30 + level * levelHeight;
    nodes.push({ value: visibleData[i], index: i, x, y });
  }

  const getNodeColor = (index: number): string => {
    if (highlights.swapping?.includes(index)) return 'var(--error)';
    if (highlights.comparing?.includes(index)) return 'var(--comparing)';
    if (highlights.root === index) return 'var(--accent)';
    if (highlights.current === index) return 'var(--active)';
    if (highlights.sorted?.includes(index)) return 'var(--sorted)';
    if (highlights.active?.includes(index)) return 'var(--text-secondary)';
    return 'var(--text-secondary)';
  };

  const getNodeBg = (index: number): string => {
    if (highlights.swapping?.includes(index)) return 'var(--error-light)';
    if (highlights.comparing?.includes(index)) return 'var(--comparing-light)';
    if (highlights.root === index) return 'var(--accent-light)';
    if (highlights.current === index) return 'var(--active-light)';
    if (highlights.sorted?.includes(index)) return 'var(--sorted-light)';
    return 'var(--bg-secondary)';
  };

  // Generate edges
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < n; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < n) {
      edges.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[left].x, y2: nodes[left].y });
    }
    if (right < n) {
      edges.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[right].x, y2: nodes[right].y });
    }
  }

  return (
    <div className="tree-container">
      <svg className="tree-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ maxHeight: `${svgHeight}px` }}>
        {/* Edges */}
        {edges.map((edge, i) => (
          <line
            key={`edge-${i}`}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            className="tree-edge"
          />
        ))}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill={getNodeBg(i)}
              stroke={getNodeColor(i)}
              strokeWidth={2.5}
            />
            <text
              x={node.x}
              y={node.y}
              className="tree-node"
              fill={getNodeColor(i)}
              fontSize="12"
              fontFamily="var(--font-mono)"
              fontWeight="600"
            >
              {node.value}
            </text>
            {showIndices && (
              <text
                x={node.x}
                y={node.y + nodeRadius + 12}
                textAnchor="middle"
                fontSize="9"
                fill="var(--text-muted)"
                fontFamily="var(--font-mono)"
              >
                [{i}]
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
