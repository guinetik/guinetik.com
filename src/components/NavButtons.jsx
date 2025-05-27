import Site from "../context/site";
import NavButton from "./NavButton";
import { TerminalOverlay } from './TerminalOverlay';

export default function NavButtons() {
  const onClick = (item) => {
    
  };

  return (
    <nav class="nav-buttons">
      {Site.getMenuItems().map((item) => (
        <NavButton item={item} onClick={onClick} />
      ))}
      <a class="nav-button">Download CV</a>
    </nav>
  );
}
