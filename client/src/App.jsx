import { EthProvider } from "./contexts/EthContext";
import  Demo  from "./components/Demo";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
    <EthProvider>
        <div className="container">
          <Demo/>
        </div>
    </EthProvider>
  );
}

export default App;
