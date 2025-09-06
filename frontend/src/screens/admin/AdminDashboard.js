import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../../components/common/Modal';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { navigateTo, fetchWithAuth } = useAppContext();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kpi, setKpi] = useState({ outstanding: 0, incomes: 0, expenses: 0 });

  const lineRef = useRef(null);
  const pieRef = useRef(null);
  const lineChart = useRef(null);
  const pieChart = useRef(null);

  const ym = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    const load = async () => {
      try {
        const to = new Date();
        const from = new Date(to.getFullYear(), to.getMonth() - 5, 1);
        const qs = `?from=${ym(from)}&to=${ym(to)}`;

        const resIn = await fetchWithAuth('/admin/reports/incomes');
        const incomes = resIn.ok ? await resIn.json() : [];

        const resEx = await fetchWithAuth('/admin/reports/expenses');
        const expenses = resEx.ok ? await resEx.json() : [];

        const resDel = await fetchWithAuth(`/admin/reports/delinquency${qs}`);
        const delin = resDel.ok ? await resDel.json() : [];

        const incomesSum = incomes.reduce((s, r) => s + Number(r.total || 0), 0);
        const expensesSum = expenses.reduce((s, r) => s + Number(r.total || 0), 0);
        const outstandingSum = delin.reduce((s, r) => s + Number(r.outstanding || 0), 0);
        setKpi({ incomes: incomesSum, expenses: expensesSum, outstanding: outstandingSum });

        const monthsSet = new Set([...incomes.map((x) => x.month), ...expenses.map((x) => x.month)]);
        const months = Array.from(monthsSet).sort();
        const imap = incomes.reduce((m, x) => ((m[x.month] = Number(x.total || 0)), m), {});
        const exByMonth = expenses.reduce((m, x) => {
          const key = x.month; m[key] = (m[key] || 0) + Number(x.total || 0); return m;
        }, {});
        const incomeSeries = months.map((m) => imap[m] || 0);
        const expenseSeries = months.map((m) => exByMonth[m] || 0);

        if (lineChart.current) lineChart.current.destroy();
        lineChart.current = new Chart(lineRef.current, {
          type: 'line',
          data: {
            labels: months,
            datasets: [
              { label: t('finance.incomes'), data: incomeSeries, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.2)', tension: 0.3 },
              { label: t('finance.expenses'), data: expenseSeries, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.2)', tension: 0.3 }
            ]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });

        const lastMonth = months[months.length - 1];
        const expLast = expenses.filter((x) => x.month === lastMonth);
        const labels = expLast.map((x) => x.itemName || x.item_name || 'Item');
        const values = expLast.map((x) => Number(x.total || 0));
        const colors = ['#0ea5e9','#22c55e','#ef4444','#a855f7','#f59e0b','#06b6d4','#84cc16'];
        if (pieChart.current) pieChart.current.destroy();
        pieChart.current = new Chart(pieRef.current, {
          type: 'pie',
          data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      } catch (e) { /* ignore */ }
    };
    load();
    return () => { if (lineChart.current) lineChart.current.destroy(); if (pieChart.current) pieChart.current.destroy(); };
  }, [fetchWithAuth]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4 text-sky-700">{t('nav.dashboard')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div onClick={() => navigateTo('resident_management')} className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition-colors">
            <p className="text-2xl text-gray-500">{t('finance.outstanding')}</p>
            <p className="text-3xl font-bold text-red-600">{kpi.outstanding.toLocaleString()}원</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-2xl text-gray-500">{t('finance.incomes')}</p>
            <p className="text-3xl font-bold text-green-600">{kpi.incomes.toLocaleString()}원</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="text-2xl text-gray-500">{t('finance.expenses')}</p>
            <p className="text-3xl font-bold text-blue-600">{kpi.expenses.toLocaleString()}원</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">{t('finance.trend')}</h4>
            <canvas ref={lineRef} height="160" />
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">{t('finance.expenseShareRecent')}</h4>
            <canvas ref={pieRef} height="160" />
          </div>
        </div>

        <div className="mt-8">
          <button onClick={() => setIsModalOpen(true)} className="w-full p-3 rounded bg-gradient-to-r from-fuchsia-600 to-violet-500 text-white font-bold">{t('communication.aiSummaryButton')}</button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('communication.summaryModalTitle')}>
        <div className="text-sm text-gray-700">{t('communication.aiDisabled')}</div>
      </Modal>
    </>
  );
};

export default AdminDashboard;
