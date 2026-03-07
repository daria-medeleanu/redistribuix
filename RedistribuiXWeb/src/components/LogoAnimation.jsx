import { motion } from "framer-motion";
import { useState } from "react";

const radius = 120;
const center = 150;

const points = {
  right: 0,
  top: 90,
  left: 180,
  bottom: 270
};

function getPosition(angle) {
  const rad = (angle * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(rad),
    y: center - radius * Math.sin(rad)
  };
}

function getNeighbours(key) {
  if (key === "right") return ["top", "bottom"];
  if (key === "top") return ["left", "right"];
  if (key === "left") return ["top", "bottom"];
  if (key === "bottom") return ["left", "right"];
}

export default function RadialAnimation() {
  const [hovered, setHovered] = useState(null);

  const spawn = hovered ? getPosition(points[hovered]) : null;

  const targets = hovered
    ? getNeighbours(hovered).map((k) => ({
        key: k,
        ...getPosition(points[k])
      }))
    : [];

  return (
    <svg width="300" height="300">

      {/* circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#00AEEF"
        fill="none"
      />

      {/* fixed points */}
      {Object.entries(points).map(([key, angle]) => {
        const pos = getPosition(angle);

        return (
          <circle
            key={key}
            cx={pos.x}
            cy={pos.y}
            r="8"
            fill="#00AEEF"
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          />
        );
      })}

      {/* animated travelling points */}
      {hovered &&
        targets.map((target, i) => (
          <motion.circle
            key={i}
            r="6"
            fill="#00AEEF"
            initial={{
              cx: spawn.x,
              cy: spawn.y
            }}
            animate={{
              cx: target.x,
              cy: target.y
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
          />
        ))}
    </svg>
  );
}