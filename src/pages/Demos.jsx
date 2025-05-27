// src/pages/Demos.jsx
import { onMount, onCleanup } from "solid-js";
import GraphNetwork from "../bgs/GraphNetwork";
import EvolvingGraph from "../bgs/EvolvingGraph";
import { TerminalOverlay } from "../components/TerminalOverlay";
import DemoItem from "../components/DemoItem";

export default function Demos() {
  let container;
  let graph;
  
  function restart() {
    if(graph) new TerminalOverlay();
    graph?.destroy();
    graph = new EvolvingGraph(container, {
      initialNodes: Math.round(Math.random() * 100) + 50,
      maxNodes: Math.round(Math.random() * 200) + 100,
      spawnRate: Math.random() * 0.1,
      clusterCount: Math.round(Math.random() * 10) + 5,
      driftSpeed: Math.random() * 0.9,
      migrationRate: Math.random() * 0.001,
    });
  }

  onMount(() => {
    restart();
  });

  onCleanup(() => graph?.destroy());

  return (
    <section class="page demos-screen">
      <div ref={container} id="bg" onClick={restart}></div>
      <div class="content">
        <h1>DEMOS</h1>
        <DemoItem/>
        <DemoItem/>
      </div>
    </section>
  );
}