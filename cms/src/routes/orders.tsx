import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getVendorOrders, updateVendorOrderStatus, type ServiceOrder } from '../lib/api';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
});

function OrdersPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getVendorOrders,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ServiceOrder['status'] }) => updateVendorOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Status pesanan berhasil diperbarui');
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading) return <div className="p-8">Memuat pesanan...</div>;

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Inbox Pesanan Vendor</h1>
      <div className="overflow-hidden bg-white border border-gray-100 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Layanan</th>
              <th className="px-4 py-3 text-left">Pelanggan</th>
              <th className="px-4 py-3 text-left">Jumlah</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((order) => (
              <tr key={order.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{order.orderType.toUpperCase()} - {order.serviceName}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{order.quantity}</td>
                <td className="px-4 py-3">Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}</td>
                <td className="px-4 py-3">
                  <select
                    className="p-2 border border-gray-300 rounded-lg"
                    value={order.status}
                    onChange={(e) => mutation.mutate({ id: order.id, status: e.target.value as ServiceOrder['status'] })}
                  >
                    <option value="pending">pending</option>
                    <option value="accepted">accepted</option>
                    <option value="rejected">rejected</option>
                    <option value="completed">completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.length && <div className="p-8 text-center text-gray-500">Belum ada pesanan masuk.</div>}
      </div>
    </div>
  );
}
