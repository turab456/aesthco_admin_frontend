import { Route, Routes } from "react-router-dom";
import SignIn from "../application/Auth";
import NotFound from "../pages/OtherPage/NotFound";
import AppLayout from "../layout/AppLayout";
import ProductMangement from "../application/Products";
import PrivateRoute from "../components/auth/PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />

      <Route element={<PrivateRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route path="products" element={<ProductMangement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
