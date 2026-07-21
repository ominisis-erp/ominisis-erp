// ============================================================
// OminiSis Enterprise — Dashboard Module
// ============================================================

async function renderDashboard() {
  const content = document.getElementById('content');
  
  // Skeleton Loader
  content.innerHTML = `
    <div class="animate-in" style="display:flex;flex-direction:column;gap:20px;opacity:0.6">
      <div style="height:120px;background:var(--bg-elevated);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
      <div class="kpi-grid">
        ${Array(8).fill('<div style="height:140px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>').join('')}
      </div>
      <div class="grid-2-1">
        <div style="height:250px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
        <div style="height:250px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
      </div>
    </div>
    <style>@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }</style>
  `;

  // Fetch from API
  const data = await window.API.getDashboardData();

  content.innerHTML = `
    <div class="animate-in">
      <!-- Welcome Banner -->
      <div class="dashboard-welcome">
        <div style="position:relative;z-index:1">
          <div class="welcome-title">Bom dia, João! 👋</div>
          <div class="welcome-subtitle">Aqui está um resumo executivo da ${data.company.name} — ${new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</div>
          <div class="welcome-stats">
            <div class="welcome-stat">
              <span class="welcome-stat-value" style="color:var(--brand-success)">R$ ${(data.kpis.revenue.value/1000000).toFixed(2).replace('.', ',')}M</span>
              <span class="welcome-stat-label">Faturamento Junho</span>
            </div>
            <div class="welcome-stat">
              <span class="welcome-stat-value">${data.kpis.orders.value.toLocaleString('pt-BR')}</span>
              <span class="welcome-stat-label">Pedidos no Mês</span>
            </div>
            <div class="welcome-stat">
              <span class="welcome-stat-value" style="color:var(--brand-primary)">${data.kpis.oee.value.toFixed(1).replace('.', ',')}%</span>
              <span class="welcome-stat-label">OEE Global</span>
            </div>
            <div class="welcome-stat">
              <span class="welcome-stat-value">${data.kpis.nps.value}</span>
              <span class="welcome-stat-label">NPS</span>
            </div>
            <div class="welcome-stat">
              <span class="welcome-stat-value" style="color:var(--brand-warning)">3</span>
              <span class="welcome-stat-label">Alertas Críticos</span>
            </div>
          </div>
        </div>
        <div style="position:absolute;bottom:20px;right:28px;z-index:1">
          <button class="btn btn-primary" onclick="navigateTo('ai-copilot')" style="gap:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Perguntar à IA
          </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        ${buildKpiCard('Faturamento Mensal', 'R$ 4,82M', '+17,6%', 'up', 'kpi-primary', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, 'kpi-spark-revenue')}
        ${buildKpiCard('Pedidos Mês', '1.847', '+21,5%', 'up', 'kpi-success', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`, 'kpi-spark-orders')}
        ${buildKpiCard('A Receber (30d)', 'R$ 2,18M', '+14,7%', 'up', 'kpi-info', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`, 'kpi-spark-receivable')}
        ${buildKpiCard('Saldo em Caixa', 'R$ 1,24M', '+26,5%', 'up', 'kpi-success', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`, 'kpi-spark-cash')}
        ${buildKpiCard('Margem Bruta', '34,7%', '+3,5pp', 'up', 'kpi-primary', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`, 'kpi-spark-margin')}
        ${buildKpiCard('Inadimplência', 'R$ 185K', '-15,9%', 'up', 'kpi-danger', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`, 'kpi-spark-overdue')}
        ${buildKpiCard('OEE Produção', '87,4%', '+3,3pp', 'up', 'kpi-warning', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`, 'kpi-spark-oee')}
        ${buildKpiCard('Leads Ativos', '342', '+22,1%', 'up', 'kpi-info', `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, 'kpi-spark-leads')}
      </div>

      <!-- Charts Row -->
      <div class="grid-2-1" style="margin-bottom:20px">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Receita vs. Meta — 2026</div>
              <div class="card-subtitle">Valores em R$ milhões</div>
            </div>
            <div style="display:flex;gap:12px;font-size:11px;align-items:center">
              <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:3px;background:#6366f1;border-radius:2px;display:inline-block"></span>Real</span>
              <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:3px;background:#3a3a4a;border-radius:2px;display:inline-block;border-top:2px dashed #5a5a72"></span>Meta</span>
            </div>
          </div>
          <div id="revenue-chart" style="height:200px"></div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">Receita por Segmento</div>
            <div class="card-subtitle">Junho 2026</div>
          </div>
          <div class="donut-chart-wrap" style="margin-top:8px">
            <div id="donut-segment" class="donut-svg"></div>
            <div class="donut-legend">
              ${data.revenueBySegment.map(s => `
                <div class="legend-item">
                  <span class="legend-dot" style="background:${s.color}"></span>
                  <span class="legend-label">${s.label}</span>
                  <span class="legend-value">${formatCurrency(s.value)}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid-2" style="margin-bottom:20px">
        <!-- Activity -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Atividade Recente</div>
            <button class="btn btn-ghost btn-sm">Ver tudo</button>
          </div>
          <div class="activity-feed">
            ${data.activity.map(a => `
              <div class="activity-item">
                <div class="activity-icon" style="background:${a.color}22;color:${a.color}">
                  <span style="font-size:14px">${a.icon}</span>
                </div>
                <div class="activity-content">
                  <div class="activity-title">${a.title}</div>
                  <div class="activity-meta">${a.meta}</div>
                </div>
                <div class="activity-time">${a.time}</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Quick Access -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Acesso Rápido & Alertas</div>
          </div>
          <!-- Alerts -->
          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
            <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius-md);padding:12px 14px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span style="color:var(--brand-danger);font-size:12px;font-weight:700">⚠ CRÍTICO</span>
                <span style="color:var(--text-muted);font-size:11px">há 2h</span>
              </div>
              <div style="font-size:13px;color:var(--text-primary)">Estoque de Chapa Aço 2mm abaixo do mínimo (8 PC / mín. 50 PC)</div>
            </div>
            <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:var(--radius-md);padding:12px 14px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span style="color:var(--brand-warning);font-size:12px;font-weight:700">⚡ ATENÇÃO</span>
                <span style="color:var(--text-muted);font-size:11px">há 5m</span>
              </div>
              <div style="font-size:13px;color:var(--text-primary)">Pedido PED-4521 (R$ 184.200) aguardando aprovação do gerente</div>
            </div>
            <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius-md);padding:12px 14px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span style="color:var(--brand-danger);font-size:12px;font-weight:700">💸 VENCIDO</span>
                <span style="color:var(--text-muted);font-size:11px">há 1 dia</span>
              </div>
              <div style="font-size:13px;color:var(--text-primary)">NF-12820 (R$ 291.000) — Gamma Tech SA venceu ontem</div>
            </div>
          </div>
          <!-- Quick Actions -->
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text-muted);margin-bottom:8px">Ações Rápidas</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${[
              ['Novo Pedido', 'sales', '#6366f1'],
              ['Lançar NF', 'sales', '#10b981'],
              ['Solicitar Compra', 'purchase', '#f59e0b'],
              ['Registrar Pagto', 'finance', '#06b6d4'],
            ].map(([label, mod, color]) => `
              <button class="btn btn-ghost" style="justify-content:flex-start;font-size:12px" onclick="navigateTo('${mod}')">
                <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></span>
                ${label}
              </button>`).join('')}
          </div>
        </div>
      </div>

      <!-- Cashflow Chart -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Fluxo de Caixa — Últimos 6 meses</div>
            <div class="card-subtitle">Entradas vs. Saídas (R$ MM)</div>
          </div>
          <div style="display:flex;gap:16px;font-size:11px;align-items:center">
            <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:12px;background:#10b981;border-radius:3px;display:inline-block"></span>Entradas</span>
            <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:12px;background:#ef4444;border-radius:3px;display:inline-block"></span>Saídas</span>
          </div>
        </div>
        <div id="cashflow-chart"></div>
      </div>
    </div>`;

  // Render charts after DOM update
  requestAnimationFrame(() => {
    // Revenue line chart
    Charts.drawLineChart('revenue-chart', [
      data.revenueChart.data.map(v => v/1000000),
      data.revenueChart.target.map(v => v/1000000)
    ], {
      labels: data.revenueChart.labels,
      colors: ['#6366f1', '#3a3a4a'],
      height: 200,
      fill: true,
      minZero: true,
      formatY: v => `R$${v.toFixed(1)}M`
    });

    // Cashflow bar chart
    Charts.drawBarChart('cashflow-chart', data.cashflow.labels, [
      { data: data.cashflow.inflow.map(v => v/1000000), color: '#10b981' },
      { data: data.cashflow.outflow.map(v => v/1000000), color: '#ef4444' }
    ], {
      height: 200,
      formatY: v => `R$${v.toFixed(1)}M`
    });

    // Donut
    Charts.drawDonut('donut-segment', data.revenueBySegment, { size: 140, strokeW: 22 });

    // Sparklines
    const sparkSets = {
      'kpi-spark-revenue': [3200000, 3800000, 3600000, 4100000, 4300000, 4820000],
      'kpi-spark-orders': [1200, 1380, 1290, 1520, 1680, 1847],
      'kpi-spark-receivable': [1800000, 1950000, 2100000, 1980000, 2080000, 2180000],
      'kpi-spark-cash': [820000, 910000, 880000, 1020000, 1080000, 1240000],
      'kpi-spark-margin': [28.4, 30.1, 29.8, 31.2, 33.4, 34.7],
      'kpi-spark-overdue': [280000, 255000, 248000, 220000, 210000, 185000],
      'kpi-spark-oee': [82.1, 83.4, 84.1, 85.2, 86.8, 87.4],
      'kpi-spark-leads': [220, 255, 268, 280, 310, 342],
    };
    Object.entries(sparkSets).forEach(([id, sparkData]) => Charts.drawSparkline(id, sparkData));
  });
}

function buildKpiCard(label, value, trend, dir, type, icon, sparkId) {
  const trendClass = dir === 'up' && !label.includes('Inadimpl') ? 'up' : (dir === 'up' && label.includes('Inadimpl') ? 'up' : 'down');
  const trendIcon = dir === 'up' ? '↑' : '↓';
  return `
    <div class="kpi-card ${type}">
      <div class="kpi-header">
        <div class="kpi-icon ${type}">${icon}</div>
        <div class="kpi-trend ${trendClass}">${trendIcon} ${trend}</div>
      </div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-label">${label}</div>
      <div class="kpi-sparkline" id="${sparkId}"></div>
    </div>`;
}
