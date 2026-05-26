import { BrowserRouter } from "react-router";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter basename="/CMS_Project">
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
