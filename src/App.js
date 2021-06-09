import "./App.css";
import Compiler from "./Components/Compiler";
import { BrowserRouter,Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Compiler/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
