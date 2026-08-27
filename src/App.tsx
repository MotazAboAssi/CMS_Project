import { BrowserRouter } from "react-router";
import AppRouter from "./router/AppRouter";

function App() {
  // useEffect(() => {
  //   testIntelligenceAlgorithm();
  // }, []);
  return (
    <BrowserRouter basename="/CMS_Project">
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
