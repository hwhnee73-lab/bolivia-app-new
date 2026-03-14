import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTableBasic from '../../components/reports/DataTableBasic';
import TabNav from '../../components/common/TabNav';
import { FilterPanel, FormField, SelectInput, DateInput, CustomToggle, ChevronDownIcon } from '../../components/reports/Filters';
import { getAccumulatedPortfolio, getHistoricalPortfolio, getUnitAccountStatement } from '../../services/financeReportsService';

// Inline SVG icons (kept local to this page)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
// Data state holders (fetched via service with mock fallback)
// We fetch on-demand per active tab using service functions above.

// CSV helpers
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const toCSVByColumns = (rows, columns) => {
  if (!rows?.length || !columns?.length) return '';
  const header = columns.map((c) => esc(c.header ?? c.accessor ?? '')).join(',');
  const body = rows.map((r) => columns.map((c) => esc(r[c.accessor])).join(',')).join('\r\n');
  return `${header}\r\n${body}`;
};
const toCSV = (rows) => {
  if (!rows?.length) return '';
  const cols = Object.keys(rows[0]);
  const header = cols.map(esc).join(',');
  const body = rows.map((r) => cols.map((c) => esc(r[c])).join(',')).join('\r\n');
  return `${header}\r\n${body}`;
};
const downloadCSV = (rows, filename = 'data.csv', columns) => {
  const csv = columns ? toCSVByColumns(rows, columns) : toCSV(rows);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

const ActionButtons = ({ buttons }) => (
  <div className="flex flex-wrap gap-2 my-4">
    {buttons.map((btn, index) => (
      <button
        key={index}
        type="button"
        onClick={btn.onClick}
        className={`${btn.color} text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:opacity-90 transition-opacity`}
      >
        {btn.icon ? <span className="inline-flex items-center mr-2">{btn.icon}</span> : null}
        {btn.text}
      </button>
    ))}
  </div>
);

// Pages (component refs)
const UnitAccountStatement = () => {
  const { t } = useTranslation();
  const [isComplete, setIsComplete] = useState(true);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getUnitAccountStatement({ complete: isComplete }).then(setRows);
  }, [isComplete]);
  const columns = [
    { header: t('reportsUI.columns.tipo'), accessor: 'tipo' },
    { header: t('reportsUI.columns.rubro'), accessor: 'rubro' },
    { header: t('reportsUI.columns.fecha'), accessor: 'fecha' },
    { header: t('reportsUI.columns.vencimiento'), accessor: 'vencimiento' },
    { header: t('reportsUI.columns.nroRecibo'), accessor: 'nroRecibo' },
    { header: t('reportsUI.columns.detalle'), accessor: 'detalle' },
    { header: t('reportsUI.columns.valor'), accessor: 'valor', textAlign: 'text-right' },
    { header: t('reportsUI.columns.descuento'), accessor: 'descuento', textAlign: 'text-right' },
    { header: t('reportsUI.columns.saldo'), accessor: 'saldo', textAlign: 'text-right' },
  ];

  const handleExport = () => downloadCSV(rows, 'estado_de_cuenta.csv', columns);

  return (
    <div>
      <FilterPanel title={t('reportsUI.filters.title')}>
        <FormField label={t('reportsUI.filters.view')}>
          <SelectInput>
            <option>{t('reportsUI.filters.viewDetailed')}</option>
            <option>{t('reportsUI.filters.viewSummary')}</option>
          </SelectInput>
        </FormField>
        <FormField label={t('reportsUI.filters.unitRequired')}>
          <SelectInput>
            <option>B10 - 1A - Karen Susana Dipp Saal</option>
            <option>B10 - 1B - Lourdes Ximena Ajata Soto</option>
          </SelectInput>
        </FormField>
        <FormField label={t('reportsUI.filters.complete')}>
          <CustomToggle checked={isComplete} onChange={setIsComplete} />
        </FormField>
      </FilterPanel>
      <ActionButtons
        buttons={[
          { text: t('reportsUI.actions.viewReport'), color: 'bg-blue-500' },
          { text: t('reportsUI.actions.exportExcel'), color: 'bg-green-500', onClick: handleExport },
          { text: t('reportsUI.actions.print'), color: 'bg-yellow-500' },
        ]}
      />
      <DataTableBasic columns={columns} data={rows} searchPlaceholder={t('reportsUI.search')} />
    </div>
  );
};

const HistoricalPortfolio = () => {
  const { t } = useTranslation();
  const [includeDue, setIncludeDue] = useState(true);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getHistoricalPortfolio({ includeDue }).then(setRows);
  }, [includeDue]);
  const columns = [
    { header: t('reportsUI.columns.unidad'), accessor: 'unidad' },
    { header: t('reportsUI.columns.representante'), accessor: 'representante' },
    { header: t('reportsUI.columns.porVencer'), accessor: 'porVencer', textAlign: 'text-right' },
    { header: t('reportsUI.columns.dias30'), accessor: 'dias30', textAlign: 'text-right' },
    { header: t('reportsUI.columns.dias60'), accessor: 'dias60', textAlign: 'text-right' },
    { header: t('reportsUI.columns.dias90'), accessor: 'dias90', textAlign: 'text-right' },
    { header: t('reportsUI.columns.dias120'), accessor: 'dias120', textAlign: 'text-right' },
    { header: t('reportsUI.columns.mas120'), accessor: 'mas120', textAlign: 'text-right' },
    { header: t('reportsUI.columns.total'), accessor: 'total', textAlign: 'text-right' },
  ];
  const footerData = [
    { text: 'TOTALES', colSpan: 2 },
    { text: 'Bs217.957,10', textAlign: 'text-right' },
    { text: 'Bs64.418,50', textAlign: 'text-right' },
    { text: 'Bs3.560,40', textAlign: 'text-right' },
    { text: 'Bs42.370,31', textAlign: 'text-right' },
    { text: 'Bs35.835,39', textAlign: 'text-right' },
    { text: '', textAlign: 'text-right' },
    { text: 'Bs251.715,86', textAlign: 'text-right' },
  ];

  const handleExport = () => downloadCSV(rows, 'cartera_historica.csv', columns);
  const handleExportDetalle = () => downloadCSV(rows, 'cartera_historica_detalle.csv', columns);

  return (
    <div>
      <FilterPanel title={t('reportsUI.filters.title')}>
        <FormField label={t('reportsUI.filters.view')}>
          <SelectInput>
            <option>{t('reportsUI.filters.viewDistributed')}</option>
          </SelectInput>
        </FormField>
        <FormField label={t('reportsUI.filters.cutoffRequired')}>
          <DateInput value={''} onChange={() => {}} />
        </FormField>
        <FormField label={t('reportsUI.filters.unit')}>
          <SelectInput defaultValue="">
            <option value="">- {t('reportsUI.filters.none')} -</option>
          </SelectInput>
        </FormField>
        <FormField label={t('reportsUI.filters.includeDue')}>
          <CustomToggle checked={includeDue} onChange={setIncludeDue} />
        </FormField>
      </FilterPanel>
      <ActionButtons
        buttons={[
          { text: t('reportsUI.actions.viewReport'), color: 'bg-blue-500' },
          { text: t('reportsUI.actions.exportExcel'), color: 'bg-green-500', onClick: handleExport },
          { text: t('reportsUI.actions.exportExcelDetail'), color: 'bg-red-500', onClick: handleExportDetalle },
          { text: t('reportsUI.actions.print'), color: 'bg-yellow-500' },
        ]}
      />
      <DataTableBasic columns={columns} data={rows} footer={footerData} searchPlaceholder={t('reportsUI.search')} />
    </div>
  );
};

const AccumulatedPortfolio = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getAccumulatedPortfolio({}).then(setRows);
  }, []);
  const columns = [
    { header: t('reportsUI.columns.unidad'), accessor: 'unidad' },
    { header: t('reportsUI.columns.valorExpensa'), accessor: 'valorExpensa', textAlign: 'text-right' },
    { header: t('reportsUI.columns.identificacion'), accessor: 'identificacion' },
    { header: t('reportsUI.columns.representante'), accessor: 'representante' },
    { header: t('reportsUI.columns.correo'), accessor: 'correo' },
    { header: t('reportsUI.columns.celular'), accessor: 'celular' },
    { header: t('reportsUI.columns.diasVencidos'), accessor: 'diasVencidos', textAlign: 'text-right' },
    { header: t('reportsUI.columns.total'), accessor: 'total', textAlign: 'text-right' },
  ];

  const footerData = [
    { text: '', colSpan: 7 },
    { text: 'Bs. 615.857,56', textAlign: 'text-right' },
  ];

  const handleExport = () => downloadCSV(rows, 'cartera_acumulada.csv', columns);

  return (
    <div>
      <FilterPanel title={t('reportsUI.filters.title')}>
        <FormField label={t('reportsUI.filters.year')}>
          <SelectInput>
            <option>-{t('reportsUI.filters.allYears')}-</option>
            <option>2025</option>
            <option>2024</option>
          </SelectInput>
        </FormField>
      </FilterPanel>
      <ActionButtons
        buttons={[
          { text: t('reportsUI.actions.viewReport'), color: 'bg-blue-500' },
          { text: t('reportsUI.actions.exportExcel'), color: 'bg-green-500', onClick: handleExport },
          { text: t('reportsUI.actions.print'), color: 'bg-yellow-500' },
        ]}
      />
      <DataTableBasic columns={columns} data={rows} footer={footerData} searchPlaceholder={t('reportsUI.search')} />
    </div>
  );
};

const pages = (t) => ({
  [t('reportsUI.tabs.unitAccount')]: {
    component: UnitAccountStatement,
    breadcrumb: [t('nav.finance'), t('reportsUI.tabs.unitAccount')],
  },
  [t('reportsUI.tabs.historical')]: {
    component: HistoricalPortfolio,
    breadcrumb: [t('nav.finance'), t('reportsUI.tabs.historical')],
  },
  [t('reportsUI.tabs.accumulated')]: {
    component: AccumulatedPortfolio,
    breadcrumb: [t('nav.finance'), t('reportsUI.tabs.accumulated')],
  },
});

export default function FinanceReportsUI() {
  const { t } = useTranslation();
  const pageMap = useMemo(() => pages(t), [t]);
  const pageKeys = Object.keys(pageMap);
  const [activePage, setActivePage] = useState(pageKeys[0]);
  const { component: Component, breadcrumb } = pageMap[activePage];

  const slug = (s) => String(s).toLowerCase().replace(/\s+/g, '-');
  const currentIndex = useMemo(() => pageKeys.indexOf(activePage), [activePage, pageKeys]);
  const onTabKeyDown = (e, idx) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const next = (idx + delta + pageKeys.length) % pageKeys.length;
    const nextKey = pageKeys[next];
    setActivePage(nextKey);
    const nextId = `tab-${slug(nextKey)}`;
    requestAnimationFrame(() => document.getElementById(nextId)?.focus());
  };

  const handleDownloadAll = () => {
    const slug = activePage.toLowerCase().replace(/\s+/g, '_');
    // Attempt to fetch for current tab, then download
    const fetcher = activePage === t('reportsUI.tabs.unitAccount')
      ? getUnitAccountStatement
      : activePage === t('reportsUI.tabs.historical')
      ? getHistoricalPortfolio
      : getAccumulatedPortfolio;
    fetcher({}).then((rows) => downloadCSV(rows, `${slug}.csv`));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <HomeIcon />
            <ChevronRightIcon />
            <span>{breadcrumb[0]}</span>
            <ChevronRightIcon />
            <span className="font-semibold text-gray-700">{breadcrumb[1]}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">
            {activePage} »
          </h1>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <SelectInput>
            <option>{t('reportsUI.condoPlaceholder')}</option>
          </SelectInput>
          <button
            type="button"
            onClick={handleDownloadAll}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            <DownloadIcon />
            {t('reportsUI.actions.downloadAll')}
          </button>
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200">
        <TabNav
          tabs={pageKeys.map((k) => ({ key: k, label: k }))}
          activeKey={activePage}
          onChange={setActivePage}
          ariaLabel={t('nav.finance')}
        />
      </div>

      <div
        id={`panel-${slug(activePage)}`}
        role="tabpanel"
        aria-labelledby={`tab-${slug(activePage)}`}
        tabIndex={0}
      >
        <Component />
      </div>
    </div>
  );
}
