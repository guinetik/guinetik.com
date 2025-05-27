import Site from "../context/site";
import NavButton from "./NavButton";

export default function MobileNav(props) {
  return (
    <div class={`mobile-nav ${props.isOpen ? 'open' : ''}`}>
      {Site.getMenuItems().map((item) => (
        <NavButton 
          item={item} 
          mobile 
          onClick={props.onItemClick} 
        />
      ))}
    </div>
  );
}