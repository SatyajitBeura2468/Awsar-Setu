"use client";

import { useEffect, useState } from "react";

export function ExperienceLayer() {
  const [position, setPosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <>
      <div className="ambient-field" aria-hidden="true">
        <span className="ambient-orb ambient-orb-one" />
        <span className="ambient-orb ambient-orb-two" />
        <span className="ambient-orb ambient-orb-three" />
      </div>
      <div
        className="cursor-spotlight"
        style={{
          transform: `translate3d(${position.x - 260}px, ${position.y - 260}px, 0)`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
