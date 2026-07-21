
// ============================================================
// CRM MODULE — OminiSis Enterprise ERP
// Pipeline kanban board, leads table, contact list
// ============================================================

window.formatCurrency = window.formatCurrency || function(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

async function renderCrm() {
  const content = document.getElementById('content');

  // Skeleton Loader
  content.innerHTML = `
    <div class="animate-in" style="display:flex;flex-direction:column;gap:20px;opacity:0.6">
      <div style="height:60px;background:var(--bg-elevated);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
      <div class="kpi-grid">
        ${Array(5).fill('<div style="height:120px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>').join('')}
      </div>
      <div style="height:400px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
    </div>
  `;

  // Simulate API fetch
  const pipeline = await window.API.getCRMData();

  const contacts = [
    { name: 'Ana Beatriz Costa', company: 'TechBR Ltda', email: 'ana@techbr.com', phone: '(11) 99871-2345', stage: 'Cliente', value: 142000 },
    { name: 'Carlos Mendonça', company: 'Grupo Alfa', email: 'carlos@grupoalfa.com.br', phone: '(21) 98765-0011', stage: 'Lead', value: 78000 },
    { name: 'Fernanda Lira', company: 'Minas Comercial', email: 'fernanda@minas.com', phone: '(31) 97654-3210', stage: 'Prospect', value: 234000 },
    { name: 'Roberto Nunes', company: 'Sul Distribuidora', email: 'roberto@suldist.com.br', phone: '(51) 99988-7766', stage: 'Negociação', value: 56000 },
    { name: 'Juliana Ferreira', company: 'Constru Max', email: 'juliana@construmax.com', phone: '(41) 98877-6655', stage: 'Proposta', value: 310000 },
    { name: 'Marcos Alves', company: 'Agro Solutions', email: 'marcos@agrosol.com.br', phone: '(62) 97766-5544', stage: 'Lead', value: 95000 },
    { name: 'Patrícia Souza', company: 'Med Equipamentos', email: 'patricia@medequip.com', phone: '(85) 99655-4433', stage: 'Cliente', value: 420000 },
    { name: 'Diego Martins', company: 'Logtech BR', email: 'diego@logtech.com.br', phone: '(11) 98544-3322', stage: 'Prospect', value: 67000 },
  ];

  // Extract all activities from pipeline
  const allActivities = [];
  DATA.pipeline.forEach(col => {
    col.deals.forEach(deal => {
      if (deal.activities) {
        deal.activities.forEach(act => {
          allActivities.push({ ...act, dealId: deal.id, dealTitle: deal.title, colId: col.id });
        });
      }
    });
  });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const tomorrowStart = todayStart + 86400000;

  const activitiesOverdue = [];
  const activitiesToday = [];
  const activitiesUpcoming = [];

  allActivities.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(act => {
    if (act.status === 'completed') return;
    const actTime = new Date(act.date).getTime();
    if (actTime < todayStart) activitiesOverdue.push(act);
    else if (actTime >= todayStart && actTime < tomorrowStart) activitiesToday.push(act);
    else activitiesUpcoming.push(act);
  });

  const renderActivityGroup = (groupTitle, arr, icon, color) => {
    if (!arr.length) return '';
    return `
      <div style="margin-top: 16px;">
        <h4 style="color: ${color}; margin-bottom: 8px; font-size: 13px; display: flex; align-items: center; gap: 6px;">${icon} ${groupTitle}</h4>
        ${arr.map(a => `
          <div style="display:flex;align-items:center;gap:1rem;padding:0.875rem;border-bottom:1px solid var(--border-color)">
            <div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">
              ${a.type === 'system' ? '⚙️' : (a.type === 'success' ? '✅' : '👤')}
            </div>
            <div style="flex:1">
              <div style="font-weight:500;color:var(--text-primary)">${a.text}</div>
              <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px">Negócio: <strong style="cursor:pointer; color:var(--brand-primary)" onclick="openEditLeadModal(${a.dealId}, '${a.colId}')">${a.dealTitle}</strong> • ${new Date(a.date).toLocaleString()}</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="openEditLeadModal(${a.dealId}, '${a.colId}')">Ver Negócio</button>
          </div>
        `).join('')}
      </div>
    `;
  };

  const totalPipeline = contacts.reduce((s, c) => s + c.value, 0);

  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">🤝 CRM & Relacionamento</h1>
          <p class="module-subtitle">Gestão de leads, pipeline de vendas e relacionamento com clientes</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-secondary btn-sm" onclick="alert('Importar CSV')">📥 Importar</button>
          <button class="btn btn-primary btn-sm" onclick="openAddLeadModal()">➕ Novo Lead</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">🎯</div>
          <div class="kpi-value">${formatCurrency(totalPipeline)}</div>
          <div class="kpi-label">Pipeline Total</div>
          <div class="kpi-trend up">↑ 18% este mês</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">✅</div>
          <div class="kpi-value">R$ 562k</div>
          <div class="kpi-label">Fechado no Mês</div>
          <div class="kpi-trend up">↑ 24% vs mês ant.</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">⏳</div>
          <div class="kpi-value">34%</div>
          <div class="kpi-label">Taxa de Conversão</div>
          <div class="kpi-trend up">↑ 3pp este mês</div>
        </div>
        <div class="kpi-card kpi-info">
          <div class="kpi-icon">👥</div>
          <div class="kpi-value">${contacts.length}</div>
          <div class="kpi-label">Contatos Ativos</div>
          <div class="kpi-trend up">↑ 5 novos</div>
        </div>
        <div class="kpi-card kpi-danger">
          <div class="kpi-icon">🔥</div>
          <div class="kpi-value">12</div>
          <div class="kpi-label">Oportunidades Quentes</div>
          <div class="kpi-trend up">↑ 2 esta semana</div>
        </div>
      </div>

      <div class="tab-nav" id="crm-tabs">
        <button class="tab-btn active" onclick="crmTab('pipeline', this)">📊 Pipeline</button>
        <button class="tab-btn" onclick="crmTab('contacts', this)">👤 Contatos</button>
        <button class="tab-btn" onclick="crmTab('activities', this)">📋 Atividades</button>
      </div>

      <div id="crm-pipeline">
        <div class="pipeline-board" id="pipeline-board">
            ${pipeline.map(col => `
              <div class="pipeline-column" id="col-${col.id}" ondragover="handleDragOver(event)" ondrop="handleDrop(event, '${col.id}')">
                <div class="pipeline-col-header" style="border-top: 2px solid ${col.color || 'var(--brand-primary)'}">
                <span class="pipeline-col-title">${col.title}</span>
                <span class="badge badge-muted">${col.deals.length}</span>
              </div>
              ${col.deals.map((deal, dealIndex) => `
                <div class="deal-card animate-in" style="animation-delay: ${dealIndex * 0.05}s;" draggable="true" ondragstart="handleDragStart(event, ${deal.id}, '${col.id}')" ondragend="this.style.opacity='1'">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h4 class="deal-title" style="cursor: pointer; color: var(--brand-primary);" onclick="openEditLeadModal(${deal.id}, '${col.id}')">${deal.title}</h4>
                    <button class="btn btn-ghost btn-sm" onclick="openEditLeadModal(${deal.id}, '${col.id}')" style="padding: 2px 6px; font-size: 10px;">✏️</button>
                  </div>
                  <div class="deal-value" onclick="openEditLeadModal(${deal.id}, '${col.id}')" style="cursor: pointer;">${formatCurrency(deal.value)}</div>
                  <div class="deal-meta">
                    <span>🏢 ${deal.company}</span>
                    <span class="badge badge-muted">${deal.days}d</span>
                  </div>
                </div>
              `).join('')}
              <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:8px" onclick="alert('Adicionar deal')">+ Adicionar</button>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="crm-contacts" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">👤 Lista de Contatos</h3>
            <input type="text" placeholder="🔍 Buscar contato..." class="btn btn-ghost btn-sm" style="width:220px;cursor:text" />
          </div>
          <div class="table-container">
            <table>
              <thead><tr>
                <th>Nome</th><th>Empresa</th><th>Email</th><th>Telefone</th><th>Estágio</th><th>Valor Estimado</th><th>Ações</th>
              </tr></thead>
              <tbody>
                ${contacts.map(c => `
                  <tr>
                    <td><strong>${c.name}</strong></td>
                    <td>${c.company}</td>
                    <td>${c.email}</td>
                    <td>${c.phone}</td>
                    <td>${getStatusBadge(c.stage)}</td>
                    <td><strong>${formatCurrency(c.value)}</strong></td>
                    <td>
                      <button class="btn btn-ghost btn-sm" onclick="alert('Editar ${c.name}')">✏️</button>
                      <button class="btn btn-ghost btn-sm" onclick="alert('Ligar para ${c.name}')">📞</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="crm-activities" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📋 Lista de Atividades do CRM</h3>
          </div>
          <div style="padding:1rem">
            ${allActivities.length === 0 ? '<div style="color: var(--text-muted); text-align: center; margin-top: 20px;">Nenhuma atividade no CRM.</div>' : ''}
            ${renderActivityGroup('Vencidas', activitiesOverdue, '⚠️', '#ef4444')}
            ${renderActivityGroup('Hoje', activitiesToday, '📅', '#10b981')}
            ${renderActivityGroup('Próximas', activitiesUpcoming, '🗓️', '#6366f1')}
          </div>
        </div>
      </div>
    </div>
  `;

  window.crmTab = (tab, btn) => {
    document.querySelectorAll('#crm-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['pipeline', 'contacts', 'activities'].forEach(t => {
      const el = document.getElementById(`crm-${t}`);
      if (el) el.style.display = t === tab ? '' : 'none';
    });
  };

  window.openAddLeadModal = () => {
    // alert('Abrindo modal...'); // fallback for debugging
    const modalHtml = `
      <div class="modal-header">
        <h3 class="modal-title">Novo Lead</h3>
        <button class="modal-close" onclick="hideAppModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Título do Negócio</label>
          <input type="text" id="lead-title" class="form-control" placeholder="Ex: Implantação ERP">
        </div>
        <div class="form-group">
          <label>Empresa</label>
          <input type="text" id="lead-company" class="form-control" placeholder="Ex: Acme Corp">
        </div>
        <div class="form-group">
          <label>Valor Estimado (R$)</label>
          <input type="number" id="lead-value" class="form-control" placeholder="Ex: 50000">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="hideAppModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="submitLead()" id="btn-save-lead">Salvar Lead</button>
      </div>
    `;
    
    if (typeof window.showAppModal === 'function') {
      window.showAppModal(modalHtml);
    } else {
      alert('Erro grave: showAppModal não está definido no window. Atualize a página com Ctrl+F5.');
    }
  };

  window.submitLead = async () => {
    const btn = document.getElementById('btn-save-lead');
    const title = document.getElementById('lead-title').value;
    const company = document.getElementById('lead-company').value;
    const value = document.getElementById('lead-value').value;
    
    if(!title || !company) return alert('Preencha título e empresa');

    btn.innerHTML = 'Salvando...';
    btn.disabled = true;

    await window.API.addLead({ title, company, value });
    window.hideAppModal();
    // Re-render whole module to reflect state change
    renderCrm();
  };

  // Drag and Drop Logic
  window.handleDragStart = (e, dealId, colId) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ dealId, colId }));
    setTimeout(() => e.target.style.opacity = '0.4', 10);
  };

  window.handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  window.handleDrop = async (e, targetColId) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('text/plain');
    if (!dataStr) return;
    try {
      const { dealId, colId } = JSON.parse(dataStr);
      if (colId !== targetColId) {
        await window.API.moveLead(dealId, colId, targetColId);
        renderCrm();
      }
    } catch (err) {
      console.error('Drag and drop erro:', err);
    }
  };

  window.openEditLeadModal = (dealId, colId) => {
    const col = DATA.pipeline.find(c => c.id === colId);
    const deal = col.deals.find(d => d.id == dealId);
    if (!deal) return;
    
    // Ensure nested objects exist
    const contact = deal.contact || { name: '', phone: '', email: '', address: '' };
    const activities = deal.activities || [];

    const pipelineOptions = DATA.pipeline.map(c => 
      `<option value="${c.id}" ${c.id === colId ? 'selected' : ''}>${c.title}</option>`
    ).join('');
    
    const pipelineTracker = DATA.pipeline.map((c, idx) => {
      const colIndex = DATA.pipeline.findIndex(col => col.id === colId);
      let state = '';
      if (c.id === colId) state = 'active';
      else if (idx < colIndex) state = 'past';
      return `<div class="tracker-stage ${state}" onclick="updateLeadColumn(${deal.id}, '${colId}', '${c.id}')">${c.title}</div>`;
    }).join('');
    
    const activitiesHtml = activities.map(act => {
      const isCompleted = act.status === 'completed';
      const completeBtn = (act.type === 'user' && !isCompleted) 
        ? `<button class="btn btn-ghost btn-sm" style="color: var(--brand-success); padding: 0 4px;" onclick="completeActivity(${deal.id}, '${colId}', ${act.id})" title="Marcar como concluída">✔</button>`
        : (isCompleted ? `<span style="color: var(--brand-success); font-size: 11px;">✅ Concluída em ${new Date(act.completedAt).toLocaleDateString()}</span>` : '');
        
      return `
      <div class="timeline-item" style="${isCompleted ? 'opacity: 0.7;' : ''}">
        <div class="timeline-icon ${act.type}">
          ${act.type === 'system' ? '⚙️' : (act.type === 'success' ? '✅' : '👤')}
        </div>
        <div class="timeline-content">
          <div class="timeline-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="timeline-author">${act.type === 'system' ? 'Sistema' : 'Você'}</span>
              <span class="timeline-date">${new Date(act.date).toLocaleString()}</span>
            </div>
            ${completeBtn}
          </div>
          <div class="timeline-text" style="${isCompleted ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${act.text}</div>
        </div>
      </div>
      `;
    }).join('');

    const modalHtml = `
      <div class="modal-header">
        <h3 class="modal-title">${deal.title} <span style="color: var(--text-muted); font-size: 14px; font-weight: 400;">— Negócio #${deal.id}</span></h3>
        <button class="modal-close" onclick="hideAppModal()">×</button>
      </div>
      
      <div class="lead-pipeline-tracker">
        ${pipelineTracker}
      </div>

      <div class="lead-layout">
        <!-- LEFT PANE -->
        <div class="lead-left-pane">
          <div class="lead-section">
            <h4>Sobre o negócio <span style="color: var(--brand-primary); cursor: pointer;">editar</span></h4>
            
            <div class="form-group">
              <label>Nome</label>
              <input type="text" id="edit-lead-title" class="form-control" value="${deal.title}">
            </div>
            
            <div class="form-group" style="display: flex; gap: 16px;">
              <div style="flex: 1;">
                <label>Etapa</label>
                <select id="edit-lead-col" class="form-control">
                  ${pipelineOptions}
                </select>
              </div>
              <div style="flex: 1;">
                <label>Valor e moeda</label>
                <input type="number" id="edit-lead-value" class="form-control" value="${deal.value}">
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
              <div>
                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Total do negócio</div>
                <div style="font-size: 24px; font-weight: 600;">${window.formatCurrency(deal.value)}</div>
              </div>
              <button class="btn btn-primary" onclick="submitEditLead(${deal.id}, '${colId}')" id="btn-edit-lead">Salvar Dados</button>
            </div>
          </div>
          
          <div class="lead-section">
            <h4>Cliente <span style="color: var(--brand-primary); cursor: pointer;">editar</span></h4>
            
            <div style="margin-bottom: 24px;">
              <div style="font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px;">Contato</div>
              <div class="contact-input-group">
                <span>👤</span> <input type="text" id="edit-lead-contact-name" placeholder="Nome do contato" value="${contact.name || ''}">
              </div>
              <div class="contact-input-group">
                <span>📞</span> <input type="text" id="edit-lead-contact-phone" placeholder="Telefone" value="${contact.phone || ''}">
              </div>
              <div class="contact-input-group">
                <span>✉️</span> <input type="text" id="edit-lead-contact-email" placeholder="E-mail" value="${contact.email || ''}">
              </div>
              <div class="contact-input-group">
                <span>📍</span> <input type="text" id="edit-lead-contact-address" placeholder="Endereço (Rua, Avenida, etc.)" value="${contact.address || ''}">
              </div>
              <div class="contact-input-group">
                <span>🔢</span> <input type="text" id="edit-lead-contact-number" placeholder="Número e Complemento" value="${contact.number || ''}">
              </div>
              <div class="contact-input-group">
                <span>🏘️</span> <input type="text" id="edit-lead-contact-neighborhood" placeholder="Bairro" value="${contact.neighborhood || ''}">
              </div>
              <div class="contact-input-group">
                <span>🏙️</span> <input type="text" id="edit-lead-contact-city" placeholder="Cidade" value="${contact.city || ''}">
              </div>
              <div class="contact-input-group">
                <span>🗺️</span> <input type="text" id="edit-lead-contact-state" placeholder="Estado" value="${contact.state || ''}">
              </div>
              <div class="contact-input-group">
                <span>🌍</span> <input type="text" id="edit-lead-contact-country" placeholder="País" value="${contact.country || ''}">
              </div>
            </div>
            
            <div>
              <div style="font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px;">Empresa</div>
              <div class="contact-input-group">
                <span>🏢</span> <input type="text" id="edit-lead-company" placeholder="Nome da empresa" value="${deal.company}">
              </div>
            </div>
          </div>
          
          <div style="text-align: right;">
             <button class="btn btn-ghost" onclick="deleteLead(${deal.id}, '${colId}')" style="color: #ef4444; font-size: 12px;">Excluir Negócio</button>
          </div>
        </div>

        <!-- RIGHT PANE -->
        <div class="lead-right-pane">
          <div class="activity-tabs">
            <div class="activity-tab active">Atividade</div>
            <div class="activity-tab">Comentário</div>
            <div class="activity-tab">Mensagem</div>
            <div class="activity-tab">Agendamento</div>
            <div class="activity-tab">Tarefa</div>
          </div>
          
          <div class="activity-input-area">
            <textarea id="new-activity-text" class="activity-textarea" placeholder="Adicionar uma nova atividade. Planeje sua próxima ação no negócio para nunca esquecer o cliente."></textarea>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="datetime-local" id="new-activity-date" class="form-control" style="font-size: 12px; padding: 4px 8px; width: 180px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: var(--text-primary);" />
              </div>
              <button class="btn btn-success" onclick="saveActivity(${deal.id}, '${colId}')" id="btn-save-activity">Salvar Atividade</button>
            </div>
          </div>
          
          <div class="timeline-feed" id="timeline-container-${deal.id}">
             ${activitiesHtml.length ? activitiesHtml : '<div style="color: var(--text-muted); text-align: center; margin-top: 20px;">Nenhuma atividade registrada ainda.</div>'}
          </div>
        </div>
      </div>
    `;
    
    if (typeof window.showAppModal === 'function') {
      window.showAppModal(modalHtml, 'modal-box-xl');
    }
  };

  window.saveActivity = async (dealId, colId) => {
    const input = document.getElementById('new-activity-text');
    const dateInput = document.getElementById('new-activity-date');
    const text = input.value.trim();
    if (!text) return alert('Digite a atividade ou observação.');
    
    let activityDate = dateInput && dateInput.value ? new Date(dateInput.value).toISOString() : new Date().toISOString();
    
    const btn = document.getElementById('btn-save-activity');
    btn.innerHTML = 'Salvando...';
    btn.disabled = true;
    
    await window.API.addActivity(dealId, colId, text, activityDate);
    
    // Refresh modal to show new timeline entry
    window.openEditLeadModal(dealId, colId);
    
    // Refresh background CRM view
    renderCrm();
  };

  window.completeActivity = async (dealId, colId, activityId) => {
    await window.API.completeActivity(dealId, colId, activityId);
    window.openEditLeadModal(dealId, colId);
    renderCrm();
  };
  
  window.updateLeadColumn = async (dealId, oldColId, newColId) => {
    if (oldColId === newColId) return;
    await window.API.moveLead(dealId, oldColId, newColId);
    window.openEditLeadModal(dealId, newColId);
    renderCrm();
  };

  window.submitEditLead = async (dealId, oldColId) => {
    const btn = document.getElementById('btn-edit-lead');
    const title = document.getElementById('edit-lead-title').value;
    const company = document.getElementById('edit-lead-company').value;
    const value = document.getElementById('edit-lead-value').value;
    const newColId = document.getElementById('edit-lead-col').value;
    
    const contact = {
      name: document.getElementById('edit-lead-contact-name').value,
      phone: document.getElementById('edit-lead-contact-phone').value,
      email: document.getElementById('edit-lead-contact-email').value,
      address: document.getElementById('edit-lead-contact-address').value,
      number: document.getElementById('edit-lead-contact-number').value,
      neighborhood: document.getElementById('edit-lead-contact-neighborhood').value,
      city: document.getElementById('edit-lead-contact-city').value,
      state: document.getElementById('edit-lead-contact-state').value,
      country: document.getElementById('edit-lead-contact-country').value
    };
    
    if(!title || !company) return alert('Preencha título e empresa');

    btn.innerHTML = 'Salvando...';
    btn.disabled = true;

    await window.API.updateLead(dealId, oldColId, newColId, { title, company, value, contact });
    window.hideAppModal();
    renderCrm();
  };

  window.deleteLead = async (dealId, colId) => {
    if (confirm('Tem certeza que deseja excluir este lead? Essa ação não pode ser desfeita.')) {
      await window.API.deleteLead(dealId, colId);
      window.hideAppModal();
      renderCrm();
    }
  };
}
