// ============================================================
// OminiSis Enterprise — Mock Data
// ============================================================

const DATA = {
  // Company info
  company: { name: 'Acme Corporation', plan: 'Enterprise', users: 248, modules: 18 },

  // KPIs
  kpis: {
    revenue: { value: 4820000, prev: 4100000, label: 'Faturamento Mensal', format: 'currency' },
    orders: { value: 1847, prev: 1520, label: 'Pedidos no Mês', format: 'number' },
    margin: { value: 34.7, prev: 31.2, label: 'Margem Bruta %', format: 'percent' },
    nps: { value: 72, prev: 68, label: 'NPS', format: 'number' },
    leads: { value: 342, prev: 280, label: 'Leads Ativos', format: 'number' },
    cashflow: { value: 1240000, prev: 980000, label: 'Saldo em Caixa', format: 'currency' },
    receivable: { value: 2180000, prev: 1900000, label: 'A Receber 30d', format: 'currency' },
    payable: { value: 940000, prev: 820000, label: 'A Pagar 30d', format: 'currency' },
    stock_value: { value: 6840000, prev: 6200000, label: 'Valor em Estoque', format: 'currency' },
    employees: { value: 248, prev: 231, label: 'Funcionários Ativos', format: 'number' },
    oee: { value: 87.4, prev: 84.1, label: 'OEE Produção', format: 'percent' },
    overdue: { value: 185000, prev: 220000, label: 'Inadimplência', format: 'currency' },
  },

  // Revenue by month
  revenueChart: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    data: [3200000, 3800000, 3600000, 4100000, 4300000, 4820000, 5100000, 4800000, 5200000, 5500000, 5800000, 6200000],
    target: [3500000, 3700000, 3900000, 4200000, 4500000, 4700000, 5000000, 5000000, 5200000, 5400000, 5600000, 6000000],
  },

  // Cashflow last 6 months
  cashflow: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    inflow: [2800000, 3200000, 3100000, 3600000, 3800000, 4200000],
    outflow: [2200000, 2600000, 2400000, 2900000, 3100000, 2960000],
  },

  // Revenue by segment (donut)
  revenueBySegment: [
    { label: 'Vendas B2B', value: 2890000, color: '#6366f1' },
    { label: 'Vendas B2C', value: 980000, color: '#8b5cf6' },
    { label: 'Serviços', value: 620000, color: '#06b6d4' },
    { label: 'Recorrente', value: 330000, color: '#10b981' },
  ],

  // CRM Pipeline
  pipeline: [
    {
      id: 'lead', title: 'Lead', color: '#5a5a72',
      deals: [
        { id: 1, title: 'Software ERP', company: 'Tech Solutions Ltda', value: 180000, prob: 15, owner: 'JS', days: 12, contact: { name: 'José', phone: '+55 17 11112-222', email: 'jose@novolead.com', address: 'Praça da rua ABC, Recife, Brasil' }, activities: [{ id: 1, type: 'system', date: new Date().toISOString(), text: 'Negócio criado' }] },
        { id: 2, title: 'Consultoria SAP', company: 'Global Corp', value: 250000, prob: 20, owner: 'MR', days: 5, contact: { name: 'Maria', phone: '+55 11 9999-8888', email: 'maria@global.com' }, activities: [] },
        { id: 3, title: 'Implantação CRM', company: 'Nexus Brasil', value: 90000, prob: 10, owner: 'AP', days: 1, contact: { name: 'João', phone: '+55 21 8888-7777', email: 'joao@nexus.com' }, activities: [] },
      ]
    },
    {
      id: 'qualified', title: 'Qualificado', color: '#3b82f6',
      deals: [
        { id: 4, title: 'Sistema BI', company: 'Data Insights', value: 420000, prob: 40, owner: 'JS', days: 8 },
        { id: 5, title: 'Integração Bancária', company: 'FinTech SA', value: 160000, prob: 35, owner: 'CF', days: 15 },
      ]
    },
    {
      id: 'proposal', title: 'Proposta', color: '#f59e0b',
      deals: [
        { id: 6, title: 'ERP + CRM Full', company: 'Indústria Alpha', value: 840000, prob: 65, owner: 'MR', days: 22 },
        { id: 7, title: 'HR Module', company: 'People Corp', value: 120000, prob: 70, owner: 'JS', days: 7 },
        { id: 8, title: 'Workflow Engine', company: 'Process Tech', value: 280000, prob: 60, owner: 'AP', days: 3 },
      ]
    },
    {
      id: 'negotiation', title: 'Negociação', color: '#8b5cf6',
      deals: [
        { id: 9, title: 'Enterprise Suite', company: 'MegaCorp Int.', value: 1200000, prob: 80, owner: 'CF', days: 30 },
        { id: 10, title: 'Produção + MRP', company: 'Fábrica ABC', value: 380000, prob: 85, owner: 'MR', days: 14 },
      ]
    },
    {
      id: 'won', title: 'Fechado ✓', color: '#10b981',
      deals: [
        { id: 11, title: 'Full ERP License', company: 'Beta Corp', value: 560000, prob: 100, owner: 'JS', days: 45 },
        { id: 12, title: 'Cloud Migration', company: 'Cloud Nine', value: 320000, prob: 100, owner: 'AP', days: 20 },
      ]
    },
  ],

  // Sales orders
  orders: [
    { id: 'PED-4521', client: 'Alpha Indústrias', value: 184200, status: 'approved', date: '27/06/2026', items: 12, seller: 'João S.' },
    { id: 'PED-4520', client: 'Beta Corp Ltda', value: 67800, status: 'pending', date: '27/06/2026', items: 5, seller: 'Maria R.' },
    { id: 'PED-4519', client: 'Gamma Tech SA', value: 291000, status: 'invoiced', date: '26/06/2026', items: 18, seller: 'Carlos F.' },
    { id: 'PED-4518', client: 'Delta Comércio', value: 43500, status: 'shipped', date: '26/06/2026', items: 8, seller: 'Ana P.' },
    { id: 'PED-4517', client: 'Epsilon Digital', value: 128000, status: 'approved', date: '25/06/2026', items: 14, seller: 'João S.' },
    { id: 'PED-4516', client: 'Zeta Soluções', value: 95400, status: 'draft', date: '25/06/2026', items: 7, seller: 'Maria R.' },
    { id: 'PED-4515', client: 'Eta Global', value: 540000, status: 'invoiced', date: '24/06/2026', items: 32, seller: 'Carlos F.' },
    { id: 'PED-4514', client: 'Theta Imports', value: 22300, status: 'cancelled', date: '24/06/2026', items: 3, seller: 'Ana P.' },
  ],

  // Inventory
  products: [
    { code: 'PRD-001', name: 'Parafuso M8x30 Inox', category: 'Fixadores', stock: 12500, min: 5000, unit: 'UN', value: 0.85, location: 'A-01-01', status: 'ok' },
    { code: 'PRD-002', name: 'Motor Elétrico 7,5cv', category: 'Componentes', stock: 45, min: 20, unit: 'UN', value: 2840, location: 'B-03-12', status: 'ok' },
    { code: 'PRD-003', name: 'Chapa Aço 2mm 1250x2500', category: 'Matéria Prima', stock: 8, min: 50, unit: 'PC', value: 680, location: 'C-01-01', status: 'critical' },
    { code: 'PRD-004', name: 'Óleo Lubrificante ISO 46', category: 'Insumos', stock: 120, min: 80, unit: 'LT', value: 18.5, location: 'D-02-05', status: 'low' },
    { code: 'PRD-005', name: 'Rolamento 6205 SKF', category: 'Componentes', stock: 380, min: 100, unit: 'UN', value: 42, location: 'B-02-08', status: 'ok' },
    { code: 'PRD-006', name: 'Cabo PP 3x2,5mm 750V', category: 'Elétrico', stock: 1200, min: 500, unit: 'M', value: 8.90, location: 'E-01-03', status: 'ok' },
    { code: 'PRD-007', name: 'Válvula Solenóide 1/2"', category: 'Pneumática', stock: 22, min: 30, unit: 'UN', value: 185, location: 'B-04-01', status: 'low' },
    { code: 'PRD-008', name: 'Sensor Indutivo M18', category: 'Automação', stock: 56, min: 25, unit: 'UN', value: 124, location: 'E-02-04', status: 'ok' },
  ],

  // Accounts payable / receivable
  financials: {
    receivable: [
      { doc: 'NF-12841', client: 'Alpha Indústrias', value: 184200, due: '05/07/2026', status: 'open', days: 8 },
      { doc: 'NF-12835', client: 'Beta Corp', value: 67800, due: '01/07/2026', status: 'open', days: 4 },
      { doc: 'NF-12820', client: 'Gamma Tech', value: 291000, due: '28/06/2026', status: 'overdue', days: -1 },
      { doc: 'NF-12815', client: 'Delta Comércio', value: 43500, due: '25/06/2026', status: 'overdue', days: -4 },
      { doc: 'NF-12800', client: 'Epsilon Digital', value: 128000, due: '10/07/2026', status: 'open', days: 13 },
    ],
    payable: [
      { doc: 'NF-F-8421', supplier: 'Steel & Iron Ltda', value: 42800, due: '04/07/2026', status: 'open', category: 'MP' },
      { doc: 'NF-F-8419', supplier: 'Energia S.A.', value: 18400, due: '02/07/2026', status: 'open', category: 'Utilidades' },
      { doc: 'NF-F-8415', supplier: 'Logística Express', value: 9800, due: '29/06/2026', status: 'scheduled', category: 'Frete' },
      { doc: 'NF-F-8410', supplier: 'Components Tech', value: 76500, due: '15/07/2026', status: 'open', category: 'Componentes' },
    ],
  },

  // Employees
  employees: [
    { id: 'F-001', name: 'Ana Carvalho', role: 'Diretora de TI', dept: 'TI', salary: 18500, status: 'active', since: '2019', initials: 'AC', color: '#6366f1' },
    { id: 'F-002', name: 'Bruno Mendes', role: 'Analista Financeiro', dept: 'Financeiro', salary: 8200, status: 'active', since: '2021', initials: 'BM', color: '#10b981' },
    { id: 'F-003', name: 'Carlos Ferreira', role: 'Gerente Comercial', dept: 'Vendas', salary: 14000, status: 'active', since: '2018', initials: 'CF', color: '#f59e0b' },
    { id: 'F-004', name: 'Diana Souza', role: 'Engenheira de Produção', dept: 'Produção', salary: 11500, status: 'active', since: '2020', initials: 'DS', color: '#8b5cf6' },
    { id: 'F-005', name: 'Eduardo Lima', role: 'Supervisor de Qualidade', dept: 'Qualidade', salary: 9800, status: 'active', since: '2022', initials: 'EL', color: '#06b6d4' },
    { id: 'F-006', name: 'Fernanda Costa', role: 'Analista de RH', dept: 'RH', salary: 7400, status: 'active', since: '2023', initials: 'FC', color: '#ef4444' },
    { id: 'F-007', name: 'Gabriel Oliveira', role: 'Desenvolvedor Sr.', dept: 'TI', salary: 12800, status: 'vacation', since: '2020', initials: 'GO', color: '#6366f1' },
    { id: 'F-008', name: 'Helena Martins', role: 'Gestora de Compras', dept: 'Compras', salary: 10200, status: 'active', since: '2021', initials: 'HM', color: '#10b981' },
  ],

  // Factory Sectors (Setores Fabris)
  sectors: [
    { id: 'SEC-USI', name: 'Usinagem e Corte', manager: 'Carlos H.', color: '#3b82f6' },
    { id: 'SEC-MON', name: 'Montagem e Testes', manager: 'Diana S.', color: '#10b981' },
    { id: 'SEC-EMB', name: 'Embalagem e Kitting', manager: 'Pedro M.', color: '#8b5cf6' }
  ],

  // Machines / Production (Centros de Trabalho)
  machines: [
    { id: 'CNC-01', name: 'CNC Romi Centur 30D', type: 'CNC', sectorId: 'SEC-USI', oee: 91.2, status: 'running', order: 'OP-2841', operator: 'José A.', maintenance: '15/07/2026', costHM: 120, costHH: 45, operators: 1 },
    { id: 'CNC-02', name: 'CNC Mazak 650L', type: 'CNC', sectorId: 'SEC-USI', oee: 88.4, status: 'running', order: 'OP-2842', operator: 'Marcos P.', maintenance: '20/07/2026', costHM: 150, costHH: 45, operators: 1 },
    { id: 'CNC-03', name: 'CNC Okuma MU-6300', type: 'CNC', sectorId: 'SEC-USI', oee: 76.8, status: 'maintenance', order: null, operator: 'Pedro S.', maintenance: '28/06/2026', costHM: 180, costHH: 45, operators: 1 },
    { id: 'INJ-01', name: 'Injetora Engel 350T', type: 'Injetora', sectorId: 'SEC-USI', oee: 94.1, status: 'running', order: 'OP-2845', operator: 'Ana M.', maintenance: '10/08/2026', costHM: 90, costHH: 35, operators: 2 },
    { id: 'PRE-01', name: 'Prensa Schuler 200T', type: 'Prensa', sectorId: 'SEC-USI', oee: 82.3, status: 'setup', order: 'OP-2847', operator: 'Carlos H.', maintenance: '05/08/2026', costHM: 110, costHH: 40, operators: 1 },
    { id: 'ROB-01', name: 'Robô FANUC M-20iA', type: 'Robô', sectorId: 'SEC-MON', oee: 97.4, status: 'running', order: 'OP-2843', operator: 'Auto', maintenance: '01/09/2026', costHM: 60, costHH: 0, operators: 0 },
    { id: 'LAS-01', name: 'Máquina de Corte Laser', type: 'Laser', sectorId: 'SEC-USI', oee: 89.5, status: 'idle', order: null, operator: 'Fernanda L.', maintenance: '12/10/2026', costHM: 210, costHH: 50, operators: 1 },
    { id: 'MON-02', name: 'Bancada de Montagem 02', type: 'Montagem', sectorId: 'SEC-MON', oee: 85.0, status: 'idle', order: null, operator: 'Equipe B', maintenance: '-', costHM: 15, costHH: 40, operators: 3 }
  ],

  // Projects
  projects: [
    { id: 'PRJ-001', name: 'Implantação ERP Módulo Produção', manager: 'Diana S.', start: '01/03/2026', end: '30/09/2026', progress: 68, status: 'on_track', budget: 420000, spent: 285600, tasks: 142, done: 96 },
    { id: 'PRJ-002', name: 'Migração Infrastructure AWS', manager: 'Ana C.', start: '15/04/2026', end: '15/08/2026', progress: 45, status: 'at_risk', budget: 180000, spent: 81000, tasks: 84, done: 38 },
    { id: 'PRJ-003', name: 'Portal do Cliente 2.0', manager: 'Carlos F.', start: '01/05/2026', end: '31/10/2026', progress: 30, status: 'on_track', budget: 95000, spent: 28500, tasks: 56, done: 17 },
    { id: 'PRJ-004', name: 'Integração Open Banking', manager: 'Bruno M.', start: '01/06/2026', end: '30/11/2026', progress: 12, status: 'on_track', budget: 220000, spent: 26400, tasks: 98, done: 12 },
  ],

  // OKRs
  okrs: [
    {
      objective: 'Dobrar a receita recorrente em 2026',
      owner: 'Carlos Ferreira · Comercial',
      progress: 68,
      status: 'on_track',
      quarter: 'Q2 2026',
      krs: [
        { label: 'Atingir 200 contratos SaaS', current: 136, target: 200, unit: '' },
        { label: 'ARR de R$ 8M', current: 5.4, target: 8, unit: 'M' },
        { label: 'Churn < 3%', current: 4.2, target: 3, unit: '%', inverted: true },
      ]
    },
    {
      objective: 'Excelência operacional com OEE ≥ 92%',
      owner: 'Diana Souza · Produção',
      progress: 82,
      status: 'on_track',
      quarter: 'Q2 2026',
      krs: [
        { label: 'OEE Global', current: 87.4, target: 92, unit: '%' },
        { label: 'Refugo < 0.5%', current: 0.8, target: 0.5, unit: '%', inverted: true },
        { label: '100% preventivas no prazo', current: 87, target: 100, unit: '%' },
      ]
    },
    {
      objective: 'Lançar novo produto em 3 mercados',
      owner: 'Ana Carvalho · Estratégia',
      progress: 33,
      status: 'at_risk',
      quarter: 'Q2 2026',
      krs: [
        { label: 'Lançamentos realizados', current: 1, target: 3, unit: '' },
        { label: 'Pipeline gerado R$M', current: 1.2, target: 5, unit: 'M' },
      ]
    },
  ],

  // Integrations
  integrations: [
    { name: 'WhatsApp Business', logo: '💬', category: 'Comunicação', status: 'connected', calls: 1284 },
    { name: 'Mercado Livre', logo: '🛒', category: 'Marketplace', status: 'connected', calls: 8420 },
    { name: 'Amazon Seller', logo: '📦', category: 'Marketplace', status: 'connected', calls: 3241 },
    { name: 'Correios', logo: '📮', category: 'Transportadora', status: 'connected', calls: 2140 },
    { name: 'Banco do Brasil', logo: '🏦', category: 'Banking', status: 'connected', calls: 540 },
    { name: 'NFe/NFSe SEFAZ', logo: '🧾', category: 'Fiscal', status: 'connected', calls: 4820 },
    { name: 'Salesforce', logo: '☁️', category: 'CRM', status: 'disconnected', calls: 0 },
    { name: 'SAP S/4HANA', logo: '⚙️', category: 'ERP', status: 'disconnected', calls: 0 },
    { name: 'Stripe', logo: '💳', category: 'Pagamentos', status: 'connected', calls: 2840 },
    { name: 'Google Workspace', logo: '📧', category: 'Produtividade', status: 'connected', calls: 12480 },
    { name: 'Power BI', logo: '📊', category: 'BI', status: 'disconnected', calls: 0 },
    { name: 'Zendesk', logo: '🎫', category: 'Suporte', status: 'disconnected', calls: 0 },
  ],

  // Tenants (for Admin Console)
  tenants: [
    { id: 'T-001', name: 'Acme Corporation', initials: 'AC', plan: 'Enterprise', users: 248, modules: ['ERP', 'CRM', 'BI', 'RH', 'Workflow', 'IA'], status: 'active', mrr: 18500, since: 'Mar 2023', color: '#6366f1' },
    { id: 'T-002', name: 'Beta Technologies', initials: 'BT', plan: 'Professional', users: 84, modules: ['ERP', 'CRM', 'Financeiro'], status: 'active', mrr: 7200, since: 'Jun 2023', color: '#10b981' },
    { id: 'T-003', name: 'Gamma Indústrias', initials: 'GI', plan: 'Enterprise', users: 312, modules: ['ERP', 'Produção', 'Qualidade', 'BI', 'RH', 'Manutenção', 'MRP', 'IA'], status: 'active', mrr: 22400, since: 'Jan 2022', color: '#f59e0b' },
    { id: 'T-004', name: 'Delta Comércio', initials: 'DC', plan: 'Starter', users: 18, modules: ['ERP', 'Vendas'], status: 'active', mrr: 1800, since: 'Dez 2024', color: '#8b5cf6' },
    { id: 'T-005', name: 'Epsilon Digital', initials: 'ED', plan: 'Professional', users: 45, modules: ['ERP', 'CRM', 'BI', 'Workflow'], status: 'trial', mrr: 0, since: 'Jun 2026', color: '#06b6d4' },
    { id: 'T-006', name: 'Zeta Logistics', initials: 'ZL', plan: 'Professional', users: 67, modules: ['ERP', 'Estoque', 'Compras', 'Financeiro'], status: 'inactive', mrr: 5400, since: 'Ago 2022', color: '#ef4444' },
  ],

  // Master Data
  customers: [
    { id: 'C-001', name: 'TechBR Ltda', document: '12.345.678/0001-99', email: 'contato@techbr.com', commercialCondition: 'Tabela Padrão', defaultDiscount: 0, status: 'active' },
    { id: 'C-002', name: 'Minas Comercial', document: '98.765.432/0001-11', email: 'compras@minas.com', commercialCondition: 'Contrato A', defaultDiscount: 10, status: 'active' },
    { id: 'C-003', name: 'Grupo Alfa', document: '11.222.333/0001-44', email: 'alfa@grupoalfa.com', commercialCondition: 'Tabela Padrão', defaultDiscount: 0, status: 'active' },
    { id: 'C-003', name: 'Grupo Alfa', document: '11.222.333/0001-44', email: 'alfa@grupoalfa.com', commercialCondition: 'Tabela Padrão', defaultDiscount: 0, status: 'active' },
  ],
  suppliers: [
    { id: 'F-001', name: 'Aço Forte S/A', document: '44.555.666/0001-77', email: 'vendas@acoforte.com', status: 'active' },
    { id: 'F-002', name: 'Eletromotores WEG', document: '99.888.777/0001-22', email: 'b2b@weg.com', status: 'active' }
  ],
  productHierarchies: [
    { id: 'H-01', name: 'Matéria-Prima Básica', commission: 1 },
    { id: 'H-02', name: 'Componentes e Peças', commission: 2 },
    { id: 'H-03', name: 'Produtos Acabados', commission: 5 },
    { id: 'H-04', name: 'Kits Comerciais', commission: 8 },
    { id: 'H-05', name: 'Software / Serviços', commission: 15 },
  ],
  masterProducts: [
    // Matérias Primas
    { id: 'MP-001', sku: 'ACO-CHAPA-10', name: 'Chapa de Aço 10mm', type: 'ROH', hierarchy: 'H-01', basePrice: 150, unit: 'KG', suppliers: ['F-001'], stock: 1450, minStock: 2000, location: 'A-01-01' },
    { id: 'MP-002', sku: 'PLAST-ABS-01', name: 'Resina ABS', type: 'ROH', hierarchy: 'H-01', basePrice: 45, unit: 'KG', suppliers: ['F-002'], stock: 3200, minStock: 1000, location: 'B-02-05' },
    // Componentes
    { id: 'CP-001', sku: 'MOT-ELET-2CV', name: 'Motor Elétrico 2CV', type: 'HALB', hierarchy: 'H-02', basePrice: 850, unit: 'UN', suppliers: ['F-001', 'F-002'], stock: 45, minStock: 20, location: 'C-04-12' },
    { id: 'CP-002', sku: 'PLACA-CTRL-V2', name: 'Placa Controladora V2', type: 'HALB', hierarchy: 'H-02', basePrice: 320, unit: 'UN', suppliers: [], stock: 12, minStock: 50, location: 'D-01-02' },
    // Produtos Acabados (BOM)
    { id: 'PA-001', sku: 'BOMB-AGUA-PRO', name: "Bomba d'Água PRO", type: 'FERT', hierarchy: 'H-03', basePrice: 2400, unit: 'UN', stock: 8, minStock: 15, location: 'E-12-01',
      bom: [{ itemSku: 'MOT-ELET-2CV', qty: 1 }, { itemSku: 'ACO-CHAPA-10', qty: 2.5 }],
      routing: [
        { phase: '0010', name: 'Corte de Chapa', machineId: 'LAS-01', setupTime: 15, prodTime: 5, humanTime: 2 },
        { phase: '0020', name: 'Dobra', machineId: 'PRE-01', setupTime: 10, prodTime: 3, humanTime: 1 },
        { phase: '0030', name: 'Montagem Final', machineId: 'MON-02', setupTime: 5, prodTime: 0, humanTime: 15 }
      ]
    },
    { id: 'PA-002', sku: 'MAQ-CORTE-LASER', name: 'Máquina de Corte Laser CNC', type: 'FERT', hierarchy: 'H-03', basePrice: 45000, unit: 'UN', stock: 2, minStock: 2, location: 'E-15-05',
      bom: [{ itemSku: 'PLACA-CTRL-V2', qty: 1 }, { itemSku: 'ACO-CHAPA-10', qty: 120 }, { itemSku: 'MOT-ELET-2CV', qty: 3 }],
      routing: [
        { phase: '0010', name: 'Usinagem Estrutura', machineId: 'CNC-01', setupTime: 120, prodTime: 240, humanTime: 60 },
        { phase: '0020', name: 'Montagem Elétrica', machineId: 'MON-02', setupTime: 30, prodTime: 0, humanTime: 180 },
        { phase: '0030', name: 'Testes de Qualidade', machineId: 'MON-02', setupTime: 15, prodTime: 0, humanTime: 60 }
      ]
    },
    // Kits
    { id: 'KT-001', sku: 'KIT-BOMBA-MANUT', name: 'Kit Manutenção Bomba', type: 'KIT', hierarchy: 'H-04', basePrice: 1200, unit: 'CJ', stock: 120, minStock: 50, location: 'F-01-10',
      bom: [{ itemSku: 'MOT-ELET-2CV', qty: 1 }, { itemSku: 'PLAST-ABS-01', qty: 0.5 }],
      routing: [
        { phase: '0010', name: 'Kitting / Separação', machineId: 'MON-02', setupTime: 5, prodTime: 0, humanTime: 10 }
      ]
    },
  ],

  // Sales
  salesOrders: [
    { id: 'PV-2024-001', client: 'TechBR Ltda', value: 45800, status: 'approved', date: '2024-06-01', seller: 'Lucas M.', items: 8, detailItems: [{ sku: 'BOMB-AGUA-PRO', qty: 25 }] },
    { id: 'PV-2024-002', client: 'Minas Comercial', value: 128500, status: 'pending', date: '2024-06-05', seller: 'Ana S.', items: 15, detailItems: [{ sku: 'MAQ-CORTE-LASER', qty: 3 }, { sku: 'BOMB-AGUA-PRO', qty: 40 }] },
    { id: 'PV-2024-003', client: 'Grupo Alfa', value: 73200, status: 'invoiced', date: '2024-06-08', seller: 'Pedro R.', items: 6, detailItems: [{ sku: 'MAQ-CORTE-LASER', qty: 1 }] },
    { id: 'PV-2024-004', client: 'Sul Distribuidora', value: 32100, status: 'cancelled', date: '2024-06-10', seller: 'Lucas M.', items: 3, detailItems: [] },
    { id: 'PV-2024-005', client: 'Constru Max', value: 215000, status: 'approved', date: '2024-06-12', seller: 'Carla T.', items: 22, detailItems: [{ sku: 'BOMB-AGUA-PRO', qty: 120 }, { sku: 'KIT-BOMBA-MANUT', qty: 50 }] },
    { id: 'PV-2024-006', client: 'Agro Solutions', value: 89400, status: 'pending', date: '2024-06-15', seller: 'Ana S.', items: 9, detailItems: [{ sku: 'MAQ-CORTE-LASER', qty: 2 }] },
    { id: 'PV-2024-007', client: 'Med Equipamentos', value: 167800, status: 'invoiced', date: '2024-06-18', seller: 'Pedro R.', items: 18, detailItems: [{ sku: 'BOMB-AGUA-PRO', qty: 85 }] },
    { id: 'PV-2024-008', client: 'Logtech BR', value: 54300, status: 'approved', date: '2024-06-20', seller: 'Carla T.', items: 5, detailItems: [{ sku: 'KIT-BOMBA-MANUT', qty: 30 }] },
  ],
  quotations: [
    { id: 'ORC-2024-088', client: 'Nova Energia SA', value: 385000, validity: '2024-07-15', status: 'pending', seller: 'Lucas M.' },
    { id: 'ORC-2024-089', client: 'Pharma Dist.', value: 92000, validity: '2024-07-10', status: 'sent', seller: 'Ana S.' },
    { id: 'ORC-2024-090', client: 'Rio Comércio', value: 47500, validity: '2024-07-08', status: 'approved', seller: 'Pedro R.' },
    { id: 'ORC-2024-091', client: 'TechBR Ltda', value: 23800, validity: '2024-07-20', status: 'draft', seller: 'Carla T.' },
  ],
  sellers: [
    { name: 'Lucas M.', sales: 8, total: 420500, commission: 12615, target: 500000, pct: 84 },
    { name: 'Ana S.', sales: 12, total: 611200, commission: 18336, target: 600000, pct: 102 },
    { name: 'Pedro R.', sales: 9, total: 380700, commission: 11421, target: 450000, pct: 85 },
    { name: 'Carla T.', sales: 7, total: 298400, commission: 8952, target: 400000, pct: 75 },
  ],

  // Purchase orders
  purchases: [
    { id: 'OC-8421', supplier: 'Steel & Iron Ltda', value: 84500, status: 'approved', date: '27/06/2026', items: 8, requester: 'Helena M.' },
    { id: 'OC-8420', supplier: 'Eletrônica Sul', value: 32400, status: 'pending', date: '26/06/2026', items: 15, requester: 'Bruno M.' },
    { id: 'OC-8419', supplier: 'Químicos Brasil', value: 18200, status: 'received', date: '25/06/2026', items: 6, requester: 'Diana S.' },
    { id: 'OC-8418', supplier: 'Borrachas Tech', value: 9800, status: 'approved', date: '25/06/2026', items: 4, requester: 'Helena M.' },
    { id: 'OC-8417', supplier: 'Components Plus', value: 147000, status: 'in_transit', date: '24/06/2026', items: 22, requester: 'Eduardo L.' },
  ],

  // Production Orders (OPs)
  productionOrders: [
    { id: 'OP-2841', productId: 'PA-001', machineId: 'CNC-01', targetQty: 100, producedQty: 92, scrapQty: 2, status: 'running', startDate: '27/06/2026', endDate: '28/06/2026', yield: 92, reports: [{ date: '27/06/2026', time: '14:30', good: 50, scrap: 1, reason: 'Setup', user: 'Operador 1' }, { date: '28/06/2026', time: '09:15', good: 42, scrap: 1, reason: 'Material com Defeito', user: 'Operador 2' }] },
    { id: 'OP-2842', productId: 'PA-002', machineId: 'MON-02', targetQty: 20, producedQty: 18, scrapQty: 0, status: 'running', startDate: '26/06/2026', endDate: '27/06/2026', yield: 90, reports: [{ date: '26/06/2026', time: '16:00', good: 18, scrap: 0, reason: '', user: 'Operador 1' }] },
    { id: 'OP-2843', productId: 'KT-001', machineId: null, targetQty: 50, producedQty: 50, scrapQty: 0, status: 'completed', startDate: '25/06/2026', endDate: '25/06/2026', yield: 100, reports: [{ date: '25/06/2026', time: '10:00', good: 50, scrap: 0, reason: '', user: 'Operador 3' }] },
    { id: 'OP-2847', productId: 'PA-001', machineId: 'LAS-01', targetQty: 150, producedQty: 0, scrapQty: 0, status: 'setup', startDate: '27/06/2026', endDate: '30/06/2026', yield: 0, reports: [] },
    { id: 'OP-2848', productId: 'PA-002', machineId: null, targetQty: 80, producedQty: 0, scrapQty: 0, status: 'planned', startDate: '-', endDate: '-', yield: 0, reports: [] },
  ],

  // Activity feed
  activity: [
    { type: 'sale', title: 'Pedido PED-4521 aprovado', meta: 'Alpha Indústrias · R$ 184.200', time: '2m', icon: '🛒', color: '#10b981' },
    { type: 'finance', title: 'PIX recebido · R$ 291.000', meta: 'Gamma Tech SA · NF-12820', time: '18m', icon: '💰', color: '#6366f1' },
    { type: 'crm', title: 'Lead qualificado: MegaCorp Int.', meta: 'Atribuído a Carlos F.', time: '45m', icon: '👥', color: '#8b5cf6' },
    { type: 'production', title: 'Ordem OP-2841 iniciada', meta: 'CNC-01 · Previsto: 8h', time: '1h', icon: '⚙️', color: '#f59e0b' },
    { type: 'stock', title: 'Alerta: Chapa Aço abaixo do mínimo', meta: 'Estoque: 8 PC / Mínimo: 50 PC', time: '2h', icon: '📦', color: '#ef4444' },
    { type: 'hr', title: 'Gabriel Oliveira em férias', meta: '28/06 a 12/07 · Aprovado por Ana C.', time: '3h', icon: '🏖️', color: '#06b6d4' },
    { type: 'ai', title: 'IA detectou oportunidade de upsell', meta: 'Beta Corp · Histórico de compras analisado', time: '4h', icon: '🤖', color: '#a855f7' },
    { type: 'workflow', title: 'Aprovação de compra OC-8420 pendente', meta: 'Aguardando: Helena M.', time: '5h', icon: '✅', color: '#f59e0b' },
  ],

  // Accounting accounts
  accounts: [
    { code: '1.1.01', name: 'Caixa Geral', type: 'Ativo', balance: 48200, nature: 'D' },
    { code: '1.1.02', name: 'Banco do Brasil C/C', type: 'Ativo', balance: 842000, nature: 'D' },
    { code: '1.1.03', name: 'Clientes - Duplicatas', type: 'Ativo', balance: 2180000, nature: 'D' },
    { code: '1.2.01', name: 'Estoques', type: 'Ativo', balance: 6840000, nature: 'D' },
    { code: '2.1.01', name: 'Fornecedores', type: 'Passivo', balance: 940000, nature: 'C' },
    { code: '2.1.02', name: 'Salários a Pagar', type: 'Passivo', balance: 312000, nature: 'C' },
    { code: '2.1.03', name: 'Impostos a Recolher', type: 'Passivo', balance: 284000, nature: 'C' },
    { code: '3.1.01', name: 'Receita de Vendas', type: 'Resultado', balance: 4820000, nature: 'C' },
    { code: '4.1.01', name: 'CMV', type: 'Resultado', balance: 3142000, nature: 'D' },
    { code: '4.2.01', name: 'Despesas Operacionais', type: 'Resultado', balance: 820000, nature: 'D' },
  ],

  // Warehouses (Armazéns / Locais)
  warehouses: [
    { id: 'ARM-A', name: 'Almoxarifado Principal', type: 'Múltiplo', location: 'Prédio 1', status: 'active', usage: 78, capacity: 5000 },
    { id: 'ARM-B', name: 'Estoque de Acabados', type: 'Expedição', location: 'Prédio 2', status: 'active', usage: 45, capacity: 2000 },
    { id: 'ARM-C', name: 'Insumos Químicos', type: 'Controlado', location: 'Anexo Externo', status: 'active', usage: 92, capacity: 500 },
    { id: 'ARM-D', name: 'Peças de Reposição', type: 'Manutenção', location: 'Subsolo', status: 'active', usage: 30, capacity: 1000 }
  ],

  // Kardex / Inventory Movements
  inventoryMovements: [
    { id: 'MOV-1001', productId: 'MP-001', type: 'in', qty: 250, date: '04/07/2026', time: '14:32', user: 'Helena M.', reason: 'Recebimento OC-8419' },
    { id: 'MOV-1002', productId: 'MP-002', type: 'out', qty: 120, date: '05/07/2026', time: '09:15', user: 'Diana S.', reason: 'Requisição OP-2841' },
    { id: 'MOV-1003', productId: 'CP-001', type: 'in', qty: 10, date: '06/07/2026', time: '11:45', user: 'Helena M.', reason: 'Recebimento OC-8422' },
    { id: 'MOV-1004', productId: 'MP-001', type: 'out', qty: 50, date: '06/07/2026', time: '16:20', user: 'Diana S.', reason: 'Requisição OP-2845' }
  ],
};

// Utility: format currency
function formatCurrency(val) {
  if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}K`;
  return `R$ ${val.toFixed(2)}`;
}

function formatCurrencyFull(val) {
  return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function calcTrend(current, prev) {
  const pct = ((current - prev) / prev * 100).toFixed(1);
  const dir = current >= prev ? 'up' : 'down';
  return { pct, dir };
}

function getStatusBadge(status) {
  const map = {
    approved: ['badge-success', 'Aprovado'],
    pending: ['badge-warning', 'Pendente'],
    invoiced: ['badge-primary', 'Faturado'],
    shipped: ['badge-info', 'Enviado'],
    draft: ['badge-muted', 'Rascunho'],
    cancelled: ['badge-danger', 'Cancelado'],
    received: ['badge-success', 'Recebido'],
    in_transit: ['badge-info', 'Em Trânsito'],
    scheduled: ['badge-primary', 'Agendado'],
    open: ['badge-warning', 'Aberto'],
    overdue: ['badge-danger', 'Vencido'],
    ok: ['badge-success', 'OK'],
    low: ['badge-warning', 'Baixo'],
    critical: ['badge-danger', 'Crítico'],
    running: ['badge-success', 'Produzindo'],
    maintenance: ['badge-warning', 'Manutenção'],
    setup: ['badge-info', 'Setup'],
    active: ['badge-success', 'Ativo'],
    trial: ['badge-primary', 'Trial'],
    inactive: ['badge-danger', 'Inativo'],
    disconnected: ['badge-muted', 'Desconectado'],
    connected: ['badge-success', 'Conectado'],
    vacation: ['badge-info', 'Férias'],
    on_track: ['badge-success', 'No Prazo'],
    at_risk: ['badge-warning', 'Em Risco'],
    delayed: ['badge-danger', 'Atrasado'],
  };
  const [cls, label] = map[status] || ['badge-muted', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

// ============================================================
// Simulated Internal APIs (Mock Backend)
// ============================================================
window.API = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  async getDashboardData() {
    await this.delay(600); // simulate network latency
    return {
      company: DATA.company,
      kpis: DATA.kpis,
      revenueChart: DATA.revenueChart,
      cashflow: DATA.cashflow,
      revenueBySegment: DATA.revenueBySegment,
      activity: DATA.activity
    };
  },

  async getCRMData() {
    await this.delay(400);
    return DATA.pipeline;
  },

  async getFinancialData() {
    await this.delay(500);
    return {
      financials: DATA.financials,
      kpis: DATA.kpis,
      cashflow: DATA.cashflow
    };
  },

  async getInventoryData() {
    await this.delay(450);
    return {
      products: DATA.products,
      kpis: DATA.kpis
    };
  },

  async getMasterData() {
    await this.delay(300);
    return {
      customers: DATA.customers,
      suppliers: DATA.suppliers,
      products: DATA.masterProducts,
      hierarchies: DATA.productHierarchies
    };
  },

  async getSalesData() {
    await this.delay(500);
    return {
      orders: DATA.salesOrders,
      quotations: DATA.quotations,
      sellers: DATA.sellers,
      revenueChart: DATA.revenueChart
    };
  },

  async getPurchasesData() {
    await this.delay(400);
    // Uses the central suppliers list instead of the mock one
    return {
      purchases: DATA.purchases,
      requisitions: DATA.purchaseRequisitions || [],
      suppliers: DATA.suppliers
    };
  },

  async getProductionData() {
    await this.delay(450);
    return {
      productionOrders: DATA.productionOrders,
      machines: DATA.machines,
      products: DATA.masterProducts.filter(p => p.type === 'FERT' || p.type === 'HALB' || p.type === 'KIT')
    };
  },

  async createProductionOrder(productId, targetQty) {
    await this.delay(300);
    const prod = DATA.masterProducts.find(p => p.id === productId);
    if (!prod) return { success: false, error: 'Produto não encontrado' };

    const newOp = {
      id: `OP-${2800 + DATA.productionOrders.length + 1}`,
      productId: productId,
      machineId: null,
      targetQty: Number(targetQty),
      producedQty: 0,
      scrapQty: 0,
      status: 'planned',
      startDate: '-',
      endDate: '-',
      yield: 0,
      reports: []
    };
    DATA.productionOrders.unshift(newOp);
    return { success: true, op: newOp };
  },

  async releaseProductionOrder(opId) {
    await this.delay(300);
    const op = DATA.productionOrders.find(o => o.id === opId);
    if (!op) return { success: false, error: 'OP não encontrada' };
    
    op.status = 'released';
    return { success: true };
  },

  async startProductionOrder(opId, machineId) {
    await this.delay(300);
    const op = DATA.productionOrders.find(o => o.id === opId);
    if (!op) return { success: false, error: 'OP não encontrada' };
    
    op.status = 'running';
    op.machineId = machineId;
    op.startDate = new Date().toLocaleDateString('pt-BR');

    if (machineId) {
      const machine = DATA.machines.find(m => m.id === machineId);
      if (machine) {
        machine.status = 'running';
        machine.order = opId;
      }
    }
    return { success: true };
  },

  async reportProduction(opId, qty, isScrap = false, reason = '') {
    await this.delay(300);
    const op = DATA.productionOrders.find(o => o.id === opId);
    if (!op) return { success: false, error: 'OP não encontrada' };
    
    if (isScrap) {
      op.scrapQty += Number(qty);
    } else {
      op.producedQty += Number(qty);
    }
    
    op.reports = op.reports || [];
    op.reports.push({
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      good: isScrap ? 0 : Number(qty),
      scrap: isScrap ? Number(qty) : 0,
      reason: reason,
      user: 'João Doe' // Default user
    });

    const total = op.producedQty + op.scrapQty;
    op.yield = total > 0 ? Math.round((op.producedQty / total) * 100) : 0;
    
    return { success: true };
  },

  async finishProductionOrder(opId) {
    await this.delay(400);
    const op = DATA.productionOrders.find(o => o.id === opId);
    if (!op) return { success: false, error: 'OP não encontrada' };
    
    op.status = 'completed';
    op.endDate = new Date().toLocaleDateString('pt-BR');

    // Libera a máquina
    if (op.machineId) {
      const machine = DATA.machines.find(m => m.id === op.machineId);
      if (machine) {
        machine.status = 'idle';
        machine.order = null;
      }
    }

    // Baixa de estoque (Backflush)
    const prod = DATA.masterProducts.find(p => p.id === op.productId);
    if (prod) {
      // Entrada do Produto Acabado
      this.addStockMovement(prod.id, 'in', op.producedQty, `Entrada Produção OP ${opId}`);
      
      // Saída dos Componentes (BOM)
      if (prod.bom && Array.isArray(prod.bom)) {
        for (const item of prod.bom) {
          const qtyToConsume = item.qty * op.producedQty;
          this.addStockMovement(item.itemSku, 'out', qtyToConsume, `Consumo Produção OP ${opId}`);
        }
      }
    }

    DATA.activity.unshift({
      type: 'production',
      title: `Ordem ${opId} concluída`,
      meta: `Produto ${prod?.sku} · ${op.producedQty} UN produzidas`,
      time: 'Agora',
      icon: '⚙️',
      color: '#10b981'
    });

    return { success: true };
  },

  async addCustomer(customerData) {
    await this.delay(300);
    const newCustomer = {
      id: `C-${(DATA.customers.length + 1).toString().padStart(3, '0')}`,
      ...customerData,
      status: 'active'
    };
    DATA.customers.push(newCustomer);
    return newCustomer;
  },

  async addSupplier(supplierData) {
    await this.delay(300);
    const newSupplier = {
      id: `F-${(DATA.suppliers.length + 1).toString().padStart(3, '0')}`,
      ...supplierData,
      status: 'active'
    };
    DATA.suppliers.push(newSupplier);
    return newSupplier;
  },

  async addProduct(productData) {
    await this.delay(300);
    const prefix = productData.type === 'ROH' ? 'MP' : productData.type === 'HALB' ? 'CP' : productData.type === 'KIT' ? 'KT' : 'PA';
    const newProduct = {
      id: `${prefix}-${(DATA.masterProducts.length + 1).toString().padStart(3, '0')}`,
      ...productData
    };
    DATA.masterProducts.push(newProduct);
    return newProduct;
  },

  async addOrder(orderData) {
    await this.delay(600);
    const newOrder = {
      id: `PV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      client: orderData.client,
      value: Number(orderData.value) || 0,
      status: orderData.status || 'pending',
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      seller: orderData.seller,
      items: Number(orderData.items) || 1
    };
    DATA.salesOrders.unshift(newOrder);
    return newOrder;
  },

  async addPurchaseOrder(orderData) {
    await this.delay(600);
    const newOrder = {
      id: `OC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      supplier: orderData.supplier,
      value: Number(orderData.value) || 0,
      status: orderData.status || 'pending',
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      delivery: orderData.delivery,
      items: orderData.items ? orderData.items.length : 0,
      requester: orderData.requester || 'Sistema'
    };
    DATA.purchases.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(orderId, newStatus) {
    await this.delay(300);
    const order = DATA.salesOrders.find(o => o.id === orderId);
    if (order) order.status = newStatus;
    return { success: !!order };
  },

  async addQuotation(quotationData) {
    await this.delay(600);
    const newQuote = {
      id: `ORC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      client: quotationData.client,
      value: Number(quotationData.value) || 0,
      validity: quotationData.validity || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: quotationData.status || 'draft',
      seller: quotationData.seller
    };
    DATA.quotations.unshift(newQuote);
    return newQuote;
  },

  async addLead(lead) {
    await this.delay(600); // Simulate network
    const newDeal = {
      id: Math.floor(Math.random() * 10000),
      title: lead.title,
      company: lead.company,
      value: Number(lead.value) || 0,
      prob: 10,
      owner: 'Me',
      days: 0,
      contact: { name: '', phone: '', email: '', address: '' },
      activities: [{ id: Date.now(), type: 'system', date: new Date().toISOString(), text: 'Negócio criado' }]
    };
    DATA.pipeline[0].deals.unshift(newDeal);
    return newDeal;
  },

  async updateLead(dealId, oldColId, newColId, updatedData) {
    await this.delay(400);
    // Find old column
    const oldCol = DATA.pipeline.find(c => c.id === oldColId);
    if (!oldCol) return { success: false };
    
    // Find deal
    const dealIndex = oldCol.deals.findIndex(d => d.id == dealId);
    if (dealIndex === -1) return { success: false };
    
    const deal = oldCol.deals[dealIndex];
    
    // Update data
    deal.title = updatedData.title;
    deal.company = updatedData.company;
    deal.value = Number(updatedData.value) || 0;
    if (updatedData.contact) deal.contact = updatedData.contact;
    
    // Move column if changed
    if (oldColId !== newColId) {
      oldCol.deals.splice(dealIndex, 1);
      const newCol = DATA.pipeline.find(c => c.id === newColId);
      if (newCol) {
        newCol.deals.unshift(deal);
      }
    }
    
    return { success: true };
  },

  async moveLead(dealId, oldColId, newColId) {
    // Immediate optimistic update (no simulated delay for snappy UI)
    const oldCol = DATA.pipeline.find(c => c.id === oldColId);
    if (!oldCol) return { success: false };
    
    const dealIndex = oldCol.deals.findIndex(d => d.id == dealId);
    if (dealIndex === -1) return { success: false };
    
    if (oldColId !== newColId) {
      const deal = oldCol.deals[dealIndex];
      oldCol.deals.splice(dealIndex, 1);
      const newCol = DATA.pipeline.find(c => c.id === newColId);
      if (newCol) {
        newCol.deals.unshift(deal);
      }
    }
    
    return { success: true };
  },

  async deleteLead(dealId, colId) {
    await this.delay(300); // Simulate network
    const col = DATA.pipeline.find(c => c.id === colId);
    if (!col) return { success: false };
    
    const dealIndex = col.deals.findIndex(d => d.id == dealId);
    if (dealIndex === -1) return { success: false };
    
    // Remove the deal
    col.deals.splice(dealIndex, 1);
    
    return { success: true };
  },

  async addActivity(dealId, colId, text, activityDate) {
    const col = DATA.pipeline.find(c => c.id === colId);
    if (!col) return { success: false };
    
    const deal = col.deals.find(d => d.id == dealId);
    if (!deal) return { success: false };
    
    if(!deal.activities) deal.activities = [];
    
    deal.activities.unshift({
      id: Date.now(),
      type: 'user',
      date: activityDate || new Date().toISOString(),
      text: text
    });
    
    return { success: true };
  },

  async completeActivity(dealId, colId, activityId) {
    const col = DATA.pipeline.find(c => c.id === colId);
    if (!col) return { success: false };
    
    const deal = col.deals.find(d => d.id == dealId);
    if (!deal || !deal.activities) return { success: false };
    
    const act = deal.activities.find(a => a.id == activityId);
    if (act) {
      act.status = 'completed';
      act.completedAt = new Date().toISOString();
    }
    return { success: true };
  },

  async getInventoryData() {
    await this.delay(500);
    return {
      products: DATA.masterProducts,
      warehouses: DATA.warehouses,
      movements: DATA.inventoryMovements,
      kpis: DATA.kpis
    };
  },

  async addStockMovement(productId, type, qty, reason) {
    await this.delay(400);
    const prod = DATA.masterProducts.find(p => p.id === productId);
    if (!prod) return { success: false, error: 'Produto não encontrado' };
    
    const amount = Number(qty);
    if (type === 'out' && prod.stock < amount) {
      return { success: false, error: 'Estoque insuficiente' };
    }
    
    if (type === 'in') {
      prod.stock += amount;
    } else {
      prod.stock -= amount;
    }
    
    const move = {
      id: `MOV-${1000 + DATA.inventoryMovements.length + 1}`,
      productId,
      type,
      qty: amount,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      user: 'Operador (Sistema)',
      reason
    };
    
    DATA.inventoryMovements.unshift(move);
    return { success: true, movement: move, newStock: prod.stock };
  },

  async receivePurchaseOrder(orderId, nf) {
    await this.delay(400);
    const purchase = DATA.purchases.find(p => p.id === orderId);
    if (!purchase) return { success: false, error: 'Ordem de Compra não encontrada' };
    if (purchase.status === 'received') return { success: false, error: 'Esta OC já foi recebida' };

    purchase.status = 'received';
    purchase.nf = nf;

    // Automatically enter stock if items are defined
    let movedCount = 0;
    if (Array.isArray(purchase.items)) {
      for (const item of purchase.items) {
        if (item.productId) {
          // add stock movement manually or call addStockMovement
          const prod = DATA.masterProducts.find(p => p.id === item.productId);
          if (prod) {
            prod.stock += Number(item.qty);
            const move = {
              id: `MOV-${1000 + DATA.inventoryMovements.length + 1}`,
              productId: item.productId,
              type: 'in',
              qty: Number(item.qty),
              date: new Date().toLocaleDateString('pt-BR'),
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              user: 'Recebimento (Auto)',
              reason: `Recebimento OC ${orderId} - NF: ${nf}`
            };
            DATA.inventoryMovements.unshift(move);
            movedCount++;
          }
        }
      }
    } else {
      // Mock for legacy purchases that don't have an items array
      const prod = DATA.masterProducts[0];
      if (prod) {
        prod.stock += 10;
        const move = {
          id: `MOV-${1000 + DATA.inventoryMovements.length + 1}`,
          productId: prod.id,
          type: 'in',
          qty: 10,
          date: new Date().toLocaleDateString('pt-BR'),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          user: 'Recebimento (Auto)',
          reason: `Recebimento OC ${orderId} - NF: ${nf} (Mock)`
        };
        DATA.inventoryMovements.unshift(move);
        movedCount++;
      }
    }

    // Add activity
    DATA.activity.unshift({
      type: 'stock',
      title: `Entrada da OC ${orderId}`,
      meta: `NF: ${nf} • Estoque atualizado`,
      time: 'Agora',
      icon: '📦',
      color: '#10b981'
    });

    return { success: true, movedCount };
  }
};
