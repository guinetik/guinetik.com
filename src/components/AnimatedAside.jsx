// components/AnimatedAside.jsx
import { createSignal, onMount } from "solid-js";

export default function AnimatedAside() {
  let asideRef;
  const [currentPhrase, setCurrentPhrase] = createSignal(
    "Ideas coded with motion"
  );
  const phrases = [
    "Ideas coded in motion",
    "Kinetic engineering",
    "Creative ↔ Functional ↔ Art",
  ];
  onMount(() => {
    let phraseIndex = 0;
    document.querySelector(".animated-aside")?.classList.add("active");
    const cyclePhrases = () => {
      // Start fade out
      document.querySelector(".animated-aside")?.classList.remove("active");
      // Wait for fade out to complete before changing text
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setCurrentPhrase(phrases[phraseIndex]);
        // Fade in new phrase
        document.querySelector(".animated-aside")?.classList.add("active");
      }, 600); // Matches transition duration
    };
    const interval = setInterval(cyclePhrases, 3000); // Change every 3s
    return () => clearInterval(interval);
  });

  return (
    <aside ref={asideRef} class="animated-aside">
      {currentPhrase()}
    </aside>
  );
}
