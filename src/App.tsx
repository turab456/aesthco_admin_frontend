import { BrowserRouter } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}
