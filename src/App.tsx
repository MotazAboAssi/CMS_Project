import { BrowserRouter } from "react-router";
import AppRouter from "./router/AppRouter";
import { useEffect } from "react";
import { testIntelligenceAlgorithm } from "./test/IntelligenceAlgorithm";

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
