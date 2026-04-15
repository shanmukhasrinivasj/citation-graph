import { useState } from "react";

const REFS = [
  { id: "1", x: 100, y: 130 },
  { id: "2", x: 100, y: 220 },
  { id: "3", x: 100, y: 310 },
  { id: "4", x: 100, y: 400 },
  { id: "5", x: 100, y: 490 },
  { id: "6", x: 100, y: 580 },
  { id: "7", x: 100, y: 670 },
  { id: "8", x: 100, y: 760 },
];

const CITES = [
  { id: "A", x: 900, y: 130 },
  { id: "B", x: 900, y: 220 },
  { id: "C", x: 900, y: 310 },
  { id: "D", x: 900, y: 400 },
  { id: "E", x: 900, y: 490 },
  { id: "F", x: 900, y: 580 },
  { id: "G", x: 900, y: 670 },
  { id: "H", x: 900, y: 760 },
];

const POI = { x: 500, y: 440, r: 42 };
const R = 26;

function getEdgePoint(fromX, fromY, toX, toY, radius) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return {
    x: fromX + (dx / dist) * radius,
    y: fromY + (dy / dist) * radius,
  };
}

function Arrow({ x1, y1, x2, y2, color, dashed, r1 = R, r2 = R }) {
  const start = getEdgePoint(x1, y1, x2, y2, r1);
  const end = getEdgePoint(x2, y2, x1, y1, r2);
  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke={color}
      strokeWidth={2}
      strokeDasharray={dashed ? "8,4" : "none"}
      markerEnd={`url(#ah-${color.replace("#", "")})`}
    />
  );
}

function Node({ x, y, label, fill, stroke, r = R }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={2.5} />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial, sans-serif"
        fontSize={r > 30 ? 18 : 15}
        fontWeight="bold"
        fill="#222"
      >
        {label}
      </text>
    </g>
  );
}

const CROSS = [
  { from: "2", to: "7", type: "ref-ref" },
  { from: "A", to: "2", type: "cite-ref" },
  { from: "A", to: "7", type: "cite-ref" },
  { from: "B", to: "2", type: "cite-ref" },
  { from: "B", to: "7", type: "cite-ref" },
  { from: "C", to: "3", type: "cite-ref" },
  { from: "D", to: "1", type: "cite-ref" },
  { from: "D", to: "2", type: "cite-ref" },
  { from: "E", to: "7", type: "cite-ref" },
  { from: "F", to: "2", type: "cite-ref" },
  { from: "G", to: "2", type: "cite-ref" },
  { from: "G", to: "4", type: "cite-ref" },
  { from: "H", to: "3", type: "cite-ref" },
];

function getNode(id) {
  const ref = REFS.find((r) => r.id === id);
  if (ref) return ref;
  const cite = CITES.find((c) => c.id === id);
  if (cite) return cite;
  return null;
}

export default function CitationGraph() {
  const [showCross, setShowCross] = useState(true);

  return (
    <div style={{ background: "#fff", padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", margin: "0 0 4px 0", fontSize: "20px", color: "#222" }}>
        Citation Graph
      </h2>
      <p style={{ textAlign: "center", margin: "0 0 12px 0", fontSize: "13px", color: "#666" }}>
        POI: Pang et al. (2021) — Deep Learning for Anomaly Detection: A Review
      </p>

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <button
          onClick={() => setShowCross(!showCross)}
          style={{
            padding: "6px 16px",
            borderRadius: "6px",
            border: "2px solid #2E8B2E",
            background: showCross ? "#2E8B2E" : "#fff",
            color: showCross ? "#fff" : "#2E8B2E",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          {showCross ? "Hide" : "Show"} Cross-Citations ({CROSS.length})
        </button>
      </div>

      <svg viewBox="0 0 1000 850" width="100%" style={{ maxHeight: "75vh" }}>
        <defs>
          <marker id="ah-4A86C8" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4A86C8" />
          </marker>
          <marker id="ah-C85450" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#C85450" />
          </marker>
          <marker id="ah-2E8B2E" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#2E8B2E" />
          </marker>
        </defs>

        {/* Legend */}
        <rect x="340" y="95" width="320" height="75" rx="8" fill="#f7f7f7" stroke="#ddd" />
        <line x1="355" y1="115" x2="390" y2="115" stroke="#4A86C8" strokeWidth={2} />
        <text x="398" y="119" fontSize="12" fill="#4A86C8" fontFamily="Arial">
          Blue arrows = POI cites References (1–8)
        </text>
        <line x1="355" y1="135" x2="390" y2="135" stroke="#C85450" strokeWidth={2} />
        <text x="398" y="139" fontSize="12" fill="#C85450" fontFamily="Arial">
          Red arrows = Citations (A–H) cite POI
        </text>
        <line x1="355" y1="155" x2="390" y2="155" stroke="#2E8B2E" strokeWidth={2} strokeDasharray="6,3" />
        <text x="398" y="159" fontSize="12" fill="#2E8B2E" fontFamily="Arial">
          Green dashed = Cross-citations (13 total)
        </text>

        {/* Labels */}
        <text x="100" y="105" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4A86C8" fontFamily="Arial">
          References
        </text>
        <text x="900" y="105" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#C85450" fontFamily="Arial">
          Citations
        </text>

        {/* POI → References (blue) */}
        {REFS.map((ref) => (
          <Arrow
            key={`poi-${ref.id}`}
            x1={POI.x}
            y1={POI.y}
            x2={ref.x}
            y2={ref.y}
            color="#4A86C8"
            r1={POI.r}
            r2={R}
          />
        ))}

        {/* Citations → POI (red) */}
        {CITES.map((cite) => (
          <Arrow
            key={`${cite.id}-poi`}
            x1={cite.x}
            y1={cite.y}
            x2={POI.x}
            y2={POI.y}
            color="#C85450"
            r1={R}
            r2={POI.r}
          />
        ))}

        {/* Cross-citations (green dashed) */}
        {showCross &&
          CROSS.map((c, i) => {
            const from = getNode(c.from);
            const to = getNode(c.to);
            if (!from || !to) return null;
            return (
              <Arrow
                key={`cross-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                color="#2E8B2E"
                dashed
              />
            );
          })}

        {/* Reference nodes */}
        {REFS.map((ref) => (
          <Node key={ref.id} x={ref.x} y={ref.y} label={ref.id} fill="#DAE8FC" stroke="#4A86C8" />
        ))}

        {/* Citation nodes */}
        {CITES.map((cite) => (
          <Node key={cite.id} x={cite.x} y={cite.y} label={cite.id} fill="#F8CECC" stroke="#C85450" />
        ))}

        {/* POI node (on top) */}
        <Node x={POI.x} y={POI.y} label="POI" fill="#FFD700" stroke="#B8860B" r={POI.r} />
      </svg>
    </div>
  );
}
