import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        newestOnTop
        draggable
        transition={Slide}
      />
    </BrowserRouter>
  );
}
