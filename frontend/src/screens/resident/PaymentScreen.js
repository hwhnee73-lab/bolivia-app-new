import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import PhoneMockup from '../../components/common/PhoneMockup';
import Modal  from '../../components/common/Modal';
import HomeButton from '../../components/common/HomeButton';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const PaymentScreen = () => {
  const { showToast, fetchWithAuth } = useAppContext();
  const { t } = useTranslation();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true); setError('');
        const res = await fetchWithAuth('/resident/payments/bills');
        if (!res.ok) {
          const data = await res.json().catch(()=>({}));
          throw new Error(data.message || t('payment.errors.loadBillsFailed'));
        }
        const data = await res.json();
        setBills(data);
      } catch (e) {
        setError(e.message);
      } finally { setLoading(false); }
    };
    load();
  }, [fetchWithAuth]);

  const openDetail = (bill) => { setCurrentBill(bill); setDetailOpen(true); };

  const payMock = () => {
    if (!currentBill) return;
    // Mock: 변경만 UI에 반영
    setBills(prev => prev.map(b => b.id === currentBill.id ? { ...b, status: 'Pagado' } : b));
    setCurrentBill({ ...currentBill, status: 'Pagado' });
    setDetailOpen(false);
    showToast(t('payment.success.mockPaid'));
  };

  const downloadReceipt = (bill) => {
    const b = bill || currentBill;
    if (!b) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      body{font-family:Arial;padding:20px}h2{margin:0 0 10px}table{width:100%;border-collapse:collapse;margin-top:10px}
      th,td{border:1px solid #ddd;padding:6px;text-align:right}th{text-align:left;background:#f3f4f6}
    </style></head><body>
      <h2>영수증 (샘플)</h2>
      <p>청구월: ${b.bill_month}</p>
      <p>상태: ${b.status}</p>
      <table><thead><tr><th>항목</th><th>금액</th></tr></thead><tbody>
        ${(b.items||[]).map(it=>`<tr><td style="text-align:left">${it.item_name}</td><td>${Number(it.amount||0).toLocaleString()}</td></tr>`).join('')}
        <tr><td style="text-align:left"><strong>합계</strong></td><td><strong>${Number(b.total_amount||0).toLocaleString()}</strong></td></tr>
      </tbody></table>
      <script>window.onload=function(){window.print();window.close();}</script>
    </body></html>`;
    const w = window.open('', 'receipt');
    if (!w) return;
    w.document.open(); w.document.write(html); w.document.close();
  };

  if (loading) return <PhoneMockup theme="light"><Loader message={t('payment.loadingBills')} /></PhoneMockup>;
  if (error) return <PhoneMockup theme="light"><div className="p-6"><ErrorAlert message={t('common.errorWithMessage', { message: error })} /></div></PhoneMockup>;

  // Group by month
  const months = Array.from(new Set(bills.map(b=>b.bill_month))).sort().reverse();

  return (
    <>
      <PhoneMockup theme="light">
        <div className="relative h-full flex flex-col">
          <HomeButton />
          <h3 className="text-xl font-bold text-center mb-4">{t('payment.title')}</h3>
          <div className="space-y-4 overflow-y-auto flex-grow">
            {months.map(m => (
              <div key={m} className="bg-white rounded-lg shadow p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold">{m}</div>
                </div>
                {(bills.filter(b=>b.bill_month===m)).map(bill => (
                  <div key={bill.id} className="flex justify-between items-center border-t py-2">
                    <div>
                      <div className="text-sm text-gray-600">{t('payment.due')}: {bill.due_date}</div>
                      <div className={`text-xs font-semibold ${bill.status==='Pendiente'?'text-red-600':'text-green-600'}`}>{bill.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{Number(bill.total_amount||0).toLocaleString()} $</div>
                      <div className="mt-1 flex gap-2 justify-end">
                        <button onClick={()=>openDetail(bill)} className="px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300">{t('payment.actions.detail')}</button>
                        {bill.status!=='Pendiente' && (
                          <button onClick={()=>downloadReceipt(bill)} className="px-2 py-1 text-xs rounded bg-sky-600 text-white hover:bg-sky-700">{t('payment.actions.receipt')}</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </PhoneMockup>

      <Modal isOpen={detailOpen} onClose={()=>setDetailOpen(false)} title={t('payment.detailTitle')}>
        {currentBill && (
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <div>{t('payment.table.month')}: {currentBill.bill_month}</div>
              <div>{t('payment.table.status')}: <span className={currentBill.status==='Pendiente'?'text-red-600':'text-green-600'}>{currentBill.status}</span></div>
            </div>
            <div className="border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100"><tr><th className="p-2 text-left">{t('payment.table.item')}</th><th className="p-2 text-right">{t('payment.table.amount')}</th></tr></thead>
                <tbody>
                  {(currentBill.items||[]).map((it,idx)=> (
                    <tr key={idx} className="border-t"><td className="p-2">{it.item_name}</td><td className="p-2 text-right">{Number(it.amount||0).toLocaleString()}</td></tr>
                  ))}
                  <tr className="border-t font-semibold"><td className="p-2">{t('payment.table.total')}</td><td className="p-2 text-right">{Number(currentBill.total_amount||0).toLocaleString()}</td></tr>
                </tbody>
              </table>
            </div>
            {currentBill.status==='Pendiente' ? (
              <button onClick={payMock} className="w-full mt-3 p-2 rounded bg-teal-600 text-white hover:bg-teal-700 font-bold">{t('payment.actions.mockPay')}</button>
            ) : (
              <button onClick={()=>downloadReceipt()} className="w-full mt-3 p-2 rounded bg-sky-600 text-white hover:bg-sky-700 font-bold">{t('payment.actions.receiptPdf')}</button>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default PaymentScreen;
