import { onMount, onCleanup } from "solid-js";
import NumberGrid from "../bgs/NumberGrid";
import { useBeforeLeave } from "@solidjs/router";
import { Transition } from "../context/transitions";

export default function Home() {
  let gridContainer;
  let numberGrid;
  onMount(() => {
    numberGrid = new NumberGrid(gridContainer);
  });

  onCleanup(() => {
    numberGrid?.destroy();
  });

  return (
    <section class="page home-screen">
      <div ref={gridContainer} id="number-grid"></div>
      Hello, friend.
      <br />
      <span class="blink">_</span>
    </section>
  );
}
