// ============================================================
// QUALITY MODULE — OminiSis Enterprise ERP
// ============================================================

function renderQuality() {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">✅ Controle de Qualidade</h1>
          <p class="module-subtitle">Inspeções de recebimento, auditorias internas, não-conformidades (NC) e CAPA</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary btn-sm" onclick="alert('Abrir Ficha de Inspeção')">➕ Nova Inspeção</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">🎯</div>
          <div class="kpi-value">99,1%</div>
          <div class="kpi-label">Índice de Qualidade (Frist Pass Yield)</div>
          <div class="kpi-trend up">↑ 0.5% vs mês ant.</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-value">3</div>
          <div class="kpi-label">Não-Conformidades Abertas</div>
          <div class="kpi-trend neutral">→ Estável</div>
        </div>
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">📋</div>
          <div class="kpi-value">124</div>
          <div class="kpi-label">Inspeções Realizadas (Mês)</div>
          <div class="kpi-trend up">↑ +12%</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="card-title">Registro de Não-Conformidades (NC / RNC)</h3></div>
        <div class="table-container">
          <table>
            <thead>
              <tr><th>RNC</th><th>Origem</th><th>Descrição do Desvio</th><th>Responsável</th><th>Data Abertura</th><th>Ação Proposta (CAPA)</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>RNC-2026-041</strong></td>
                <td>Recebimento</td>
                <td>Divergência dimensional na Chapa Aço 2mm</td>
                <td>Eduardo L.</td>
                <td>25/06/2026</td>
                <td>Devolução ao fornecedor e reavaliação de lote</td>
                <td>${getStatusBadge('pending')}</td>
              </tr>
              <tr>
                <td><strong>RNC-2026-040</strong></td>
                <td>Produção</td>
                <td>Riscos superficiais na pintura do Motor Elétrico</td>
                <td>Diana S.</td>
                <td>24/06/2026</td>
                <td>Retrabalho de pintura e regulagem de bico injetor</td>
                <td>${getStatusBadge('approved')}</td>
              </tr>
              <tr>
                <td><strong>RNC-2026-039</strong></td>
                <td>Auditoria</td>
                <td>Falta de calibração no paquímetro CNC-03</td>
                <td>Eduardo L.</td>
                <td>20/06/2026</td>
                <td>Envio para laboratório credenciado e recalibração</td>
                <td>${getStatusBadge('received')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
