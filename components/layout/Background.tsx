"use client";

import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

export default function Background() {
  const init = async (engine: Engine): Promise<void> => {
    await loadSlim(engine);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        number: { value: 80, density: { enable: true, area: 800 } },
        paint: { fill: { color: { value: ["#00e5ff", "#33a2bf", "#6a9dab"] } } },
        links: { enable: true, distance: 150, color: "#00e5ff", opacity: 0.6, width: 1.5 },
        move: { enable: true, speed: 1.2, direction: "none", random: false, straight: false },
        size: { value: { min: 2, max: 4.5 } },
        opacity: { value: { min: 0.5, max: 1 } },
      },
      interactivity: {
        events: { onHover: { enable: true, mode: "grab" } },
        modes: { grab: { distance: 150, links: { opacity: 0.8 } } },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    // fixed ve -z-10: En arkada durur ve tüm ekranı kaplar
    <div className="fixed inset-0 -z-10 pointer-events-none bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#102446] to-[#0a1128] opacity-0 dark:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-itf-blue/5 via-background to-hub-2/10 dark:opacity-0 transition-opacity duration-500"></div>
      <ParticlesProvider init={init}>
        <Particles id="tsparticles" options={options} className="absolute inset-0" />
      </ParticlesProvider>
    </div>
  );
}