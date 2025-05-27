import { Router, Route, useLocation, useBeforeLeave } from "@solidjs/router";
import Terminal from "./components/Terminal";
import Home from "./pages/Home";
import Guinetik from "./pages/Guinetik";
import Projects from "./pages/Projects";
import Page404 from "./pages/404";
import Demos from "./pages/Demos";
import MobileHeader from "./components/MobileHeader";
import { createEffect, onMount } from "solid-js";
import { Transition } from "./context/transitions";
import { Base, MetaProvider } from "@solidjs/meta";

function transitionAware(Component) {
  return (props) => {
    onMount(() => {
      Transition.in();
    });
    useBeforeLeave((e) => {
      Transition.out(e);
    });
    return <Component {...props} />;
  };
}

const Screen = (props) => {
  const location = useLocation();
  // React to path changes
  createEffect(() => {
    console.log("Path changed to:", location.pathname);
  });
  return (
    <>
      <MetaProvider>
        <Base target="_self" href="/guinetik.com/" />
      </MetaProvider>
      <MobileHeader />
      <Terminal>{props.children}</Terminal>
    </>
  );
};

function App() {
  return (
    <Router base="/guinetik.com" root={Screen}>
      <Route path="/" component={transitionAware(Home)} />
      <Route path="/home" component={transitionAware(Home)} />
      <Route path="/guinetik" component={transitionAware(Guinetik)} />
      <Route path="/projects" component={transitionAware(Projects)} />
      <Route path="/demos" component={transitionAware(Demos)} />
      <Route path="*paramName" component={transitionAware(Page404)} />
    </Router>
  );
}

export default App;
