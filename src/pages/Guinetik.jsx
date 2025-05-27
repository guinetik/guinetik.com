import { onMount, onCleanup } from 'solid-js';
import MatrixGrid from '../bgs/MatrixGrid';
import AnimatedAside from '../components/AnimatedAside';

export default function Guinetik() {
  let container;
  let matrix;

  onMount(() => {
    matrix = new MatrixGrid(container, {
      fadeSpeed: 0.03,
      symbols: "01アイウエオカキクケコGUINETIK", // Custom symbols
      updateInterval: 70 // Slower animation
    });
  });

  onCleanup(() => matrix?.destroy());

  return (
    <section class="page guinetik-screen">
      <div ref={container} id="bg"></div>
      <div class="content">
        <h1>WHAT IS GUINETIK</h1>
        <AnimatedAside />
        <p>🙋‍♂️ Hello, world</p>
        <p>🪪 My name is João <strong>G.</strong></p>
        <p>🧑‍💻 I go by <strong>Guinetik</strong> online.</p>
        <p>📫 Hit me up at: <a href="mailto:guinetik@gmail.com">guinetik@gmail.com</a> </p>
        <p>👨‍💻 Software Engineer</p>
        <p>🎓 Masters in Software Engineering at Cesar.School</p>
        <p>🌎 Fortaleza/Ceará - Brazil</p>
        <p>🏢 Working at Foursys</p>
        <p>🏬 I've worked at Cappen, Ogilvy, Accenture, VanHack, Crossover and Epitrack.</p>
        <p>💬 Java, NodeJS, Frontend, Data Science & DevOps</p>
        <p>🌱 Learning Data Science and Rust</p>
        <p>🕹️ Tech, Games, Infotainment and Geek Culture</p>
      </div>
    </section>
  );
}