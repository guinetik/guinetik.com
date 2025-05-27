import { onMount, onCleanup } from "solid-js";
import CymaticsSim from "../bgs/CymaticSim";
import DemoItem from "../components/DemoItem";

export default function Projects() {
  let container;

  onMount(() => {
    setTimeout(() => {
      new CymaticsSim(container, {
        particleCount: 300, // More particles
        baseSize: 1.2, // Size
        glowIntensity: 0.9, // 0-1 range
        waveFrequency: 0.005, // Higher = more ripples
        waveAmplitude: 50, // Higher = more movement
      });
    }, 1000);
  });

  return (
    <section class="page project-screen">
      <div ref={container} id="bg"></div>
      <div class="content">
        <h1>PROJECTS</h1>
        <div class="interactive-content">
      <DemoItem />
      <DemoItem />
    </div>
      </div>
    </section>
  );
}
