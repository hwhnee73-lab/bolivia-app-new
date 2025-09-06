import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useAppContext } from '../../contexts/AppContext';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useTranslation } from 'react-i18next';

const parseYm = (ym) => {
  if (!ym) return 0;
  const [y, m] = ym.split('-').map((v) => parseInt(v, 10));
  return (y || 0) * 100 + (m || 0);
};

const toYm = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const FinanceScreen = () => {
  const { fetchWithAuth } = useAppContext();
  const { t } = useTranslation();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [delinquency, setDelinquency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const today = new Date();
  const defaultFrom = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const [fromYm, setFromYm] = useState(toYm(defaultFrom));
  const [toYmVal, setToYmVal] = useState(toYm(today));
  const [category, setCategory] = useState('ALL');

  // Charts
  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const lineChart = useRef(null);
  const pieChart = useRef(null);

  // Load all datasets on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [resIn, resEx] = await Promise.all([
          fetchWithAuth('/admin/reports/incomes'),
          fetchWithAuth('/admin/reports/expenses'),
        ]);
        const incomeData = resIn.ok ? await resIn.json() : [];
        const expenseData = resEx.ok ? await resEx.json() : [];
        setIncomes(incomeData);
        setExpenses(expenseData);

        // initial delinquency for default range
        const resDel = await fetchWithAuth(`/admin/reports/delinquency?from=${fromYm}&to=${toYmVal}`);
        const delData = resDel.ok ? await resDel.json() : [];
        setDelinquency(delData);
      } catch (e) {
        setError(t('finance.errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unique categories from expenses
  const categories = useMemo(() => {
    const set = new Set();
    expenses.forEach((x) => set.add(x.itemName || x.item_name || ''));
    return ['ALL', ...Array.from(set).filter(Boolean).sort()];
  }, [expenses]);

  // Apply filters (client-side for incomes/expenses; server-side for delinquency)
  const applyFilters = async () => {
    try {
      setLoading(true);
      setError('');
      const resDel = await fetchWithAuth(`/admin/reports/delinquency?from=${fromYm}&to=${toYmVal}`);
      const delData = resDel.ok ? await resDel.json() : [];
      setDelinquency(delData);
    } catch (e) {
      setError(t('finance.errors.applyFilterFailed'));
    } finally {
      setLoading(false);
    }
  };

  const withinRange = (ym) => {
    const n = parseYm(ym);
    return n >= parseYm(fromYm) && n <= parseYm(toYmVal);
  };

  const filteredIncomes = useMemo(() => incomes.filter((x) => withinRange(x.month)), [incomes, fromYm, toYmVal]);
  const filteredExpenses = useMemo(() => {
    return expenses.filter((x) => withinRange(x.month)).filter((x) => {
      const cat = x.itemName || x.item_name || '';
      return category === 'ALL' || cat === category;
    });
  }, [expenses, fromYm, toYmVal, category]);

  const sum = (arr, key) => arr.reduce((s, r) => s + Number(r[key] || 0), 0);
  const incomesSum = sum(filteredIncomes, 'total');
  const expensesSum = sum(filteredExpenses, 'total');
  const outstandingSum = delinquency.reduce((s, r) => s + Number(r.outstanding || 0), 0);

  // Build charts when data changes
  useEffect(() => {
    try {
      // Line chart: incomes vs expenses by month within range
      const monthsSet = new Set([
        ...filteredIncomes.map((x) => x.month),
        ...filteredExpenses.map((x) => x.month),
      ]);
      const months = Array.from(monthsSet).sort();
      const imap = filteredIncomes.reduce((m, x) => ((m[x.month] = Number(x.total || 0)), m), {});
      const exByMonth = filteredExpenses.reduce((m, x) => {
        const k = x.month; m[k] = (m[k] || 0) + Number(x.total || 0); return m;
      }, {});
      const incomeSeries = months.map((m) => imap[m] || 0);
      const expenseSeries = months.map((m) => exByMonth[m] || 0);
      if (lineChart.current) lineChart.current.destroy();
      if (lineRef.current) {
        lineChart.current = new Chart(lineRef.current, {
          type: 'line',
          data: { labels: months, datasets: [
            { label: t('finance.incomes'), data: incomeSeries, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.2)', tension: 0.3 },
            { label: t('finance.expenses'), data: expenseSeries, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.2)', tension: 0.3 }
          ] },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      }

      // Pie chart: expenses by item in the latest month within range
      const lastMonth = months[months.length - 1];
      const expLast = filteredExpenses.filter((x) => x.month === lastMonth);
      const labels = expLast.map((x) => x.itemName || x.item_name || 'Item');
      const values = expLast.map((x) => Number(x.total || 0));
      const colors = ['#0ea5e9','#22c55e','#ef4444','#a855f7','#f59e0b','#06b6d4','#84cc16'];
      if (pieChart.current) pieChart.current.destroy();
      if (pieRef.current) {
        pieChart.current = new Chart(pieRef.current, {
          type: 'pie',
          data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      }
    } catch (e) { /* ignore */ }
    return () => {
      if (lineChart.current) lineChart.current.destroy();
      if (pieChart.current) pieChart.current.destroy();
    };
  }, [filteredIncomes, filteredExpenses]);

  const downloadCsv = () => {
    const lines = [];
    lines.push('"Incomes"');
    lines.push('month,total');
    filteredIncomes.forEach(r => lines.push(`${r.month},${Number(r.total || 0)}`));
    lines.push('');
    lines.push('"Expenses"');
    lines.push('month,item,total');
    filteredExpenses.forEach(r => lines.push(`${r.month},"${(r.itemName || r.item_name || '').replace(/"/g,'""')}",${Number(r.total || 0)}`));
    lines.push('');
    lines.push('"Delinquency"');
    lines.push('month,billed,paid,outstanding,rate');
    delinquency.forEach(r => lines.push(`${r.month},${Number(r.billed || 0)},${Number(r.paid || 0)},${Number(r.outstanding || 0)},${Number(r.rate || 0)}`));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `finance-report_${fromYm}_${toYmVal}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadPdf = () => {
    // Simple print-to-PDF via new window
    const w = window.open('', 'printWin');
    if (!w) return;
    const style = '<style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px;text-align:right}th{text-align:left;background:#f3f4f6}</style>';
    const kpiHtml = `<h2>Finance Report (${fromYm} ~ ${toYmVal})</h2>
      <p>Total Incomes: ${incomesSum.toLocaleString()}</p>
      <p>Total Expenses: ${expensesSum.toLocaleString()}</p>
      <p>Outstanding: ${outstandingSum.toLocaleString()}</p>`;
    const incRows = filteredIncomes.map(r => `<tr><td>${r.month}</td><td>${Number(r.total||0).toLocaleString()}</td></tr>`).join('');
    const exRows = filteredExpenses.map(r => `<tr><td>${r.month}</td><td style="text-align:left">${r.itemName||r.item_name||''}</td><td>${Number(r.total||0).toLocaleString()}</td></tr>`).join('');
    const delRows = delinquency.map(r => `<tr><td>${r.month}</td><td>${Number(r.billed||0).toLocaleString()}</td><td>${Number(r.paid||0).toLocaleString()}</td><td>${Number(r.outstanding||0).toLocaleString()}</td><td>${(Number(r.rate||0)*100).toFixed(1)}%</td></tr>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8">${style}</head><body>${kpiHtml}
      <h3>Incomes (Monthly)</h3><table><thead><tr><th>Month</th><th>Total</th></tr></thead><tbody>${incRows}</tbody></table>
      <h3>Expenses (Month/Item)</h3><table><thead><tr><th>Month</th><th>Item</th><th>Total</th></tr></thead><tbody>${exRows}</tbody></table>
      <h3>Delinquency</h3><table><thead><tr><th>Month</th><th>Billed</th><th>Paid</th><th>Outstanding</th><th>Rate</th></tr></thead><tbody>${delRows}</tbody></table>
      <script>window.onload=function(){window.print();window.close();}</script>
    </body></html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  if (loading) return <Loader message={t('common.loading')} />;
  if (error) return <div className="p-6"><ErrorAlert message={error} /></div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-4 text-sky-700">{t('nav.finance')}</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('finance.filters.from')}</label>
          <input type="month" value={fromYm} onChange={(e) => setFromYm(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('finance.filters.to')}</label>
          <input type="month" value={toYmVal} onChange={(e) => setToYmVal(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('finance.filters.category')}</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded bg-white">
            {categories.map((c) => (
              <option key={c} value={c}>{c || t('common.na')}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={applyFilters} className="w-full p-2 rounded bg-teal-600 text-white hover:bg-teal-700">{t('common.apply')}</button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="text-2xl text-gray-500">{t('finance.incomes')}</p>
          <p className="text-3xl font-bold text-green-600">{incomesSum.toLocaleString()}원</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="text-2xl text-gray-500">{t('finance.expenses')}</p>
          <p className="text-3xl font-bold text-blue-600">{expensesSum.toLocaleString()}원</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="text-2xl text-gray-500">{t('finance.outstanding')}</p>
          <p className="text-3xl font-bold text-red-600">{outstandingSum.toLocaleString()}원</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2">{t('finance.trend')}</h4>
          <canvas ref={lineRef} height="160" />
        </div>
        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2">{t('finance.expenseShareRecent')}</h4>
          <canvas ref={pieRef} height="160" />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2">{t('finance.sections.incomesMonthly')}</h4>
          <table className="w-full text-sm">
            <thead className="bg-gray-100"><tr><th className="p-2 text-left">{t('finance.table.month')}</th><th className="p-2 text-right">{t('finance.table.total')}</th></tr></thead>
            <tbody>
              {filteredIncomes.map((r, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{r.month}</td>
                  <td className="p-2 text-right">{Number(r.total || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2">{t('finance.sections.expensesMonthItem')}</h4>
          <table className="w-full text-sm">
            <thead className="bg-gray-100"><tr><th className="p-2 text-left">{t('finance.table.month')}</th><th className="p-2 text-left">{t('finance.table.item')}</th><th className="p-2 text-right">{t('finance.table.total')}</th></tr></thead>
            <tbody>
              {filteredExpenses.map((r, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{r.month}</td>
                  <td className="p-2">{r.itemName || r.item_name}</td>
                  <td className="p-2 text-right">{Number(r.total || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-4 rounded border mt-6">
        <h4 className="font-semibold mb-2">{t('finance.sections.delinquencyRange')}</h4>
        <table className="w-full text-sm">
          <thead className="bg-gray-100"><tr><th className="p-2 text-left">{t('finance.table.month')}</th><th className="p-2 text-right">{t('finance.table.billed')}</th><th className="p-2 text-right">{t('finance.table.paid')}</th><th className="p-2 text-right">{t('finance.table.outstanding')}</th><th className="p-2 text-right">{t('finance.table.rate')}</th></tr></thead>
          <tbody>
            {delinquency.map((r, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{r.month}</td>
                <td className="p-2 text-right">{Number(r.billed || 0).toLocaleString()}</td>
                <td className="p-2 text-right">{Number(r.paid || 0).toLocaleString()}</td>
                <td className="p-2 text-right">{Number(r.outstanding || 0).toLocaleString()}</td>
                <td className="p-2 text-right">{(Number(r.rate || 0) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Downloads */}
      <div className="mt-6 flex gap-3">
        <button onClick={downloadCsv} className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800">{t('finance.actions.downloadCsv')}</button>
        <button onClick={downloadPdf} className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700">{t('finance.actions.downloadPdf')}</button>
      </div>
    </div>
  );
};

export default FinanceScreen;
