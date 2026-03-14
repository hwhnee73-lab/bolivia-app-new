import React, { useMemo, useState } from 'react';
import TabNav from '../../components/common/TabNav';
import DataTableBasic from '../../components/reports/DataTableBasic';
import { FilterPanel, FormField, SelectInput, DateInput, CustomToggle } from '../../components/reports/Filters';

// Minimal inline icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

// Data (Korean labels from provided datasets)
const unitAccountStatementData = [
  { tipo: '받을계정', rubro: '월간비용', fecha: '2025-08-01', vencimiento: '2025-09-10', nroRecibo: '', detalle: '2025년 8월비용', valor: 'Bs348,00', descuento: '', saldo: 'Bs348,00' },
  { tipo: '받을계정', rubro: '수도소비', fecha: '2025-08-28', vencimiento: '2025-09-10', nroRecibo: '', detalle: '7월-8월수도', valor: 'Bs44,77', descuento: '', saldo: 'Bs392,77' },
  { tipo: '받을계정', rubro: '월간비용', fecha: '2025-09-05', vencimiento: '2025-10-10', nroRecibo: '', detalle: '2025년 9월비용', valor: 'Bs348,00', descuento: '', saldo: 'Bs740,77' },
  { tipo: '', rubro: '', fecha: '', vencimiento: '', nroRecibo: '', detalle: '최종지불금액', valor: 'Bs0,00', descuento: '', saldo: 'Bs740,77' },
];

const historicalPortfolioData = [
  { unidad: '아파트 B1 - 1A', 대표자: '조니페데리코핀토파본', representante: '조니페데리코핀토파본', porVencer: 'Bs696,00', dias30: 'Bs0,00', dias60: 'Bs0,00', dias90: 'Bs0,00', dias120: 'Bs0,00', mas120: 'Bs0,00', total: 'Bs696,00' },
  { unidad: '아파트 B1 - 1B', 대표자: '라파엘알레한드로고메즈로드리게스', representante: '라파엘알레한드로고메즈로드리게스', porVencer: 'Bs741,99', dias30: 'Bs381,67', dias60: 'Bs0,00', dias90: 'Bs385,01', dias120: 'Bs391,93', mas120: 'Bs6.772,32', total: 'Bs8.272,92' },
  { unidad: '아파트 B1 - 2A', 대표자: '그렉메르카도', representante: '그렉메르카도', porVencer: 'Bs701,37', dias30: 'Bs356,11', dias60: 'Bs0,00', dias90: 'Bs357,49', dias120: 'Bs8,16', mas120: 'Bs0,00', total: 'Bs1.423,13' },
  { unidad: '아파트 B1 - 2B', 대표자: '마르셀로사베드라', representante: '마르셀로사베드라', porVencer: 'Bs765,60', dias30: 'Bs0,00', dias60: 'Bs0,00', dias90: 'Bs0,00', dias120: 'Bs0,00', mas120: 'Bs0,00', total: 'Bs765,60' },
  { unidad: '아파트 B1 - 3A', 대표자: '로베르토곤잘레스', representante: '로베르토곤잘레스', porVencer: 'Bs697,35', dias30: 'Bs348,00', dias60: 'Bs0,00', dias90: 'Bs0,00', dias120: 'Bs0,00', mas120: 'Bs0,00', total: 'Bs1.045,35' },
];

const accumulatedPortfolioData = [
  { unidad: '아파트 B0 - 1', valorExpensa: 'Bs696,00', identificacion: '1600-B0-1', representante: '선셋그룹 SRL', correo: '', celular: '74260215', diasVencidos: 211, total: 'Bs6.264,00' },
  { unidad: '아파트 B10 - 1A', valorExpensa: 'Bs348,00', identificacion: '4894649', representante: '카렌수사나딥살', correo: '', celular: '77200001', diasVencidos: -1, total: 'Bs740,77' },
  { unidad: '아파트 B10 - 1B', valorExpensa: 'Bs382,80', identificacion: '1600-B10-1B', representante: '루르데스히메나아하타소토', correo: '', celular: '07655537', diasVencidos: 61, total: 'Bs1.578,00' },
  { unidad: '아파트 B10 - 2A', valorExpensa: 'Bs348,00', identificacion: '6855310', 대표자: '에릭롤란도다니엘리마치카디마', representante: '에릭롤란도다니엘리마치카디마', correo: '', celular: '76255537', diasVencidos: 206, total: 'Bs1.503,45' },
  { unidad: '아파트 B10 - 2B', valorExpensa: 'Bs348,00', identificacion: '2621930', representante: '마리아가브리엘라실레스칸가스', correo: 'ga_basi@hotmail.com', celular: '068146169', diasVencidos: 30, total: 'Bs1.144,00' },
];

const yearlyPortfolioData = [
  { unidad: 'B0 - 1 - 선셋그룹 SRL', saldoAnt: '', ene: 'Bs696,00', feb: 'Bs696,00', mar: 'Bs696,00', abr: 'Bs696,00', may: 'Bs696,00', jun: 'Bs696,00', jul: 'Bs696,00', ago: 'Bs696,00', sep: 'Bs696,00', oct: '', nov: '', dic: '', total: 'Bs6.264,00' },
  { unidad: 'B10 - 1A - 카렌수사나딥살', saldoAnt: '', ene: '', feb: '', mar: '', abr: '', may: '', jun: '', jul: '', ago: 'Bs392,77', sep: 'Bs348,00', oct: '', nov: '', dic: '', total: 'Bs740,77' },
  { unidad: 'B10 - 1B - 루르데스히메나아하타소토', saldoAnt: '', ene: '', feb: '', mar: '', abr: '', may: '', jun: 'Bs382,80', jul: 'Bs382,80', ago: 'Bs429,60', sep: 'Bs382,80', oct: '', nov: '', dic: '', total: 'Bs1.578,00' },
];

const economicReportData = [
  { rubro: '2025년 9월 1일부터 2025년 9월 9일까지', valor: '', total: '', isHeader: true },
  { rubro: '수입', valor: '', total: '', isHeader: true, isSubHeader: true },
  { rubro: '교차예정선급금', valor: '', total: 'Bs72,53' },
  { rubro: '미확인수입', valor: '', total: '' },
  { rubro: '1. 일반수입', valor: '', total: 'Bs40.338,24' },
  { rubro: '1.1. 월간비용', valor: 'Bs36.577,63', total: '' },
  { rubro: '1.3. 수도소비', valor: 'Bs3.760,61', total: '' },
  { rubro: '3. 특별수입', valor: '', total: 'Bs60,00' },
  { rubro: '그릴예약', valor: 'Bs60,00', total: '' },
  { rubro: '수입합계', valor: '', total: 'Bs40.470,77', isTotal: true },
];

const currentOverduePortfolioData = [
  { unidad: '아파트 B1 - 1A', valorExpensa: 'Bs348,00', totalCuotas: 'Bs10.144,98', abonado: 'Bs9.398,98', descuentos: 'Bs0,00', saldo: 'Bs746,00', corriente: 'Bs696,00', dias30: 'Bs0,00', pct30: '0,0%', dias60: 'Bs50,00', pct60: '100,0%', dias90: 'Bs0,00', pct90: '0,0%', mas90: 'Bs0,00', pctMas90: '0,0%', totalVencido: 'Bs50,00' },
  { unidad: '아파트 B1 - 1B', valorExpensa: 'Bs348,00', totalCuotas: 'Bs13.934,08', abonado: 'Bs5.861,16', descuentos: 'Bs0,00', saldo: 'Bs8.072,92', corriente: 'Bs741,99', dias30: 'Bs381,67', pct30: '5,0%', dias60: 'Bs0,00', pct60: '0,0%', dias90: 'Bs385,01', pct90: '5,0%', mas90: 'Bs6.564,25', pctMas90: '90,0%', totalVencido: 'Bs7.330,93' },
];

// CSV helpers
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const toCSVByColumns = (rows, columns) => {
  if (!rows?.length || !columns?.length) return '';
  const header = columns.map((c) => esc(c.header ?? c.accessor ?? '')).join(',');
  const body = rows.map((r) => columns.map((c) => esc(r[c.accessor])).join(',')).join('\r\n');
  return `${header}\r\n${body}`;
};
const downloadCSV = (rows, filename, columns) => {
  const csv = toCSVByColumns(rows, columns);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

// Economic Report (header/subheader/total styling)
function EconomicReportList({ rows }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800">콘도 경제 보고서</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">항목</th>
              <th className="px-4 py-2 text-right font-medium text-gray-600">금액</th>
              <th className="px-4 py-2 text-right font-medium text-gray-600">합계</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rows.map((r, i) => {
              const base = r.isHeader
                ? 'bg-gray-100 font-semibold text-gray-900'
                : r.isTotal
                ? 'bg-emerald-50 font-semibold text-emerald-800'
                : 'text-gray-800';
              return (
                <tr key={i} className={r.isHeader ? 'border-t border-gray-200' : ''}>
                  <td className={`px-4 py-2 ${base} ${r.isSubHeader ? 'pl-8' : ''}`}>{r.rubro}</td>
                  <td className={`px-4 py-2 ${base} text-right`}>{r.valor}</td>
                  <td className={`px-4 py-2 ${base} text-right`}>{r.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Pages (per tab)
function UnitAccountStatement() {
  const [isComplete, setIsComplete] = useState(true);
  const columns = [
    { header: '유형', accessor: 'tipo' },
    { header: '항목', accessor: 'rubro' },
    { header: '날짜', accessor: 'fecha' },
    { header: '만기일', accessor: 'vencimiento' },
    { header: '영수증번호', accessor: 'nroRecibo' },
    { header: '상세', accessor: 'detalle' },
    { header: '금액', accessor: 'valor', align: 'text-right' },
    { header: '할인', accessor: 'descuento', align: 'text-right' },
    { header: '잔액', accessor: 'saldo', align: 'text-right' },
  ];
  const rows = isComplete ? unitAccountStatementData : unitAccountStatementData.filter((r) => r.detalle !== '최종지불금액');
  const exportAll = () => downloadCSV(rows, 'estado_de_cuenta.csv', columns);

  return (
    <div>
      <FilterPanel title="검색상세설정">
        <FormField label="보고서보기">
          <SelectInput defaultValue="detailed">
            <option value="detailed">상세히</option>
            <option value="summary">요약</option>
          </SelectInput>
        </FormField>
        <FormField label="유닛 *">
          <SelectInput defaultValue="B10-1A">
            <option value="B10-1A">B10 - 1A - 카렌수사나딥살</option>
            <option value="B10-1B">B10 - 1B - 루르데스히메나아하타소토</option>
          </SelectInput>
        </FormField>
        <FormField label="전체계정명세서?">
          <CustomToggle checked={isComplete} onChange={setIsComplete} />
        </FormField>
      </FilterPanel>
      <div className="flex gap-2 my-4">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">보고서보기</button>
        <button type="button" onClick={exportAll} className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <DownloadIcon /> Excel로내보내기
        </button>
      </div>
      <DataTableBasic columns={columns} data={rows} searchPlaceholder="검색" />
    </div>
  );
}

function HistoricalPortfolio() {
  const [includeDue, setIncludeDue] = useState(true);
  const columns = [
    { header: '유닛', accessor: 'unidad' },
    { header: '대표자', accessor: 'representante' },
    { header: '만기예정', accessor: 'porVencer', align: 'text-right' },
    { header: '30일', accessor: 'dias30', align: 'text-right' },
    { header: '60일', accessor: 'dias60', align: 'text-right' },
    { header: '90일', accessor: 'dias90', align: 'text-right' },
    { header: '120일', accessor: 'dias120', align: 'text-right' },
    { header: '> 120일', accessor: 'mas120', align: 'text-right' },
    { header: '합계', accessor: 'total', align: 'text-right' },
  ];
  const rows = includeDue ? historicalPortfolioData : historicalPortfolioData.map((r) => ({ ...r, porVencer: 'Bs0,00' }));
  const exportAll = () => downloadCSV(rows, 'cartera_historica.csv', columns);

  const footer = [
    { text: '합계', colSpan: 2, textAlign: 'text-right' },
    { text: '', textAlign: 'text-right' },
    { text: '', textAlign: 'text-right' },
    { text: '', textAlign: 'text-right' },
    { text: '', textAlign: 'text-right' },
    { text: '', textAlign: 'text-right' },
    { text: '', textAlign: 'text-right' },
    { text: '', textAlign: 'text-right' },
  ];

  return (
    <div>
      <FilterPanel title="검색상세설정">
        <FormField label="보고서보기">
          <SelectInput defaultValue="distributed">
            <option value="distributed">분산형</option>
          </SelectInput>
        </FormField>
        <FormField label="마감일 *">
          <DateInput value="2025-09-09" onChange={() => {}} />
        </FormField>
        <FormField label="유닛">
          <SelectInput defaultValue="">
            <option value="">- 선택없음 -</option>
          </SelectInput>
        </FormField>
        <FormField label="만기예정포트폴리오포함?">
          <CustomToggle checked={includeDue} onChange={setIncludeDue} />
        </FormField>
      </FilterPanel>
      <div className="flex gap-2 my-4">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">보고서보기</button>
        <button type="button" onClick={exportAll} className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <DownloadIcon /> Excel로내보내기
        </button>
      </div>
      <DataTableBasic columns={columns} data={rows} footer={footer} searchPlaceholder="검색" />
    </div>
  );
}

function AccumulatedPortfolio() {
  const columns = [
    { header: '유닛', accessor: 'unidad' },
    { header: '비용별금액', accessor: 'valorExpensa', align: 'text-right' },
    { header: '식별', accessor: 'identificacion' },
    { header: '대표자', accessor: 'representante' },
    { header: '이메일', accessor: 'correo' },
    { header: '휴대폰', accessor: 'celular' },
    { header: '연체일', accessor: 'diasVencidos', align: 'text-right' },
    { header: '합계', accessor: 'total', align: 'text-right' },
  ];
  const exportAll = () => downloadCSV(accumulatedPortfolioData, 'cartera_acumulada.csv', columns);
  const footer = [
    { text: '', colSpan: 7 },
    { text: 'Bs. 615.857,56', textAlign: 'text-right' },
  ];
  return (
    <div>
      <FilterPanel title="검색상세설정">
        <FormField label="연도">
          <SelectInput defaultValue="">
            <option value="">-모든연도-</option>
            <option>2025</option>
            <option>2024</option>
          </SelectInput>
        </FormField>
      </FilterPanel>
      <div className="flex gap-2 my-4">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">보고서보기</button>
        <button type="button" onClick={exportAll} className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <DownloadIcon /> Excel로내보내기
        </button>
      </div>
      <DataTableBasic columns={columns} data={accumulatedPortfolioData} footer={footer} searchPlaceholder="검색" />
    </div>
  );
}

function YearlyPortfolio() {
  const columns = [
    { header: '유닛', accessor: 'unidad' },
    { header: '이전잔액', accessor: 'saldoAnt', align: 'text-right' },
    { header: '1월', accessor: 'ene', align: 'text-right' },
    { header: '2월', accessor: 'feb', align: 'text-right' },
    { header: '3월', accessor: 'mar', align: 'text-right' },
    { header: '4월', accessor: 'abr', align: 'text-right' },
    { header: '5월', accessor: 'may', align: 'text-right' },
    { header: '6월', accessor: 'jun', align: 'text-right' },
    { header: '7월', accessor: 'jul', align: 'text-right' },
    { header: '8월', accessor: 'ago', align: 'text-right' },
    { header: '9월', accessor: 'sep', align: 'text-right' },
    { header: '10월', accessor: 'oct', align: 'text-right' },
    { header: '11월', accessor: 'nov', align: 'text-right' },
    { header: '12월', accessor: 'dic', align: 'text-right' },
    { header: '합계', accessor: 'total', align: 'text-right' },
  ];
  const exportAll = () => downloadCSV(yearlyPortfolioData, 'cartera_anual.csv', columns);
  return (
    <div>
      <FilterPanel title="검색상세설정">
        <FormField label="연도 *">
          <SelectInput defaultValue="2025">
            <option>2025</option>
            <option>2024</option>
          </SelectInput>
        </FormField>
      </FilterPanel>
      <div className="flex gap-2 my-4">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">보고서보기</button>
        <button type="button" onClick={exportAll} className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <DownloadIcon /> Excel로내보내기
        </button>
      </div>
      <DataTableBasic columns={columns} data={yearlyPortfolioData} searchPlaceholder="검색" />
    </div>
  );
}

function EconomicReport() {
  return (
    <div>
      <FilterPanel title="보고서필터">
        <FormField label="시작일 *">
          <DateInput value="2025-09-01" onChange={() => {}} />
        </FormField>
        <FormField label="종료일 *">
          <DateInput value="2025-09-09" onChange={() => {}} />
        </FormField>
      </FilterPanel>
      <div className="flex gap-2 my-4">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">보고서보기</button>
        <button type="button" className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <DownloadIcon /> Excel로내보내기
        </button>
      </div>
      <EconomicReportList rows={economicReportData} />
    </div>
  );
}

function CurrentOverduePortfolio() {
  const columns = [
    { header: '유닛', accessor: 'unidad' },
    { header: '비용', accessor: 'valorExpensa', align: 'text-right' },
    { header: '총할부금', accessor: 'totalCuotas', align: 'text-right' },
    { header: '납부', accessor: 'abonado', align: 'text-right' },
    { header: '할인', accessor: 'descuentos', align: 'text-right' },
    { header: '잔액', accessor: 'saldo', align: 'text-right' },
    { header: '현재', accessor: 'corriente', align: 'text-right' },
    { header: '30일', accessor: 'dias30', align: 'text-right' },
    { header: '%', accessor: 'pct30', align: 'text-right' },
    { header: '60일', accessor: 'dias60', align: 'text-right' },
    { header: '%', accessor: 'pct60', align: 'text-right' },
    { header: '90일', accessor: 'dias90', align: 'text-right' },
    { header: '%', accessor: 'pct90', align: 'text-right' },
    { header: '>90일', accessor: 'mas90', align: 'text-right' },
    { header: '%', accessor: 'pctMas90', align: 'text-right' },
    { header: '총연체금액', accessor: 'totalVencido', align: 'text-right' },
  ];
  return (
    <div>
      <FilterPanel title="검색상세설정">
        <FormField label="마감일 *">
          <DateInput value="2025-09-09" onChange={() => {}} />
        </FormField>
        <FormField label="유닛">
          <SelectInput defaultValue="">
            <option value="">- 선택없음 -</option>
          </SelectInput>
        </FormField>
      </FilterPanel>
      <div className="flex gap-2 my-4">
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">보고서보기</button>
        <button type="button" className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <DownloadIcon /> Excel로내보내기
        </button>
      </div>
      <DataTableBasic columns={columns} data={currentOverduePortfolioData} searchPlaceholder="검색" />
    </div>
  );
}

const pages = {
  유닛계정명세서: { component: UnitAccountStatement, breadcrumb: ['보고서', '유닛계정명세서'] },
  과거포트폴리오: { component: HistoricalPortfolio, breadcrumb: ['보고서', '과거포트폴리오'] },
  누적포트폴리오: { component: AccumulatedPortfolio, breadcrumb: ['보고서', '누적포트폴리오'] },
  연간포트폴리오: { component: YearlyPortfolio, breadcrumb: ['보고서', '연간포트폴리오'] },
  콘도경제보고서: { component: EconomicReport, breadcrumb: ['보고서', '콘도경제보고서'] },
  현재및연체포트폴리오: { component: CurrentOverduePortfolio, breadcrumb: ['보고서', '현재및연체포트폴리오'] },
};

const slug = (s) => String(s).toLowerCase().replace(/\s+/g, '-');

export default function ReportsKR() {
  const tabs = Object.keys(pages).map((k) => ({ key: k, label: k }));
  const [active, setActive] = useState(tabs[0].key);
  const { component: Component, breadcrumb } = pages[active];

  // For top-right bulk export
  const rowsMap = useMemo(
    () => ({
      유닛계정명세서: unitAccountStatementData,
      과거포트폴리오: historicalPortfolioData,
      누적포트폴리오: accumulatedPortfolioData,
      연간포트폴리오: yearlyPortfolioData,
      콘도경제보고서: economicReportData,
      현재및연체포트폴리오: currentOverduePortfolioData,
    }),
    [],
  );
  const columnsMap = useMemo(
    () => ({
      유닛계정명세서: [
        { header: '유형', accessor: 'tipo' },
        { header: '항목', accessor: 'rubro' },
        { header: '날짜', accessor: 'fecha' },
        { header: '만기일', accessor: 'vencimiento' },
        { header: '영수증번호', accessor: 'nroRecibo' },
        { header: '상세', accessor: 'detalle' },
        { header: '금액', accessor: 'valor' },
        { header: '할인', accessor: 'descuento' },
        { header: '잔액', accessor: 'saldo' },
      ],
      과거포트폴리오: [
        { header: '유닛', accessor: 'unidad' },
        { header: '대표자', accessor: 'representante' },
        { header: '만기예정', accessor: 'porVencer' },
        { header: '30일', accessor: 'dias30' },
        { header: '60일', accessor: 'dias60' },
        { header: '90일', accessor: 'dias90' },
        { header: '120일', accessor: 'dias120' },
        { header: '> 120일', accessor: 'mas120' },
        { header: '합계', accessor: 'total' },
      ],
      누적포트폴리오: [
        { header: '유닛', accessor: 'unidad' },
        { header: '비용별금액', accessor: 'valorExpensa' },
        { header: '식별', accessor: 'identificacion' },
        { header: '대표자', accessor: 'representante' },
        { header: '이메일', accessor: 'correo' },
        { header: '휴대폰', accessor: 'celular' },
        { header: '연체일', accessor: 'diasVencidos' },
        { header: '합계', accessor: 'total' },
      ],
      연간포트폴리오: [
        { header: '유닛', accessor: 'unidad' },
        { header: '이전잔액', accessor: 'saldoAnt' },
        { header: '1월', accessor: 'ene' },
        { header: '2월', accessor: 'feb' },
        { header: '3월', accessor: 'mar' },
        { header: '4월', accessor: 'abr' },
        { header: '5월', accessor: 'may' },
        { header: '6월', accessor: 'jun' },
        { header: '7월', accessor: 'jul' },
        { header: '8월', accessor: 'ago' },
        { header: '9월', accessor: 'sep' },
        { header: '10월', accessor: 'oct' },
        { header: '11월', accessor: 'nov' },
        { header: '12월', accessor: 'dic' },
        { header: '합계', accessor: 'total' },
      ],
      콘도경제보고서: [
        { header: '항목', accessor: 'rubro' },
        { header: '금액', accessor: 'valor' },
        { header: '합계', accessor: 'total' },
      ],
      현재및연체포트폴리오: [
        { header: '유닛', accessor: 'unidad' },
        { header: '비용', accessor: 'valorExpensa' },
        { header: '총할부금', accessor: 'totalCuotas' },
        { header: '납부', accessor: 'abonado' },
        { header: '할인', accessor: 'descuentos' },
        { header: '잔액', accessor: 'saldo' },
        { header: '현재', accessor: 'corriente' },
        { header: '30일', accessor: 'dias30' },
        { header: '%', accessor: 'pct30' },
        { header: '60일', accessor: 'dias60' },
        { header: '%', accessor: 'pct60' },
        { header: '90일', accessor: 'dias90' },
        { header: '%', accessor: 'pct90' },
        { header: '>90일', accessor: 'mas90' },
        { header: '%', accessor: 'pctMas90' },
        { header: '총연체금액', accessor: 'totalVencido' },
      ],
    }),
    [],
  );

  const handleDownloadAll = () => {
    const rows = rowsMap[active] || [];
    const columns = columnsMap[active] || [];
    const filename = `${active.replace(/\s+/g, '_')}.csv`;
    downloadCSV(rows, filename, columns);
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">{active} »</h1>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <SelectInput>
            <option>콘도 선택…</option>
          </SelectInput>
          <button
            type="button"
            onClick={handleDownloadAll}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            <DownloadIcon /> 전체 다운로드
          </button>
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200">
        <TabNav tabs={tabs} activeKey={active} onChange={setActive} ariaLabel="보고서 탭" />
      </div>

      <div id={`panel-${slug(active)}`} role="tabpanel" aria-labelledby={`tab-${slug(active)}`} tabIndex={0}>
        <Component />
      </div>
    </div>
  );
}

