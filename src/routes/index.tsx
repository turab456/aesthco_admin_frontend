import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "../application/Auth";
import NotFound from "../pages/OtherPage/NotFound";
import AppLayout from "../layout/AppLayout";
import ProductMangement from "../application/Products";
import PrivateRoute from "../components/auth/PrivateRoute";
import Dashboard from "../application/Dashboard";
import CollectionsManagement from "../application/Collections";
import CategoryManagement from "../application/category";
import VariantsManagement from "../application/Variants";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
    

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductMangement />} />
          <Route path="collections" element={<CollectionsManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="variants" element={<VariantsManagement />} />
        </Route>
        <Route
          path="/cloth-management/*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
