// ============================================================
// INTEGRATIONS MODULE — OminiSis Enterprise ERP
// ============================================================

function renderIntegrations() {
  const integrations = DATA.integrations || [];

  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">🔗 Hub de Integrações (API & SDK)</h1>
          <p class="module-subtitle">Gerenciamento de conexões externas com marketplaces, transportadoras, bancos e redes sociais</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-secondary btn-sm" onclick="alert('Histórico de requisições de API')">📊 Logs de API</button>
          <button class="btn btn-primary btn-sm" onclick="alert('Configurar nova API externa')">🔌 Novo Conector</button>
        </div>
      </div>

      <div class="integration-grid">
        ${integrations.map(i => {
          const isConn = i.status === 'connected';
          return `
            <div class="integration-card ${isConn ? 'connected' : ''}" onclick="manageIntegration('${i.name}')">
              <div style="display:flex;justify-content:between;align-items:center">
                <div class="integration-logo">${i.logo}</div>
                <div>${getStatusBadge(i.status)}</div>
              </div>
              <div>
                <div class="integration-name">${i.name}</div>
                <div class="integration-desc">Setor: <strong>${i.category}</strong></div>
              </div>
              <div class="integration-status">
                <span class="text-muted" style="font-size:11px">${isConn ? `${i.calls.toLocaleString('pt-BR')} reqs/dia` : 'Sem chamadas'}</span>
                <button class="btn btn-ghost btn-sm" style="font-size:10px">${isConn ? 'Configurar' : 'Conectar'}</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  window.manageIntegration = (name) => {
    const item = DATA.integrations.find(i => i.name === name);
    if (!item) return;
    const newStatus = item.status === 'connected' ? 'disconnected' : 'connected';
    const confirmConn = confirm(`Deseja alterar a conexão da integração "${name}" para [${newStatus}]?`);
    if(confirmConn) {
      item.status = newStatus;
      item.calls = newStatus === 'connected' ? Math.floor(Math.random()*5000) + 100 : 0;
      renderIntegrations();
    }
  };
}
