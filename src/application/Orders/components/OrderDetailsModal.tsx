import React from "react";
import { CustomModal } from "../../../components/custom";
import Loader from "../../../components/common/Loader";
import type { Order } from "../types";

type Props = {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  isLoading?: boolean;
};

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PLACED: "bg-gray-100 text-gray-800",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PACKED: "bg-indigo-100 text-indigo-700",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    RETURN_REQUESTED: "bg-yellow-100 text-yellow-700",
    RETURNED: "bg-amber-100 text-amber-700",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

const OrderDetailsModal: React.FC<Props> = ({
  isOpen,
  order,
  onClose,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="bg-gray-50"
    >
      {isLoading || !order ? (
        <div className="p-6">
          <Loader label="Loading order..." fullHeight />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Order ID
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm">
                {order.id}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                  order.status
                )}`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  order.assignedPartnerId ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {order.assignedPartner?.fullName || order.assignedPartner?.email
                  ? `Accepted by ${order.assignedPartner?.fullName || order.assignedPartner?.email}`
                  : order.assignedPartnerId ? "Accepted by Partner" : "Unassigned"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Customer
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {order.addressName}
              </p>
              <p className="text-xs text-gray-600">
                {order.addressPhone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Address
              </p>
              <p className="text-sm text-gray-800">
                {order.addressLine1}
                {order.addressLine2 ? `, ${order.addressLine2}` : ""}
              </p>
              <p className="text-sm text-gray-800">
                {order.city}, {order.state} {order.postalCode || ""}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Payment
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {order.paymentMethod} • {order.paymentStatus}
              </p>
              <p className="text-xs text-gray-500">
                Coupon: {order.couponCode || "—"}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Totals
                </p>
                <p className="text-xs text-gray-500">
                  Subtotal {formatter.format(order.subtotal)} • Shipping{" "}
                  {formatter.format(order.shippingFee)} • Discount{" "}
                  {formatter.format(order.discountAmount || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Total
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatter.format(order.total)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900">Items</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        {item.productName}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatter.format(item.totalPrice)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      {item.colorName && <span>Color: {item.colorName}</span>}
                      {item.sizeName && <span>Size: {item.sizeName}</span>}
                      <span>Qty: {item.quantity}</span>
                      {item.sku && <span>SKU: {item.sku}</span>}
                    </div>
                    <p className="text-xs text-gray-500">
                      Unit: {formatter.format(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default OrderDetailsModal;
