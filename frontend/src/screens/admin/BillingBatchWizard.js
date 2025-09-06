import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useTranslation } from 'react-i18next';

const Step = ({ n, current, label }) => (
  <div className={`flex-1 text-center py-2 rounded ${current === n ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{n}. {label}</div>
);

const BillingBatchWizard = () => {
  const { fetchWithAuth, showToast } = useAppContext();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // { tokenKey, totalRows, validCount, invalidCount, rows[] }
  const [confirmResult, setConfirmResult] = useState(null); // { tokenKey, total, upserted, skippedInvalid }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (e) => {
    e.preventDefault();
    if (!file) { setError(t('billing.errors.selectFile')); return; }
    setLoading(true); setError(''); setPreview(null); setConfirmResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetchWithAuth('/admin/billing/batch/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || t('billing.errors.uploadFailed'));
      }
      const data = await res.json();
      setPreview(data);
      setStep(2);
    } catch (err) {
      setError(err.message || t('billing.errors.uploadError'));
    } finally { setLoading(false); }
  };

  const downloadSample = () => {
    const sample = [
      'building_number,unit_number,bill_month,total_amount,due_date,status',
      '101,1502,2025-09,123456,2025-09-30,Pendiente',
      '101,1503,2025-09,98765,2025-09-30,Pagado',
    ].join('\n');
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'billing-batch-sample.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const confirm = async () => {
    if (!preview?.tokenKey) { setError(t('billing.errors.missingToken')); return; }
    setLoading(true); setError(''); setConfirmResult(null);
    try {
      const res = await fetchWithAuth('/admin/billing/batch/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenKey: preview.tokenKey }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || t('billing.errors.confirmFailed'));
      }
      const data = await res.json();
      setConfirmResult(data);
      showToast(t('billing.success.confirmed'));
      setStep(3);
    } catch (err) {
      setError(err.message || t('billing.errors.confirmError'));
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-4 text-sky-700">{t('nav.billingBatch')}</h2>
      <div className="grid grid-cols-3 gap-2 mb-6">
        <Step n={1} current={step} label={t('billing.steps.upload')} />
        <Step n={2} current={step} label={t('billing.steps.preview')} />
        <Step n={3} current={step} label={t('billing.steps.confirm')} />
      </div>

      {loading && <Loader message={t('common.processing')} />}
      {error && <ErrorAlert message={error} />}

      {step === 1 && (
        <form onSubmit={upload} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{t('billing.fileLabel')}</label>
            <input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full" />
            <p className="text-xs text-gray-500 mt-1">{t('billing.columnsHelp')}</p>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading || !file} className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50">{t('billing.actions.upload')}</button>
            <button type="button" onClick={downloadSample} className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800">{t('billing.actions.downloadSample')}</button>
          </div>
        </form>
      )}

      {step >= 2 && preview && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-3 mb-3 text-sm">
            <span className="px-2 py-1 bg-gray-100 rounded">{t('billing.preview.totalRows', { count: preview.totalRows })}</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{t('billing.preview.valid', { count: preview.validCount })}</span>
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">{t('billing.preview.invalid', { count: preview.invalidCount })}</span>
            <span className="px-2 py-1 bg-gray-100 rounded">{t('billing.preview.token', { token: preview.tokenKey })}</span>
          </div>
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">{t('billing.table.row')}</th>
                  <th className="p-2">{t('billing.table.building')}</th>
                  <th className="p-2">{t('billing.table.unit')}</th>
                  <th className="p-2">{t('billing.table.billMonth')}</th>
                  <th className="p-2 text-right">{t('billing.table.amount')}</th>
                  <th className="p-2">{t('billing.table.dueDate')}</th>
                  <th className="p-2">{t('billing.table.status')}</th>
                  <th className="p-2">{t('billing.table.validation')}</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((r, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{r.rowNumber}</td>
                    <td className="p-2">{r.building_number}</td>
                    <td className="p-2">{r.unit_number}</td>
                    <td className="p-2">{r.bill_month}</td>
                    <td className="p-2 text-right">{Number(r.total_amount || 0).toLocaleString()}</td>
                    <td className="p-2">{r.due_date}</td>
                    <td className="p-2">{r.status}</td>
                    <td className="p-2">
                      {r.valid ? <span className="text-green-600">{t('common.ok')}</span> : <span className="text-red-600">{r.error || t('common.errorShort')}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {step === 2 && (
            <div className="mt-4 flex gap-2">
              <button onClick={() => setStep(1)} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">{t('common.prev')}</button>
              <button onClick={confirm} disabled={loading || preview.invalidCount > 0} className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50">{t('common.confirm')}</button>
              {preview.invalidCount > 0 && <span className="text-sm text-gray-500 self-center">{t('billing.preview.invalidNote')}</span>}
            </div>
          )}
        </div>
      )}

      {step === 3 && confirmResult && (
        <div className="mt-6">
          <div className="p-4 bg-green-50 text-green-800 rounded">
            <p className="font-semibold">{t('billing.result.title')}</p>
            <p className="mt-1 text-sm">{t('billing.result.summary', { total: confirmResult.total, upserted: confirmResult.upserted, skipped: confirmResult.skippedInvalid })}</p>
          </div>
          <div className="mt-4">
            <button onClick={() => { setStep(1); setFile(null); setPreview(null); setConfirmResult(null); }} className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700">{t('billing.actions.reset')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingBatchWizard;
