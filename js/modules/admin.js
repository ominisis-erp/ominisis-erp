// ============================================================
// ADMIN CONSOLE MODULE (SUPER ADMIN) — OminiSis Enterprise ERP
// ============================================================

function renderAdmin() {
  const tenants = DATA.tenants || [];
  
  const totalMRR = tenants.reduce((s, t) => s + (t.mrr || 0), 0);
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const trialTenants = tenants.filter(t => t.status === 'trial').length;
  const totalUsers = tenants.reduce((s, t) => s + (t.users || 0), 0);

  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">🛡️ Admin Console (Super Admin)</h1>
          <p class="module-subtitle">Gerenciamento global de empresas clientes (tenants), assinaturas, infraestrutura e provisionamento</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-secondary btn-sm" onclick="alert('Exportar log de auditoria global')">📑 Auditoria</button>
          <button class="btn btn-primary btn-sm" onclick="showProvisionModal()">⚡ Provisionar Novo Cliente</button>
        </div>
      </div>

      <!-- Admin KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">${formatCurrencyFull(totalMRR)}</div>
          <div class="kpi-label">MRR Total da Plataforma</div>
          <div class="kpi-trend up">↑ 8.4% vs mês ant.</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">🏢</div>
          <div class="kpi-value">${activeTenants}</div>
          <div class="kpi-label">Empresas Ativas</div>
          <div class="kpi-trend up">↑ 2 novos este mês</div>
        </div>
        <div class="kpi-card kpi-info">
          <div class="kpi-icon">🧪</div>
          <div class="kpi-value">${trialTenants}</div>
          <div class="kpi-label">Contas em Período de Testes</div>
          <div class="kpi-trend neutral">→ Estável</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">👥</div>
          <div class="kpi-value">${totalUsers}</div>
          <div class="kpi-label">Usuários Ativos Totais</div>
          <div class="kpi-trend up">↑ 34 novos hoje</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-nav" id="admin-tabs">
        <button class="tab-btn active" onclick="adminTab('tenants', this)">🏢 Clientes (Tenants)</button>
        <button class="tab-btn" onclick="adminTab('infra', this)">🎛️ Infraestrutura & Containers</button>
        <button class="tab-btn" onclick="adminTab('plans', this)">💳 Planos & Licenciamento</button>
      </div>

      <!-- Tenants Management -->
      <div id="admin-tenants">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Empresas Cadastradas no Sistema</h3>
            <div style="display:flex;gap:8px">
              <input type="text" placeholder="Filtrar empresa..." class="form-input" style="padding:4px 10px; font-size:12px" onkeyup="filterTenants(this.value)" />
            </div>
          </div>
          <div class="tenant-list" id="tenant-list-container">
            ${tenants.map(t => `
              <div class="tenant-row" onclick="manageTenant('${t.id}')">
                <div class="tenant-row-avatar" style="background:${t.color || 'var(--grad-brand)'}">${t.initials}</div>
                <div class="tenant-row-info">
                  <div class="tenant-row-name">${t.name} <span style="font-size:11px;color:var(--text-muted);font-weight:normal">(${t.id})</span></div>
                  <div class="tenant-row-meta">Plano: <strong>${t.plan}</strong> · Usuários: <strong>${t.users}</strong> · MRR: <strong>${t.mrr > 0 ? formatCurrencyFull(t.mrr) : 'N/A (Trial)'}</strong></div>
                </div>
                <div class="tenant-row-modules">
                  ${t.modules.map(m => `<span class="tenant-module-tag">${m}</span>`).join('')}
                </div>
                <div style="margin-left: 20px">
                  ${getStatusBadge(t.status)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Infra & Container Status -->
      <div id="admin-infra" style="display:none">
        <div class="grid-2">
          <div class="card">
            <div class="card-header"><h3 class="card-title">📊 Recursos de Hardware (Cluster K8s)</h3></div>
            <div style="display:flex;flex-direction:column;gap:16px;padding:8px 0">
              <div>
                <div style="display:flex;justify-content:between;margin-bottom:6px;font-size:12px">
                  <span>Processamento Global (CPU)</span>
                  <strong>62% (24 / 40 Cores)</strong>
                </div>
                <div class="progress-bar"><div class="progress-fill progress-fill-primary" style="width:62%"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:between;margin-bottom:6px;font-size:12px">
                  <span>Memória RAM Total</span>
                  <strong>78% (100 GB / 128 GB)</strong>
                </div>
                <div class="progress-bar"><div class="progress-fill progress-fill-warning" style="width:78%"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:between;margin-bottom:6px;font-size:12px">
                  <span>Armazenamento S3 (MinIO)</span>
                  <strong>43% (4.3 TB / 10 TB)</strong>
                </div>
                <div class="progress-bar"><div class="progress-fill progress-fill-success" style="width:43%"></div></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="card-title">🐳 Status dos Pods & Containers</h3></div>
            <div class="table-container">
              <table>
                <thead>
                  <tr><th>Serviço</th><th>Pod ID</th><th>Réplicas</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>PostgreSQL Cluster</strong></td><td class="font-mono">pg-cluster-0</td><td>3/3</td><td>${getStatusBadge('connected')}</td></tr>
                  <tr><td><strong>Redis Cache</strong></td><td class="font-mono">redis-sentinel-0</td><td>2/2</td><td>${getStatusBadge('connected')}</td></tr>
                  <tr><td><strong>RabbitMQ Message Bus</strong></td><td class="font-mono">rabbitmq-ha-0</td><td>3/3</td><td>${getStatusBadge('connected')}</td></tr>
                  <tr><td><strong>MinIO Object Storage</strong></td><td class="font-mono">minio-statefulset-0</td><td>4/4</td><td>${getStatusBadge('connected')}</td></tr>
                  <tr><td><strong>Elasticsearch cluster</strong></td><td class="font-mono">es-master-0</td><td>3/3</td><td>${getStatusBadge('connected')}</td></tr>
                  <tr><td><strong>Keycloak IAM</strong></td><td class="font-mono">keycloak-auth-dep</td><td>2/2</td><td>${getStatusBadge('connected')}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Plans & Pricing Settings -->
      <div id="admin-plans" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Configuração de Planos SaaS</h3>
            <button class="btn btn-primary btn-sm" onclick="alert('Criar novo plano comercial')">➕ Novo Plano</button>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr><th>Nome do Plano</th><th>Preço Base Mensal</th><th>Limite de Usuários</th><th>Módulos Inclusos</th><th>Ações</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Starter</strong></td><td>R$ 499,00</td><td>Até 5</td><td>Core, Vendas, Estoque (Básico)</td><td><button class="btn btn-ghost btn-sm">✏️</button></td></tr>
                <tr><td><strong>Professional</strong></td><td>R$ 1.499,00</td><td>Até 50</td><td>Core, Vendas, Estoque, CRM, Financeiro, Compras</td><td><button class="btn btn-ghost btn-sm">✏️</button></td></tr>
                <tr><td><strong>Enterprise</strong></td><td>R$ 4.999,00</td><td>Ilimitado</td><td>Todos os Módulos + IA Copilot e Configurações customizadas</td><td><button class="btn btn-ghost btn-sm">✏️</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Provisioning Modal Overlay (Simulated) -->
    <div class="modal-overlay" id="provision-modal">
      <div class="modal" style="width: 500px">
        <div class="notification-header">
          <h3>Provisionar Novo Cliente (Tenant)</h3>
          <button class="notif-close" onclick="closeProvisionModal()">✕</button>
        </div>
        <div style="padding: 20px">
          <div class="form-group">
            <label class="form-label">Nome da Empresa</label>
            <input type="text" id="prov-name" class="form-input" placeholder="Ex: Inova Tech S.A." />
          </div>
          <div class="form-group">
            <label class="form-label">Plano de Assinatura</label>
            <select id="prov-plan" class="form-select w-full" style="background-color: var(--bg-elevated); color: white; border: 1px solid var(--border-default)">
              <option value="Starter">Starter (R$ 499,00/mês)</option>
              <option value="Professional">Professional (R$ 1.499,00/mês)</option>
              <option value="Enterprise" selected>Enterprise (R$ 4.999,00/mês)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Isolamento de Banco</label>
            <select id="prov-db" class="form-select w-full" style="background-color: var(--bg-elevated); color: white; border: 1px solid var(--border-default)">
              <option value="shared">Schema Isolado (Banco Compartilhado)</option>
              <option value="isolated">Instância PostgreSQL Dedicada (Recomendado p/ Enterprise)</option>
            </select>
          </div>
          <div class="form-group" style="margin-top:20px; display:flex; justify-content:flex-end; gap:8px">
            <button class="btn btn-ghost" onclick="closeProvisionModal()">Cancelar</button>
            <button class="btn btn-primary" onclick="executeProvision()">Criar Instância</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tab navigation handler
  window.adminTab = (tab, btn) => {
    document.querySelectorAll('#admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['tenants', 'infra', 'plans'].forEach(t => {
      const el = document.getElementById(`admin-${t}`);
      if (el) el.style.display = t === tab ? '' : 'none';
    });
  };

  // Modals management
  window.showProvisionModal = () => {
    document.getElementById('provision-modal').classList.add('open');
  };

  window.closeProvisionModal = () => {
    document.getElementById('provision-modal').classList.remove('open');
  };

  window.executeProvision = () => {
    const name = document.getElementById('prov-name').value;
    const plan = document.getElementById('prov-plan').value;
    if(!name) { alert('Digite o nome da empresa.'); return; }
    
    alert(`Provisionando banco de dados, configurando RabbitMQ e enviando convite Keycloak para o administrador da "${name}" (${plan})...`);
    
    // Add dynamically to dataset
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    DATA.tenants.push({
      id: 'T-00' + (DATA.tenants.length + 1),
      name: name,
      initials: initials,
      plan: plan,
      users: 1,
      modules: plan === 'Enterprise' ? ['Core', 'ERP', 'CRM', 'BI', 'RH', 'IA'] : ['Core', 'ERP'],
      status: 'active',
      mrr: plan === 'Enterprise' ? 4999 : plan === 'Professional' ? 1499 : 499,
      since: 'Jun 2026',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
    
    closeProvisionModal();
    renderAdmin();
  };

  window.filterTenants = (val) => {
    const query = val.toLowerCase();
    const rows = document.querySelectorAll('#tenant-list-container .tenant-row');
    rows.forEach(row => {
      const text = row.querySelector('.tenant-row-name').textContent.toLowerCase();
      row.style.display = text.includes(query) ? 'flex' : 'none';
    });
  };

  window.manageTenant = (id) => {
    const tenant = DATA.tenants.find(t => t.id === id);
    if (!tenant) return;
    
    const newStatus = tenant.status === 'active' ? 'inactive' : 'active';
    const confirmChange = confirm(`Deseja alterar o status do cliente "${tenant.name}" de [${tenant.status}] para [${newStatus}]?`);
    if(confirmChange) {
      tenant.status = newStatus;
      renderAdmin();
    }
  };
}
