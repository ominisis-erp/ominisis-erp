// ============================================================
// FINANCE MODULE — OminiSis Enterprise ERP
// Accounts Payable, Accounts Receivable, Cashflow, Reconciliation
// ============================================================

async function renderFinance() {
  const content = document.getElementById('content');

  // Skeleton Loader
  content.innerHTML = `
    <div class="animate-in" style="display:flex;flex-direction:column;gap:20px;opacity:0.6">
      <div style="height:60px;background:var(--bg-elevated);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
      <div class="kpi-grid">
        ${Array(4).fill('<div style="height:120px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>').join('')}
      </div>
      <div style="height:400px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
    </div>
  `;

  // Simulate API fetch
  const data = await window.API.getFinancialData();
  const rec = data.financials.receivable || [];
  const pay = data.financials.payable || [];

  content.innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">💰 Gestão Financeira</h1>
          <p class="module-subtitle">Contas a pagar, contas a receber, fluxo de caixa projetado e DRE simplificado</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-secondary btn-sm" onclick="alert('Exportar PDF do Fluxo de Caixa')">📊 PDF</button>
          <button class="btn btn-primary btn-sm" onclick="alert('Lançar novo título financeiro')">➕ Novo Lançamento</button>
        </div>
      </div>

      <!-- Financial KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">${formatCurrencyFull(data.kpis.cashflow.value)}</div>
          <div class="kpi-label">Saldo em Caixa</div>
          <div class="kpi-trend up">↑ 26,5% vs mês ant.</div>
        </div>
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">📈</div>
          <div class="kpi-value">${formatCurrencyFull(data.kpis.receivable.value)}</div>
          <div class="kpi-label">Contas a Receber (30d)</div>
          <div class="kpi-trend up">↑ +14.7%</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">📉</div>
          <div class="kpi-value">${formatCurrencyFull(data.kpis.payable.value)}</div>
          <div class="kpi-label">Contas a Pagar (30d)</div>
          <div class="kpi-trend down">↓ -4.2%</div>
        </div>
        <div class="kpi-card kpi-danger">
          <div class="kpi-icon">💸</div>
          <div class="kpi-value">${formatCurrencyFull(data.kpis.overdue.value)}</div>
          <div class="kpi-label">Inadimplência Acumulada</div>
          <div class="kpi-trend down">↓ -15,9%</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-nav" id="finance-tabs">
        <button class="tab-btn active" onclick="financeTab('receivable', this)">📈 A Receber</button>
        <button class="tab-btn" onclick="financeTab('payable', this)">📉 A Pagar</button>
        <button class="tab-btn" onclick="financeTab('cashflow', this)">📊 Fluxo de Caixa</button>
      </div>

      <!-- Accounts Receivable Table -->
      <div id="fin-receivable">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Títulos a Receber</h3>
            <button class="btn btn-ghost btn-sm" onclick="alert('Conciliar PIX automático')">⚡ Conciliação Express (PIX)</button>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Duplicata / Doc</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Dias rest.</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${rec.map(r => `
                  <tr>
                    <td><strong class="font-mono">${r.doc}</strong></td>
                    <td>${r.client}</td>
                    <td><strong>${formatCurrencyFull(r.value)}</strong></td>
                    <td>${r.due}</td>
                    <td><span style="color:${r.days < 0 ? 'var(--brand-danger)' : 'var(--text-muted)'}">${r.days < 0 ? `Atrasado ${Math.abs(r.days)}d` : `${r.days} dias`}</span></td>
                    <td>${getStatusBadge(r.status)}</td>
                    <td>
                      <button class="btn btn-ghost btn-sm" onclick="alert('Enviar lembrete WhatsApp de cobrança')">💬</button>
                      <button class="btn btn-primary btn-sm" onclick="alert('Liquidar título ${r.doc}')">Liquidar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Accounts Payable Table -->
      <div id="fin-payable" style="display:none">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Títulos a Pagar</h3></div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Duplicata</th>
                  <th>Fornecedor</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${pay.map(p => `
                  <tr>
                    <td><strong class="font-mono">${p.doc}</strong></td>
                    <td>${p.supplier}</td>
                    <td><span class="badge badge-muted">${p.category}</span></td>
                    <td><strong>${formatCurrencyFull(p.value)}</strong></td>
                    <td>${p.due}</td>
                    <td>${getStatusBadge(p.status)}</td>
                    <td>
                      <button class="btn btn-primary btn-sm" onclick="alert('Gerar Borderô de Pagamento ${p.doc}')">Agendar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Cashflow Graph -->
      <div id="fin-cashflow" style="display:none">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Fluxo de Caixa Mensal Projetado</h3></div>
          <div id="finance-cashflow-chart" style="height:250px"></div>
        </div>
      </div>

    </div>
  `;

  // Tab navigation handler
  window.financeTab = (tab, btn) => {
    document.querySelectorAll('#finance-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['receivable', 'payable', 'cashflow'].forEach(t => {
      const el = document.getElementById(`fin-${t}`);
      if (el) el.style.display = t === tab ? '' : 'none';
    });

    if (tab === 'cashflow') {
      requestAnimationFrame(() => {
        Charts.drawBarChart('finance-cashflow-chart', data.cashflow.labels, [
          { data: data.cashflow.inflow.map(v => v/1000), color: '#10b981' },
          { data: data.cashflow.outflow.map(v => v/1000), color: '#ef4444' }
        ], {
          height: 220,
          formatY: v => `R$ ${v}K`
        });
      });
    }
  };
}
