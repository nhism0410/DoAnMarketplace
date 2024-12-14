import React from "react";
import { EthProvider } from "./contexts/EthContext";
// import Demo from "./components/Demo";
import Main from "./components/Main/Main";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <EthProvider>
      <div className="App">
        <Main />
      </div>
    </EthProvider>
  );
};

export default App;
