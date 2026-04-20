import { createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getVendorOrders, updateVendorOrderStatus, checkoutOrder, type ServiceOrder } from '../lib/api';
import toast from 'react-hot-toast';
import { useState, useMemo } from 'react';

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
});

function InvoiceModal({ order, onClose }: { order: ServiceOrder; onClose: () => void }) {
  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm duration-200 bg-slate-900/60 animate-in fade-in">
      {/* Printable Invoice (Hidden on screen) */}
      <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:p-12 print:z-[100] print:text-slate-900 print:font-sans">
        <div className="flex justify-between items-start pb-8 mb-12 border-b-4 border-slate-900">
          <div className="flex gap-4 items-center">
            <div className="p-4 text-2xl font-black text-white rounded-2xl bg-slate-900">🛒</div>
            <div>
              <h1 className="mb-1 text-4xl font-black tracking-tighter leading-none uppercase">INVOICE</h1>
              <p className="text-sm font-bold tracking-widest uppercase text-slate-500">{order.invoiceNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="mb-1 text-xl font-black uppercase">Internal Lifestyle Ecosystem</h2>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500">Official Digital Transaction</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-20 mb-16">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Billed To:</p>
              <p className="text-2xl font-black leading-tight text-slate-900">{order.customerName}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">{order.customerPhone || 'No contact provided'}</p>
            </div>
            <div className="pt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Payment Status:</p>
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                PAID / SUCCESS
              </div>
            </div>
          </div>
          <div className="space-y-4 text-right">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Transaction Info:</p>
              <p className="text-sm font-black uppercase text-slate-900">Service: {order.serviceName}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
              <p className="text-sm font-bold text-slate-600">Time: {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Order ID:</p>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">#{order.id.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b-2 border-slate-900">
                <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest">Item Description</th>
                <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-center w-32">Qty</th>
                <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-right w-48">Unit Price</th>
                <th className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-right w-48">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-2 py-8">
                  <p className="text-lg font-black text-slate-900">{order.serviceName}</p>
                  <p className="mt-2 text-xs italic font-medium leading-relaxed text-slate-500">
                    Category: {order.orderType.toUpperCase()} • Notes: {order.notes || 'Reguler Lifestyle Service Transaction'}
                  </p>
                </td>
                <td className="px-2 py-8 font-bold text-center text-slate-700">1</td>
                <td className="px-2 py-8 font-bold text-right text-slate-700">Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}</td>
                <td className="px-2 py-8 font-black text-right text-slate-900">Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}></td>
                <td className="px-2 py-8 text-xs font-black tracking-widest text-right uppercase border-t-2 border-slate-900">Subtotal</td>
                <td className="px-2 py-8 font-black text-right border-t-2 text-slate-900 border-slate-900">Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="px-2 py-4 text-xs font-black tracking-widest text-right uppercase">Tax (0%)</td>
                <td className="px-2 py-4 font-black text-right text-slate-900">Rp 0</td>
              </tr>
              <tr className="bg-slate-50">
                <td colSpan={2}></td>
                <td className="py-6 px-4 text-right font-black uppercase tracking-[0.2em] text-sm bg-slate-900 text-white rounded-l-2xl">Grand Total</td>
                <td className="px-4 py-6 text-3xl font-black text-right text-white rounded-r-2xl bg-slate-900">Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-20 pt-16 mt-auto border-t border-dashed border-slate-200">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Payment Method:</p>
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 inline-flex min-w-[240px]">
              <div className="flex justify-center items-center w-10 h-10 font-black text-white bg-indigo-600 rounded-xl">VA</div>
              <div>
                <p className="text-sm font-black leading-none text-indigo-900 uppercase">{order.paymentMethod || 'Virtual Account'}</p>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Provider: Internal Bank</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Thank you for your business!</p>
            <p className="text-[10px] font-bold text-slate-300 italic">This is an electronically generated document. No physical signature is required under current digital transaction laws.</p>
            <p className="text-[10px] font-black text-slate-900 mt-4 uppercase tracking-[0.5em]">LIFESTYLE ECOSYSTEM v1.0</p>
          </div>
        </div>
      </div>

      {/* Screen Modal */}
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 print:hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className="p-1.5 bg-rose-600 text-white rounded-lg text-xs">🛒</span>
                <h2 className="text-xl font-black tracking-tighter uppercase text-slate-900">Invoice Detail</h2>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.invoiceNumber || 'Draft Order'}</p>
            </div>
            <button onClick={onClose} className="p-2 transition-colors text-slate-300 hover:text-slate-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="p-6 mb-8 rounded-3xl border bg-slate-50 border-slate-100">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-dashed border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</span>
              <span className="text-sm font-black text-slate-900">{order.serviceName}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
              <span className="text-sm font-bold text-slate-700">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</span>
              <span className="text-sm font-bold text-slate-700">{order.customerPhone || '-'}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
              <span className="text-sm font-bold text-slate-700">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                order.status === 'accepted' ? 'bg-blue-100 text-blue-600' :
                order.status === 'preparing' ? 'bg-amber-100 text-amber-600' :
                order.status === 'ready' || order.status === 'ready_to_pick' ? 'bg-indigo-100 text-indigo-600' :
                order.status === 'delivering' ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-600'
              }`}>{order.status.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center px-2 mb-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
              <p className="text-3xl font-black text-slate-900">Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
              <p className="text-sm font-black text-indigo-600 uppercase">{order.paymentMethod || 'VA'}</p>
            </div>
          </div>

          <button 
            onClick={() => {
              window.print();
            }}
            className="py-4 w-full text-sm font-black text-white rounded-3xl shadow-xl transition-all bg-slate-900 shadow-slate-200 hover:bg-slate-800 active:scale-95"
          >
            PRINT INVOICE
          </button>
        </div>
        <div className="py-4 text-center border-t bg-slate-50 border-slate-100">
          <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Internal Lifestyle Ecosystem</p>
        </div>
      </div>
    </div>
  );
}

function OrdersPage() {
  const queryClient = useQueryClient();
  const [isPosMode, setIsPosMode] = useState(false);
  const [selectedPayment] = useState('va');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<ServiceOrder | null>(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser?.role === 'admin';

  const { data: rawData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getVendorOrders,
  });

  // Filter: Hanya tampilkan order yang sudah dibayar (accepted) atau selesai (completed)
  // Admin bisa melihat semuanya (termasuk pending untuk monitoring)
  const data = useMemo(() => {
    if (isAdmin) return rawData || [];
    return (rawData || []).filter(o => o.status !== 'pending');
  }, [rawData, isAdmin]);

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ServiceOrder['status'] }) => updateVendorOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Status pesanan diperbarui');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const checkoutMutation = useMutation({
    mutationFn: ({ id, paymentMethod }: { id: string; paymentMethod: string }) => checkoutOrder(id, paymentMethod),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(`Checkout Berhasil! Invoice: ${res.invoiceNumber}`, { duration: 5000 });
    },
    onError: (err: any) => toast.error('Gagal checkout: ' + err.message),
  });

  const stats = useMemo(() => {
    const paid = (data || []).filter(o => o.status === 'completed' || o.status === 'accepted');
    const totalSales = paid.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { count: paid.length, totalSales };
  }, [data]);

  if (isLoading) return <div className="p-8">Memuat sistem POS...</div>;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Header POS */}
      <div className="flex flex-col gap-4 justify-between mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="flex gap-3 items-center text-3xl font-black tracking-tighter text-slate-900">
            <span className="p-2 text-white bg-rose-600 rounded-2xl shadow-lg shadow-rose-200">🛒</span>
            {isAdmin ? 'Vendor Transactions History' : (isPosMode ? 'Internal POS System' : 'Order Management')}
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            {isAdmin ? 'Melihat semua transaksi vendor yang masuk ke sistem' : 'Sistem kasir internal untuk vendor lifestyle'}
          </p>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="hidden flex-col items-end mr-4 md:flex">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales Today</p>
            <p className="text-xl font-black text-emerald-600">Rp {stats.totalSales.toLocaleString('id-ID')}</p>
          </div>
          {!isAdmin && (
            <button
              onClick={() => setIsPosMode(!isPosMode)}
              className={`px-8 py-3 rounded-2xl text-sm font-black transition-all transform active:scale-95 ${
                isPosMode ? 'text-white shadow-xl bg-slate-900' : 'text-white bg-rose-600 shadow-lg shadow-rose-200'
              }`}
            >
              {isPosMode ? 'Back to List' : 'Open POS Dashboard'}
            </button>
          )}
          {isAdmin && (
            <div className="flex gap-2 items-center px-4 py-2 text-xs font-black text-amber-700 bg-amber-50 rounded-xl border border-amber-100">
              <span className="animate-pulse">🛡️</span> ADMIN VIEW ONLY
            </div>
          )}
        </div>
      </div>

      {isPosMode ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Antrean Pesanan */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">Incoming Orders</h3>
              <span className="px-3 py-1 text-xs font-black text-blue-600 bg-blue-100 rounded-full">
                {data?.filter(o => o.status === 'accepted').length} Paid
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {(data || [])
                .filter((o) => o.status !== 'completed' && o.status !== 'rejected')
                .map((order) => (
                  <div key={order.id} className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-rose-100 transition-all group animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        order.orderType === 'cafe' || order.orderType === 'restaurant' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {order.orderType}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">#{order.id.slice(-4)}</span>
                    </div>
                    
                    <h4 className="mb-1 text-lg font-black leading-tight text-slate-900">{order.serviceName}</h4>
                    <p className="mb-4 text-xs italic font-bold text-slate-400">"{order.notes || 'No notes'}"</p>
                    
                    <div className="flex gap-3 items-center mb-6">
                      <div className="flex justify-center items-center w-8 h-8 text-xs rounded-full bg-slate-100">👤</div>
                      <div>
                        <p className="text-xs font-black leading-none text-slate-700">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{order.customerPhone || 'No phone'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-100">
                      <div className="text-xl font-black text-slate-900">
                        Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}
                      </div>
                      <button
                        onClick={() => checkoutMutation.mutate({ id: order.id, paymentMethod: selectedPayment })}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-emerald-100 transition-all active:scale-90"
                      >
                        CHECKOUT
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {!data?.filter(o => o.status !== 'completed' && o.status !== 'rejected').length && (
              <div className="bg-slate-50 rounded-[3rem] p-20 text-center border-4 border-dashed border-slate-100">
                <span className="block mb-4 text-6xl opacity-50 grayscale">🍱</span>
                <p className="font-black text-slate-400">All orders processed!</p>
              </div>
            )}
          </div>

          {/* Panel Kontrol POS */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 sticky top-6">
              <h3 className="mb-6 text-xl font-black text-slate-900">Checkout Control</h3>
              
              <div className="mb-8 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Payment Method</label>
                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-3xl border-2 border-indigo-100">
                  <span className="text-sm font-black text-indigo-600">Virtual Account (VA)</span>
                  <span className="text-xl">🛡️</span>
                </div>
                <p className="text-[10px] text-slate-400 italic ml-2">*Hanya mendukung pembayaran VA untuk saat ini</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Transactions Today</span>
                  <span className="text-xs font-black text-slate-900">{stats.count}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-400">Net Revenue</span>
                  <span className="text-lg font-black text-emerald-600">Rp {stats.totalSales.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-300 font-bold text-center leading-relaxed">
                Internal POS System v1.0<br/>
                Integrated with Lifestyle Backend
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tampilan Tabel Manajemen */
        <div className="bg-white border-2 border-slate-50 rounded-[3rem] overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 font-black text-left text-slate-400 uppercase tracking-widest text-[10px]">Service / Invoice</th>
                <th className="px-8 py-6 font-black text-left text-slate-400 uppercase tracking-widest text-[10px]">Customer</th>
                <th className="px-8 py-6 font-black text-left text-slate-400 uppercase tracking-widest text-[10px]">Amount</th>
                <th className="px-8 py-6 font-black text-left text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-8 py-6 font-black text-left text-slate-400 uppercase tracking-widest text-[10px]">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(data || []).map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50/30 group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900">{order.serviceName}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                      <span className="uppercase">{order.orderType}</span>
                      {order.invoiceNumber && (
                        <button 
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md font-black hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          {order.invoiceNumber}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-700">{order.customerName}</div>
                    <div className="text-[10px] text-slate-400">{order.customerPhone || '-'}</div>
                  </td>
                  <td className="px-8 py-6 text-base font-black text-slate-900">
                    Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-8 py-6">
                    {isAdmin ? (
                      <span className={`p-2 px-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        order.status === 'accepted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        order.status === 'preparing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        order.status === 'ready' || order.status === 'ready_to_pick' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        order.status === 'delivering' ? 'bg-violet-50 text-violet-600 border-violet-100' :
                        order.status === 'pending' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    ) : (
                      <select
                        className={`p-2 px-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all outline-none ${
                          order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          order.status === 'accepted' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          order.status === 'preparing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-white border-slate-100'
                        }`}
                        value={order.status}
                        onChange={(e) => mutation.mutate({ id: order.id, status: e.target.value as ServiceOrder['status'] })}
                      >
                        {/* Status Dasar */}
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted (Paid)</option>
                        <option value="rejected">Rejected</option>

                        {/* Status Khusus Cafe/Restaurant */}
                        {(order.orderType === 'cafe' || order.orderType === 'restaurant') && (
                          <>
                            <optgroup label="Operational (Culinary)">
                              <option value="preparing">🍳 Preparing</option>
                              <option value="ready">✅ Food Ready</option>
                              {/* Tambahkan logika jika butuh bedakan Take Away/Delivery secara eksplisit di payload, 
                                  tapi untuk sekarang kita tampilkan semua status operasional kuliner */}
                              <option value="ready_to_pick">🛍️ Ready to Pick</option>
                              <option value="searching_driver">🔍 Searching Driver</option>
                              <option value="driver_found">🛵 Driver Found</option>
                              <option value="delivering">🚚 Delivering</option>
                            </optgroup>
                          </>
                        )}

                        <option value="completed">Completed (Finished)</option>
                      </select>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.paymentMethod || 'VA'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.length && (
            <div className="p-32 text-center">
              <p className="italic font-black text-slate-300">Belum ada transaksi terekam.</p>
            </div>
          )}
        </div>
      )}

      {selectedOrderForInvoice && (
        <InvoiceModal 
          order={selectedOrderForInvoice} 
          onClose={() => setSelectedOrderForInvoice(null)} 
        />
      )}
    </div>
  );
}


