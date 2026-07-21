// ============================================================
// INVENTORY MODULE — OminiSis Enterprise ERP
// Products, Stock control, warehouse map
// ============================================================

window.renderInventory = async function() {
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div class="animate-in" style="display:flex;flex-direction:column;gap:20px;opacity:0.6">
      <div style="height:80px;background:var(--bg-elevated);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
      <div class="kpi-grid">
        ${Array(4).fill('<div style="height:120px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>').join('')}
      </div>
      <div style="height:400px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
    </div>
  `;

  const invData = await window.API.getInventoryData();
  window.invCache = invData;

  const products = invData.products;
  const criticalItems = products.filter(p => p.stock <= p.minStock);
  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.basePrice), 0);

  content.innerHTML = `
    <div class="animate-in" style="padding-bottom: 60px;">
      <div class="module-header">
        <div>
          <h1 class="module-title">📦 Controle de Estoque & Inventário</h1>
          <p class="module-subtitle">Kardex, armazéns, entradas e saídas físicas</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="inventoryTab('adjustments', document.getElementById('tab-adjustments')); setTimeout(openMovementModal, 100);">🔄 Nova Movimentação</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">📦</div>
          <div class="kpi-value">${products.length}</div>
          <div class="kpi-label">Itens Cadastrados</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">${window.formatCurrency(totalValue)}</div>
          <div class="kpi-label">Valor Ativo em Estoque</div>
        </div>
        <div class="kpi-card ${criticalItems.length > 0 ? 'kpi-danger' : 'kpi-info'}">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-value">${criticalItems.length}</div>
          <div class="kpi-label">Itens Críticos (Abaixo Mínimo)</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">🏢</div>
          <div class="kpi-value">${invData.warehouses.length}</div>
          <div class="kpi-label">Armazéns / Locais</div>
        </div>
      </div>

      <div class="tab-nav" id="inv-tabs">
        <button class="tab-btn active" id="tab-items" onclick="inventoryTab('items', this)">🏷️ Itens & Produtos</button>
        <button class="tab-btn" id="tab-warehouses" onclick="inventoryTab('warehouses', this)">🏢 Armazéns (Endereços)</button>
        <button class="tab-btn" id="tab-adjustments" onclick="inventoryTab('adjustments', this)">📝 Kardex Global & Movimentações</button>
      </div>

      <div id="inv-items">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Saldo de Estoque Atual</h3>
            <div style="font-size:12px; color:var(--text-muted);">Clique em um item para ver seu Kardex.</div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Produto</th>
                  <th>Endereço</th>
                  <th style="text-align:center">Saldo Atual</th>
                  <th style="text-align:center">Mínimo</th>
                  <th style="width: 150px">Status (Nível)</th>
                  <th style="text-align:right">Custo Total</th>
                </tr>
              </thead>
              <tbody>
                ${products.map(p => {
                  const pct = p.minStock ? Math.min(100, Math.max(0, (p.stock / (p.minStock * 2)) * 100)) : 100;
                  const isCritical = p.stock <= p.minStock;
                  return `
                  <tr onclick="openKardex('${p.id}')" style="cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='var(--bg-elevated)'" onmouseout="this.style.background='transparent'">
                    <td><strong>${p.sku}</strong></td>
                    <td>${p.name} <span style="font-size:11px; color:var(--text-muted)">(${p.unit})</span></td>
                    <td><span class="badge badge-muted">${p.location || 'Sem Loc.'}</span></td>
                    <td style="text-align:center; font-size:14px; font-weight:700; color:${isCritical ? 'var(--danger-color)' : 'var(--text-primary)'}">${p.stock}</td>
                    <td style="text-align:center">${p.minStock || '-'}</td>
                    <td>
                      <div style="font-size:11px; margin-bottom:4px; font-weight:600; color:${isCritical ? 'var(--danger-color)' : 'var(--success-color)'}">${isCritical ? 'Crítico' : 'Saudável'}</div>
                      <div style="height: 6px; width: 100%; background: var(--border-color); border-radius: 3px; overflow:hidden;">
                        <div style="height: 100%; width: ${pct}%; background: ${isCritical ? 'var(--danger-color)' : 'var(--success-color)'}; border-radius: 3px;"></div>
                      </div>
                    </td>
                    <td style="text-align:right"><strong>${window.formatCurrency(p.stock * p.basePrice)}</strong></td>
                  </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="inv-warehouses" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Armazéns e Locais de Estoque</h3>
            <button class="btn btn-secondary btn-sm">➕ Novo Armazém</button>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome do Armazém</th>
                  <th>Tipo</th>
                  <th>Localização Física</th>
                  <th>Capacidade Utilizada</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${invData.warehouses.map(w => `
                  <tr>
                    <td><strong>${w.id}</strong></td>
                    <td>${w.name}</td>
                    <td>${w.type}</td>
                    <td>${w.location}</td>
                    <td>
                      <div style="font-size:11px; margin-bottom:4px; font-weight:600;">${w.usage}% ocupado</div>
                      <div style="height: 6px; width: 100px; background: var(--border-color); border-radius: 3px; overflow:hidden;">
                        <div style="height: 100%; width: ${w.usage}%; background: ${w.usage > 90 ? 'var(--danger-color)' : w.usage > 70 ? 'var(--warning-color)' : 'var(--primary-color)'}; border-radius: 3px;"></div>
                      </div>
                    </td>
                    <td>${window.getStatusBadge(w.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="inv-adjustments" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Últimas Movimentações (Kardex Global)</h3>
            <button class="btn btn-primary btn-sm" onclick="openMovementModal()">🔄 Registrar Nova Movimentação</button>
          </div>
          
          <div id="mov-modal" style="display:none; padding: 20px; border-bottom: 1px solid var(--border-color); background: var(--bg-elevated);">
            <h4 style="margin-top:0; color:var(--text-main);">Nova Entrada ou Saída</h4>
            <div style="display:flex; gap:15px; flex-wrap:wrap; align-items:flex-end;">
              <div class="form-group" style="flex:2; min-width: 250px;">
                <label>Produto</label>
                <select id="mov-product" class="form-control">
                  ${products.map(p => `<option value="${p.id}">${p.sku} - ${p.name} (Saldo: ${p.stock})</option>`).join('')}
                </select>
              </div>
              <div class="form-group" style="flex:1; min-width: 150px;">
                <label>Tipo de Movimento</label>
                <select id="mov-type" class="form-control">
                  <option value="in">Entrada (+)</option>
                  <option value="out">Saída (-)</option>
                </select>
              </div>
              <div class="form-group" style="flex:1; min-width: 100px;">
                <label>Quantidade</label>
                <input type="number" id="mov-qty" class="form-control" value="1" min="1">
              </div>
              <div class="form-group" style="flex:2; min-width: 250px;">
                <label>Motivo / Documento</label>
                <input type="text" id="mov-reason" class="form-control" placeholder="Ex: NF-1234, Ajuste Inventário">
              </div>
              <div style="display:flex; gap: 10px; margin-bottom: 2px;">
                <button class="btn btn-ghost" onclick="document.getElementById('mov-modal').style.display='none'">Cancelar</button>
                <button class="btn btn-primary" style="background:var(--success-color);" onclick="saveMovement()">Salvar Movimento</button>
              </div>
            </div>
          </div>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>ID Mov.</th>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th style="text-align:center">Quantidade</th>
                  <th>Motivo / Documento</th>
                  <th>Usuário</th>
                </tr>
              </thead>
              <tbody id="mov-table-body">
                ${renderMovementsRows(invData.movements, products)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  window.inventoryTab = (tab, btn) => {
    document.querySelectorAll('#inv-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    ['items', 'warehouses', 'adjustments'].forEach(t => {
      const el = document.getElementById(`inv-${t}`);
      if (el) el.style.display = t === tab ? '' : 'none';
    });
  };
};

window.renderMovementsRows = (movements, products) => {
  if (movements.length === 0) return `<tr><td colspan="7" style="text-align:center; padding:20px;">Nenhuma movimentação registrada.</td></tr>`;
  return movements.map(m => {
    const p = products.find(prod => prod.id === m.productId);
    const isOut = m.type === 'out';
    return `
      <tr>
        <td><div style="font-size:12px;">${m.date}</div><div style="font-size:11px; color:var(--text-muted)">${m.time}</div></td>
        <td><strong>${m.id}</strong></td>
        <td>${p ? p.sku : m.productId}</td>
        <td><span class="badge ${isOut ? 'badge-warning' : 'badge-success'}">${isOut ? 'Saída' : 'Entrada'}</span></td>
        <td style="text-align:center; font-weight:700; font-size:14px; color:${isOut ? 'var(--warning-color)' : 'var(--success-color)'}">${isOut ? '-' : '+'}${m.qty}</td>
        <td>${m.reason}</td>
        <td style="font-size:12px; color:var(--text-muted)">${m.user}</td>
      </tr>
    `;
  }).join('');
};

window.openMovementModal = () => {
  document.getElementById('mov-modal').style.display = 'block';
};

window.saveMovement = async () => {
  const prodId = document.getElementById('mov-product').value;
  const type = document.getElementById('mov-type').value;
  const qty = document.getElementById('mov-qty').value;
  const reason = document.getElementById('mov-reason').value || 'Ajuste Manual';
  
  if(!qty || qty <= 0) return alert('Quantidade inválida.');
  
  const res = await window.API.addStockMovement(prodId, type, qty, reason);
  if(!res.success) {
    return alert('Erro: ' + res.error);
  }
  
  // Re-render whole module to update KPIs and lists
  await window.renderInventory();
  // Keep tab active
  setTimeout(() => window.inventoryTab('adjustments', document.getElementById('tab-adjustments')), 100);
};

window.openKardex = (productId) => {
  const p = window.invCache.products.find(x => x.id === productId);
  if(!p) return;
  
  const movements = window.invCache.movements.filter(m => m.productId === productId);
  
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="animate-in" style="padding-bottom: 60px; max-width: 900px; margin: 0 auto;">
      <div class="advanced-form-header" style="position:sticky; top:0; z-index:10; background:var(--bg-base); padding: 15px 0; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap: 15px;">
          <button class="btn btn-ghost" onclick="renderInventory()">← Voltar</button>
          <div>
            <h1 class="module-title" style="margin:0; font-size: 24px;">Kardex do Produto</h1>
            <p class="module-subtitle">${p.sku} - ${p.name}</p>
          </div>
        </div>
      </div>
      
      <div class="card" style="padding: 20px; display:flex; gap:30px; margin-bottom:20px; flex-wrap:wrap;">
        <div>
          <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Saldo Atual</div>
          <div style="font-size:32px; font-weight:700; color:${p.stock <= p.minStock ? 'var(--danger-color)' : 'var(--text-primary)'}">${p.stock} <span style="font-size:16px;">${p.unit}</span></div>
        </div>
        <div>
          <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Estoque Mínimo</div>
          <div style="font-size:24px; font-weight:700; color:var(--text-primary)">${p.minStock || 0}</div>
        </div>
        <div>
          <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Endereçamento</div>
          <div style="font-size:24px; font-weight:700; color:var(--text-primary)">${p.location || '-'}</div>
        </div>
        <div>
          <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Custo Unitário</div>
          <div style="font-size:24px; font-weight:700; color:var(--text-primary)">${window.formatCurrency(p.basePrice)}</div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Extrato de Movimentações</h3>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>ID Mov.</th>
                <th>Tipo</th>
                <th style="text-align:center">Quantidade</th>
                <th>Motivo / Documento</th>
                <th>Usuário</th>
              </tr>
            </thead>
            <tbody>
              ${movements.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">Nenhuma movimentação encontrada para este produto.</td></tr>` : 
                movements.map(m => {
                  const isOut = m.type === 'out';
                  return `
                    <tr>
                      <td><div style="font-size:12px;">${m.date}</div><div style="font-size:11px; color:var(--text-muted)">${m.time}</div></td>
                      <td><strong>${m.id}</strong></td>
                      <td><span class="badge ${isOut ? 'badge-warning' : 'badge-success'}">${isOut ? 'Saída' : 'Entrada'}</span></td>
                      <td style="text-align:center; font-weight:700; font-size:14px; color:${isOut ? 'var(--warning-color)' : 'var(--success-color)'}">${isOut ? '-' : '+'}${m.qty}</td>
                      <td>${m.reason}</td>
                      <td style="font-size:12px; color:var(--text-muted)">${m.user}</td>
                    </tr>
                  `;
                }).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};
