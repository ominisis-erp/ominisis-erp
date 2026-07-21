// ============================================================
// HR & PAYROLL MODULE — OminiSis Enterprise ERP
// ============================================================

function renderHr() {
  const employees = DATA.employees || [];

  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">👤 Recursos Humanos & Folha de Pagamento</h1>
          <p class="module-subtitle">Ficha cadastral de funcionários, folha mensal, benefícios, treinamentos e controle de férias</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-secondary btn-sm" onclick="alert('Gerar folha de pagamento geral')">💵 Fechar Folha</button>
          <button class="btn btn-primary btn-sm" onclick="alert('Adicionar funcionário')">➕ Novo Cadastro</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">👥</div>
          <div class="kpi-value">${employees.length}</div>
          <div class="kpi-label">Colaboradores Ativos</div>
          <div class="kpi-trend up">↑ 2 novos contratados</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">💵</div>
          <div class="kpi-value">R$ 184K</div>
          <div class="kpi-label">Provisão de Folha Mensal</div>
          <div class="kpi-trend neutral">Estável</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">🏖️</div>
          <div class="kpi-value">3</div>
          <div class="kpi-label">Em Férias no Mês</div>
          <div class="kpi-trend up">1 saindo hoje</div>
        </div>
      </div>

      <!-- Employee grid -->
      <div class="card">
        <div class="card-header"><h3 class="card-title">Quadro de Colaboradores</h3></div>
        <div class="employee-grid">
          ${employees.map(e => `
            <div class="employee-card" onclick="alert('Ver dados de ${e.name}')">
              <div class="employee-avatar" style="background:${e.color || 'var(--grad-brand)'}">${e.initials}</div>
              <div class="employee-name">${e.name}</div>
              <div class="employee-role">${e.role}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">Setor: ${e.dept}</div>
              <div>${getStatusBadge(e.status)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
