// ============================================================
// TREASURY MODULE — OminiSis Enterprise ERP
// ============================================================

function renderTreasury() {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">🏦 Tesouraria & Open Finance</h1>
          <p class="module-subtitle">Contas correntes, saldos em tempo real, liquidação PIX e emissão automática de boletos</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary btn-sm" onclick="alert('Importar Arquivo OFX')">📥 Importar Extrato</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">🏦</div>
          <div class="kpi-value">R$ 842.000</div>
          <div class="kpi-label">Banco do Brasil C/C</div>
          <div class="kpi-trend up">Sincronizado via API</div>
        </div>
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">🏦</div>
          <div class="kpi-value">R$ 350.000</div>
          <div class="kpi-label">Itaú Unibanco C/C</div>
          <div class="kpi-trend up">Sincronizado via API</div>
        </div>
        <div class="kpi-card kpi-info">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">R$ 48.000</div>
          <div class="kpi-label">Caixa Físico Interno</div>
          <div class="kpi-trend neutral">Conferido hoje</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Cobrança e Emissão de Boletos / PIX</h3></div>
          <div style="display:flex; flex-direction:column; gap:12px; padding:8px 0">
            <button class="btn btn-ghost" style="justify-content:flex-start" onclick="alert('Gerar lote de 48 Boletos')">📄 Emissão de Boletos em Lote</button>
            <button class="btn btn-ghost" style="justify-content:flex-start" onclick="alert('Configurar API Webhook PIX')">⚡ Webhook PIX (Confirmação Imediata)</button>
            <button class="btn btn-ghost" style="justify-content:flex-start" onclick="alert('Taxas de câmbio USD/EUR')">💱 Cotação Câmbio: USD = R$ 5,42 / EUR = R$ 5,80</button>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header"><h3 class="card-title">Extrato de Contas Recentes</h3></div>
          <div class="table-container">
            <table>
              <thead>
                <tr><th>Data</th><th>Banco</th><th>Descrição</th><th>Valor</th></tr>
              </thead>
              <tbody>
                <tr><td>Hoje</td><td>BB</td><td>Recebimento PIX - Beta Corp</td><td style="color:var(--brand-success)">+ R$ 48.500,00</td></tr>
                <tr><td>Hoje</td><td>Itaú</td><td>Pagamento Fornecedor - Steel & Iron</td><td style="color:var(--brand-danger)">- R$ 42.800,00</td></tr>
                <tr><td>Ontem</td><td>BB</td><td>Tarifas bancárias mensais</td><td style="color:var(--brand-danger)">- R$ 120,00</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}
