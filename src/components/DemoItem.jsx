export default function DemoItem(props) {
  return (
    <div class="demo-folder">
        <fieldset class="folder">
          <legend class="folder-tab">DEMO FOLDER</legend>
          <div class="folder-content">
            <img 
              src="/path-to-your-image.jpg" 
              alt="Demo Preview" 
              class="demo-image"
            />
            <div class="demo-description">
              Macrodata Refinement Protocol v2.1.4
            </div>
          </div>
        </fieldset>
      </div>
  );
}
