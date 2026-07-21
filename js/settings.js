// ============================================================
// SETTINGS MODULE — OminiSis Enterprise ERP
// ============================================================

function renderSettings() {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">⚙️ Configurações do Sistema</h1>
          <p class="module-subtitle">Gerencie os parâmetros da empresa, regras de segurança fiscal e controle de acessos</p>
        </div>
      </div>

      <div class="settings-grid">
        <div class="settings-nav">
          <div class="settings-nav-item active" onclick="setTab('general', this)">🏢 Parâmetros da Empresa</div>
          <div class="settings-nav-item" onclick="setTab('security', this)">🛡️ Segurança & Permissões</div>
          <div class="settings-nav-item" onclick="setTab('billing', this)">💳 Assinatura & Faturamento</div>
        </div>

        <div class="settings-content">
          <!-- General -->
          <div id="set-general">
            <h3 class="card-title" style="margin-bottom:16px">Configurações Gerais</h3>
            <div class="form-group">
              <label class="form-label">Razão Social</label>
              <input type="text" value="Acme Corporation do Brasil Ltda" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">CNPJ</label>
              <input type="text" value="12.345.678/0001-90" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Moeda Padrão</label>
              <select class="form-select" style="background:var(--bg-elevated);color:white;border:1px solid var(--border-default)">
                <option selected>BRL - Real Brasileiro (R$)</option>
                <option>USD - Dólar Americano ($)</option>
              </select>
            </div>
            <button class="btn btn-primary" onclick="alert('Configurações salvas')">Salvar Configurações</button>
          </div>

          <!-- Security -->
          <div id="set-security" style="display:none">
            <h3 class="card-title" style="margin-bottom:16px">Segurança do Acesso</h3>
            <p class="text-secondary" style="font-size:13px;margin-bottom:16px">O login único é gerenciado pelo <strong>Keycloak IAM Cluster</strong> da infraestrutura OminiSis, suportando MFA (Multi-Factor Authentication) e login corporativo SAML/OIDC.</p>
            <button class="btn btn-ghost" onclick="alert('Acessar Keycloak Console')">Configurar MFA no Keycloak</button>
          </div>

          <!-- Billing -->
          <div id="set-billing" style="display:none">
            <h3 class="card-title" style="margin-bottom:16px">Dados de Faturamento (SaaS)</h3>
            <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border-brand);border-radius:8px;padding:16px;margin-bottom:16px">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary)">Plano Enterprise Modular</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Status: <strong>Ativo</strong> · Próximo vencimento: 15/07/2026</div>
              <div style="font-size:24px;font-weight:800;color:var(--brand-success);margin-top:12px">R$ 4.999,00 <span style="font-size:13px;font-weight:normal;color:var(--text-muted)">/ mês</span></div>
            </div>
            <button class="btn btn-primary" onclick="alert('Histórico de notas fiscais de assinatura')">Gerenciar Cartão / Notas</button>
          </div>
        </div>
      </div>
    </div>
  `;

  window.setTab = (tab, btn) => {
    document.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['general', 'security', 'billing'].forEach(t => {
      const el = document.getElementById(`set-${t}`);
      if (el) el.style.display = t === tab ? '' : 'none';
    });
  };
}
