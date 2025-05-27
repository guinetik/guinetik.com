// src/components/NavItem.jsx
import { A } from "@solidjs/router";

export default function NavButton({ item, mobile = false, onClick }) {
  return (
    <A
      href={item.path}
      class={`nav-button ${mobile ? "mobile-nav-button" : ""}`}
      activeClass="active"
      onClick={onClick}
    >
      {item.label}
    </A>
  );
}
