import http from './http';

// Mock datasets as fallback when API is not available
const mock = {
  unitAccountStatement: [
    { tipo: 'Cuenta por Cobrar', rubro: 'Expensa Mensual', fecha: '2025-08-01', vencimiento: '2025-09-10', nroRecibo: '', detalle: 'Expensa Agosto 2025', valor: 'Bs348,00', descuento: '', saldo: 'Bs348,00' },
    { tipo: 'Cuenta por Cobrar', rubro: 'Consumo de Agua', fecha: '2025-08-28', vencimiento: '2025-09-10', nroRecibo: '', detalle: 'Agua Julio - Agosto 2025', valor: 'Bs44,77', descuento: '', saldo: 'Bs392,77' },
    { tipo: 'Cuenta por Cobrar', rubro: 'Expensa Mensual', fecha: '2025-09-05', vencimiento: '2025-10-10', nroRecibo: '', detalle: 'Expensa Septiembre 2025', valor: 'Bs348,00', descuento: '', saldo: 'Bs740,77' },
    { tipo: '', rubro: '', fecha: '', vencimiento: '', nroRecibo: '', detalle: 'VALOR FINAL POR PAGAR', valor: 'Bs0,00', descuento: '', saldo: 'Bs740,77' },
  ],
  historicalPortfolio: [
    { unidad: 'Apartamento B1 - 1A', representante: 'Johnny Federico Pinto Pabon', porVencer: 'Bs696,00', dias30: 'Bs0,00', dias60: 'Bs0,00', dias90: 'Bs0,00', dias120: 'Bs0,00', mas120: 'Bs0,00', total: 'Bs696,00' },
    { unidad: 'Apartamento B1 - 1B', representante: 'Rafael Alejandro Gomez Rodriguez', porVencer: 'Bs741,99', dias30: 'Bs381,67', dias60: 'Bs0,00', dias90: 'Bs385,01', dias120: 'Bs391,93', mas120: 'Bs6.772,32', total: 'Bs8.272,92' },
    { unidad: 'Apartamento B1 - 2A', representante: 'Greg Mercado', porVencer: 'Bs701,37', dias30: 'Bs356,11', dias60: 'Bs0,00', dias90: 'Bs357,49', dias120: 'Bs8,16', mas120: 'Bs0,00', total: 'Bs1.423,13' },
    { unidad: 'Apartamento B1 - 2B', representante: 'Marcelo Saavedra', porVencer: 'Bs765,60', dias30: 'Bs0,00', dias60: 'Bs0,00', dias90: 'Bs0,00', dias120: 'Bs0,00', mas120: 'Bs0,00', total: 'Bs765,60' },
    { unidad: 'Apartamento B1 - 3A', representante: 'Roberto Gonzales', porVencer: 'Bs697,35', dias30: 'Bs348,00', dias60: 'Bs0,00', dias90: 'Bs0,00', dias120: 'Bs0,00', mas120: 'Bs0,00', total: 'Bs1.045,35' },
  ],
  accumulatedPortfolio: [
    { unidad: 'Apartamento B0 - 1', valorExpensa: 'Bs696,00', identificacion: '1600-B0-1', representante: 'Sunset Group SRL', correo: '', celular: '74260215', diasVencidos: 211, total: 'Bs6.264,00' },
    { unidad: 'Apartamento B10 - 1A', valorExpensa: 'Bs348,00', identificacion: '4894649', representante: 'Karen Susana Dipp Saal', correo: '', celular: '77200001', diasVencidos: -1, total: 'Bs740,77' },
    { unidad: 'Apartamento B10 - 1B', valorExpensa: 'Bs382,80', identificacion: '1600-B10-1B', representante: 'Lourdes Ximena Ajata Soto', correo: 'ga_basi@hotmail.com', celular: '068146169', diasVencidos: 61, total: 'Bs1.578,00' },
    { unidad: 'Apartamento B10 - 2A', valorExpensa: 'Bs348,00', identificacion: '6855310', representante: 'Erick Rolando Daniel Limachi Cadima', correo: '', celular: '76255537', diasVencidos: 206, total: 'Bs1.503,45' },
    { unidad: 'Apartamento B10 - 2B', valorExpensa: 'Bs348,00', identificacion: '2621930', representante: 'Maria Gabriela Siles Cangas', correo: 'ga_basi@hotmail.com', celular: '068146169', diasVencidos: 30, total: 'Bs1.144,00' },
  ],
};

export async function getUnitAccountStatement(params = {}) {
  try {
    const res = await http.get('/reports/finance/unit-account-statement', { params });
    return res.data;
  } catch (_) {
    return mock.unitAccountStatement;
  }
}

export async function getHistoricalPortfolio(params = {}) {
  try {
    const res = await http.get('/reports/finance/historical-portfolio', { params });
    return res.data;
  } catch (_) {
    return mock.historicalPortfolio;
  }
}

export async function getAccumulatedPortfolio(params = {}) {
  try {
    const res = await http.get('/reports/finance/accumulated-portfolio', { params });
    return res.data;
  } catch (_) {
    return mock.accumulatedPortfolio;
  }
}

