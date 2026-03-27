import { Switch, Route, Router as WouterRouter } from "wouter";
import Obfuscator from "@/pages/Obfuscator";
import Deobfuscator from "@/pages/Deobfuscator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Obfuscator} />
      <Route path="/deobfuscator" component={Deobfuscator} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
