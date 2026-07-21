// ============================================================
// PROJECTS & RESOURCES MODULE — OminiSis Enterprise ERP
// ============================================================

function renderProjects() {
  const projects = DATA.projects || [];

  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">📅 Gestão de Projetos & Recursos</h1>
          <p class="module-subtitle">Acompanhamento de cronogramas, custos, horas (timesheet) e rentabilidade por projeto</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary btn-sm" onclick="alert('Criar novo projeto')">➕ Novo Projeto</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">📅</div>
          <div class="kpi-value">${projects.length}</div>
          <div class="kpi-label">Projetos Ativos</div>
          <div class="kpi-trend up">↑ 1 iniciado</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">💵</div>
          <div class="kpi-value">R$ 915K</div>
          <div class="kpi-label">Orçamento Total Alocado</div>
          <div class="kpi-trend neutral">Estável</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-value">1</div>
          <div class="kpi-label">Projeto em Risco</div>
          <div class="kpi-trend down">Atraso na AWS</div>
        </div>
      </div>

      <!-- Gantt View -->
      <div class="card" style="margin-bottom:24px">
        <div class="card-header"><h3 class="card-title">Linha do Tempo Executiva (Cronograma)</h3></div>
        
        <div class="gantt-container">
          <div class="gantt-header">
            <div class="gantt-task-col">Projeto</div>
            <div class="gantt-months">
              <div class="gantt-month">Mar</div>
              <div class="gantt-month">Abr</div>
              <div class="gantt-month">Mai</div>
              <div class="gantt-month">Jun</div>
              <div class="gantt-month">Jul</div>
              <div class="gantt-month">Ago</div>
            </div>
          </div>
          
          ${projects.map((p, pi) => {
            const colors = ['#6366f1', '#ef4444', '#06b6d4', '#10b981'];
            const color = colors[pi % colors.length];
            const startPct = pi * 12; // simulated offset
            const lenPct = 40 + pi * 10; // simulated duration
            return `
              <div class="gantt-row" onclick="alert('Ver detalhes de ${p.name}')">
                <div class="gantt-task-name">
                  <span class="gantt-task-label">${p.name}</span>
                  <span class="gantt-task-sub">Gestor: ${p.manager}</span>
                </div>
                <div class="gantt-timeline">
                  <div class="gantt-bar" style="left: ${startPct}%; width: ${lenPct}%; background:${color}">
                    ${p.progress}% Completo
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
