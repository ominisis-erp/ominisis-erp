// ============================================================
// MAINTENANCE MODULE — OminiSis Enterprise ERP
// ============================================================

function renderMaintenance() {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">🔧 Manutenção de Equipamentos</h1>
          <p class="module-subtitle">Planos de manutenção preventiva, corretiva e checklists de calibração</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary btn-sm" onclick="alert('Abrir Ordem de Serviço')">➕ Nova OS</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">📈</div>
          <div class="kpi-value">94,2%</div>
          <div class="kpi-label">MTBF Global (Tempo médio entre falhas)</div>
          <div class="kpi-trend up">↑ 2.1h vs meta</div>
        </div>
        <div class="kpi-card kpi-danger">
          <div class="kpi-icon">⚙️</div>
          <div class="kpi-value">1h 45m</div>
          <div class="kpi-label">MTTR (Tempo médio de reparo)</div>
          <div class="kpi-trend down">↓ 15m menor</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">📋</div>
          <div class="kpi-value">3 OS</div>
          <div class="kpi-label">Ordens de Serviço Abertas</div>
          <div class="kpi-trend neutral">→ Estável</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="card-title">Ordens de Serviço de Manutenção Ativas</h3></div>
        <div class="table-container">
          <table>
            <thead>
              <tr><th>OS</th><th>Equipamento</th><th>Tipo</th><th>Descrição do Problema / Plano</th><th>Responsável</th><th>Previsão</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>OS-2026-102</strong></td>
                <td>CNC Okuma MU-6300 (CNC-03)</td>
                <td><span class="badge badge-danger">Corretiva</span></td>
                <td>Superaquecimento no eixo spindle principal</td>
                <td>Marcos T.</td>
                <td>Hoje (19:30)</td>
                <td>${getStatusBadge('running')}</td>
              </tr>
              <tr>
                <td><strong>OS-2026-103</strong></td>
                <td>Injetora Engel (INJ-01)</td>
                <td><span class="badge badge-success">Preventiva</span></td>
                <td>Troca periódica de óleo hidráulico e filtros</td>
                <td>Vanderlei S.</td>
                <td>10/08/2026</td>
                <td>${getStatusBadge('scheduled')}</td>
              </tr>
              <tr>
                <td><strong>OS-2026-104</strong></td>
                <td>Prensa Schuler (PRE-01)</td>
                <td><span class="badge badge-info">Preditiva</span></td>
                <td>Análise de vibração e termografia dos rolamentos</td>
                <td>Marcos T.</td>
                <td>05/08/2026</td>
                <td>${getStatusBadge('approved')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
