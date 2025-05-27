import { createSignal } from 'solid-js';
import MobileNav from './MobileNav';

export default function MobileHeader() {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen());
  };

  return (
    <>
      <div class="mobile-header">
        <div class="logo">GUINETIK</div>
        <div class="hamburger" onClick={toggleMenu}>
          <span style={{
            transform: isOpen() ? 'rotate(45deg) translate(5px, 5px)' : '',
          }}/>
          <span style={{
            opacity: isOpen() ? '0' : '',
          }}/>
          <span style={{
            transform: isOpen() ? 'rotate(-45deg) translate(5px, -5px)' : '',
          }}/>
        </div>
      </div>
      
      <MobileNav isOpen={isOpen()} onItemClick={() => setIsOpen(false)}/>
    </>
  );
}