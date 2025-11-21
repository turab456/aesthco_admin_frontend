import { BrowserRouter as Router, Routes, Route } from "react-router";

import SignIn from "./application/Auth";


import NotFound from "./pages/OtherPage/NotFound";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProductMangement from "./application/Products";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          
          {/* Default: Sign in */}
          <Route index path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          

          {/* Dashboard Layout (protected UI can be gated later) */}
          <Route path="/app" element={<AppLayout />}>
            <Route path="products" element={<ProductMangement />} />
          

           
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
