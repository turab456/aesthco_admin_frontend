import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "../application/Auth";
import NotFound from "../pages/OtherPage/NotFound";
import AppLayout from "../layout/AppLayout";
import ProductMangement from "../application/Products";
import PrivateRoute from "../components/auth/PrivateRoute";
import Dashboard from "../application/Dashboard";
import CategoryManagement from "../application/category";
import CollectionManagement from "../application/Collections";
import ColorsManagement from "../application/Colors";
import SizeManagement from "../application/Sizes";
import CouponManagement from "../application/Coupon";
import ShippingSettings from "../application/Shipping";
import OrdersPage from "../application/Orders";
import ReviewsPage from "../application/Reviews";
import UserManagement from "../application/User";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
    

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductMangement />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="collection" element={<CollectionManagement />} />
          <Route path="colors" element={<ColorsManagement />} />
          <Route path="size" element={<SizeManagement />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders/coupons" element={<CouponManagement />} />
          <Route path="orders/shipping" element={<ShippingSettings />} />
          <Route path="reviews" element={<ReviewsPage />} />
          
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
