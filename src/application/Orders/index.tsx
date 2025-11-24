import React, { useCallback, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";
import OrdersList from "./components/OrdersList";
import OrderDetailsModal from "./components/OrderDetailsModal";
import OrderDetailApi from "./api/OrderDetailApi";
import { useModal } from "../../hooks/useModal";
import type { Order } from "./types";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const fetchOrders = useCallback(async () => {
    const data = await OrderDetailApi.list();
    setOrders(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchOrders();
        setError(null);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [fetchOrders]);

  const handleView = async (orderId: string) => {
    try {
      setDetailLoading(true);
      const detail = await OrderDetailApi.getById(orderId);
      setSelectedOrder(detail);
      openModal();
    } catch (err) {
      console.error("Failed to load order:", err);
      setError("Unable to load order details.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageMeta title="Orders" description="View all orders" />
      <PageBreadcrumb pageTitle="Orders" />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Loader label="Loading orders..." fullHeight />
        </div>
      ) : (
        <OrdersList data={orders} onView={handleView} />
      )}

      <OrderDetailsModal
        isOpen={isOpen}
        order={selectedOrder}
        onClose={closeModal}
        isLoading={detailLoading}
      />
    </div>
  );
};

export default OrdersPage;
