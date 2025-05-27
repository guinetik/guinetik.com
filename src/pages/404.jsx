import { onMount, onCleanup } from 'solid-js';
import GameOfLife from '../bgs/GameOfLife';

export default function Page404() {
  let container;
  let game;

  onMount(() => {
    game = new GameOfLife(container, {
      cellSize: 2,
      liveColor: '#FFFFFF',
      deadColor: '#121212',
      fps: 60,
      randomFill: 0.15
    });
    game.toggleRunning();
  });

  onCleanup(() => {
    game.toggleRunning();
    game?.destroy();
  });

  return (
    <div class="page home-screen">
      <div ref={container} id="bg"></div>
      This page doesn't exist.<br />
      <span class="blink">_</span>
    </div>
  );
}