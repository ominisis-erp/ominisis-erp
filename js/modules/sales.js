// ============================================================
// SALES MODULE — OminiSis Enterprise ERP
// Orders table, quotation list, revenue chart, commission tracking
// ============================================================

window.renderSales = async function() {
  const content = document.getElementById('content');

  // Skeleton Loader
  content.innerHTML = `
    <div class="animate-in" style="display:flex;flex-direction:column;gap:20px;opacity:0.6">
      <div style="height:80px;background:var(--bg-elevated);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
      <div class="kpi-grid">
        ${Array(5).fill('<div style="height:120px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>').join('')}
      </div>
      <div style="height:400px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
    </div>
  `;

  const salesData = await window.API.getSalesData();
  const orders = salesData.orders;
  const quotations = salesData.quotations;
  const sellers = salesData.sellers;
  const revenueData = salesData.revenueChart || [320, 415, 380, 490, 520, 445, 610, 575, 680, 720, 695, 810];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.value, 0);
  const totalOrders = orders.length;
  const avgTicket = totalOrders ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length : 0;

  content.innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">💰 Vendas & Pedidos</h1>
          <p class="module-subtitle">Gestão de pedidos, cotações, metas e comissões de vendas</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-secondary btn-sm" onclick="alert('Exportar relatório (simulado)')">📤 Exportar</button>
          <button class="btn btn-primary btn-sm" onclick="renderAdvancedForm('order')">➕ Novo Pedido</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">💵</div>
          <div class="kpi-value">${window.formatCurrency(totalRevenue)}</div>
          <div class="kpi-label">Receita Acumulada</div>
          <div class="kpi-trend up">↑ 12% vs mês ant.</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">📦</div>
          <div class="kpi-value">${totalOrders}</div>
          <div class="kpi-label">Total de Pedidos</div>
          <div class="kpi-trend up">↑ Crescente</div>
        </div>
        <div class="kpi-card kpi-info">
          <div class="kpi-icon">🎫</div>
          <div class="kpi-value">${window.formatCurrency(avgTicket)}</div>
          <div class="kpi-label">Ticket Médio</div>
          <div class="kpi-trend up">↑ 8% vs mês ant.</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">🎯</div>
          <div class="kpi-value">87%</div>
          <div class="kpi-label">Meta do Mês</div>
          <div class="kpi-trend up">↑ Em dia</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">🏆</div>
          <div class="kpi-value">R$ 51,3k</div>
          <div class="kpi-label">Comissões Geradas</div>
          <div class="kpi-trend up">↑ 15% vs mês ant.</div>
        </div>
      </div>

      <div class="tab-nav" id="sales-tabs">
        <button class="tab-btn active" onclick="salesTab('orders', this)">📋 Pedidos</button>
        <button class="tab-btn" onclick="salesTab('quotations', this)">📄 Cotações</button>
        <button class="tab-btn" onclick="salesTab('revenue', this)">📈 Receita</button>
        <button class="tab-btn" onclick="salesTab('commissions', this)">💎 Comissões</button>
      </div>

      <div id="sales-orders">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📋 Pedidos de Venda</h3>
          </div>
          <div class="table-container">
            <table>
              <thead><tr>
                <th>Nº Pedido</th><th>Cliente</th><th>Itens</th><th>Valor</th><th>Vendedor</th><th>Data</th><th>Status</th><th>Ações</th>
              </tr></thead>
              <tbody>
                ${orders.map(o => `
                  <tr style="cursor:pointer" onclick="renderAdvancedForm('order', '${o.id}')">
                    <td><strong>${o.id}</strong></td>
                    <td>${o.client}</td>
                    <td><span class="badge badge-muted">${o.items} itens</span></td>
                    <td><strong>${window.formatCurrency(o.value)}</strong></td>
                    <td>${o.seller}</td>
                    <td>${o.date}</td>
                    <td>${getStatusBadge(o.status)}</td>
                    <td onclick="event.stopPropagation()">
                      <button class="btn btn-ghost btn-sm" onclick="printOrder('${o.id}')" title="Imprimir Pedido">🖨️</button>
                      ${o.status === 'pending' || o.status === 'approved' ? `<button class="btn btn-ghost btn-sm" onclick="invoiceOrder('${o.id}')" title="Faturar Pedido">🧾</button>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="sales-quotations" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📄 Orçamentos e Cotações</h3>
            <button class="btn btn-primary btn-sm" onclick="renderAdvancedForm('quotation')">➕ Nova Cotação</button>
          </div>
          <div class="table-container">
            <table>
              <thead><tr>
                <th>Nº Cotação</th><th>Cliente</th><th>Valor</th><th>Vendedor</th><th>Validade</th><th>Status</th><th>Ações</th>
              </tr></thead>
              <tbody>
                ${quotations.map(q => `
                  <tr style="cursor:pointer" onclick="renderAdvancedForm('quotation', '${q.id}')">
                    <td><strong>${q.id}</strong></td>
                    <td>${q.client}</td>
                    <td><strong>${window.formatCurrency(q.value)}</strong></td>
                    <td>${q.seller}</td>
                    <td>${q.validity}</td>
                    <td>${getStatusBadge(q.status)}</td>
                    <td onclick="event.stopPropagation()">
                      <button class="btn btn-ghost btn-sm" onclick="printOrder('${q.id}')" title="Imprimir Cotação">🖨️</button>
                      ${q.status !== 'converted' ? `<button class="btn btn-primary btn-sm" onclick="convertQuotation('${q.id}', '${q.client}', ${q.value}, '${q.seller}')">Converter</button>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="sales-revenue" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📈 Receita por Período</h3>
            <select class="btn btn-ghost btn-sm" style="cursor:pointer"><option>2024</option><option>2023</option></select>
          </div>
          <div style="padding:1rem">
            <canvas id="revenueChart" height="280"></canvas>
          </div>
        </div>
      </div>

      <div id="sales-commissions" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">💎 Comissões por Vendedor</h3>
          </div>
          <div style="padding:1rem;display:flex;flex-direction:column;gap:1rem">
            ${sellers.map(s => `
              <div style="padding:1rem;background:var(--bg-card);border-radius:8px;border:1px solid var(--border-color)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
                  <div>
                    <strong style="color:var(--text-primary)">${s.name}</strong>
                    <span class="badge badge-muted" style="margin-left:8px">${s.sales} vendas</span>
                  </div>
                  <div style="text-align:right">
                    <div style="font-weight:700;color:var(--accent-green)">${window.formatCurrency(s.commission)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted)">comissão (3%)</div>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">
                  <span>Meta: ${window.formatCurrency(s.target)}</span>
                  <span>${s.pct}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill ${s.pct >= 100 ? 'progress-fill-success' : s.pct >= 80 ? 'progress-fill-primary' : 'progress-fill-warning'}" style="width:${Math.min(s.pct, 100)}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  window.salesTab = (tab, btn) => {
    document.querySelectorAll('#sales-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['orders', 'quotations', 'revenue', 'commissions'].forEach(t => {
      const el = document.getElementById(`sales-${t}`);
      if (el) el.style.display = t === tab ? '' : 'none';
    });
    if (tab === 'revenue') {
      requestAnimationFrame(() => {
        const canvas = document.getElementById('revenueChart');
        if (canvas && window.Charts) {
          Charts.drawLineChart(canvas, months, revenueData, { color: '#6366f1', label: 'Receita (R$ mil)' });
        }
      });
    }
  };

  requestAnimationFrame(() => {
    const canvas = document.getElementById('revenueChart');
    if (canvas && window.Charts) {
      Charts.drawLineChart(canvas, months, revenueData, { color: '#6366f1', label: 'Receita (R$ mil)' });
    }
  });
};

// ============================================================
// Sales Interactivity Functions
// ============================================================

window.renderAdvancedForm = async (type = 'order', existingId = null) => {
  const masterData = await window.API.getMasterData();
  const customers = masterData.customers;
  const products = masterData.products;

  let existingRecord = null;
  if (existingId) {
    const salesData = await window.API.getSalesData();
    const list = type === 'quotation' ? salesData.quotations : salesData.orders;
    existingRecord = list.find(x => x.id === existingId);
  }

  const content = document.getElementById('content');
  const orderId = existingId || `12${Math.floor(Math.random() * 1000)}`;

  window.advancedOrderState = {
    items: [],
    products: products
  };

  content.innerHTML = `
    <div class="animate-in" style="padding-bottom: 60px;">
      <div class="advanced-form-header">
        <h1 class="advanced-form-title">${type === 'quotation' ? 'Cotação' : 'Pedido de venda'} - ${existingId || orderId}</h1>
        <div style="display:flex;gap:12px">
          <button class="btn btn-ghost" onclick="renderSales()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveAdvancedOrder('${type}', '${existingId || orderId}')">Salvar</button>
        </div>
      </div>
      <p style="text-align:right;font-size:11px;color:var(--brand-danger);margin-top:-16px;margin-bottom:24px">(*) Campos obrigatórios</p>

      <!-- Dados do cliente -->
      <div class="advanced-section">
        <h3 class="advanced-section-title">Dados do cliente</h3>
        <div class="form-grid form-grid-4">
          <div class="form-group">
            <label>Cliente <span style="color:red">*</span></label>
            <select id="adv-cliente" class="form-control">
              <option value="">Selecione...</option>
              ${customers.map(c => `<option value="${c.id}" ${existingRecord && existingRecord.client === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Vendedor</label>
            <select id="adv-vendedor" class="form-control">
              <option ${existingRecord && existingRecord.seller === 'Lucas M.' ? 'selected' : ''}>Lucas M.</option>
              <option ${existingRecord && existingRecord.seller === 'Ana S.' ? 'selected' : ''}>Ana S.</option>
              <option ${existingRecord && existingRecord.seller === 'Pedro R.' ? 'selected' : ''}>Pedro R.</option>
              <option ${existingRecord && existingRecord.seller === 'Carla T.' ? 'selected' : ''}>Carla T.</option>
            </select>
          </div>
          <div class="form-group">
            <label>Loja</label>
            <select class="form-control">
              <option>Nenhuma</option>
              <option>Amazon</option>
              <option>Loja Virtual IntegraCommerce</option>
              <option>Ominicom</option>
            </select>
          </div>
          <div class="form-group">
            <label>Unidade de negócio</label>
            <select class="form-control"><option>Nenhuma unidade de negócio</option></select>
          </div>
        </div>
        <div class="form-grid form-grid-4" style="margin-top:16px">
          <div class="form-group">
            <label>Lista de preço</label>
            <select class="form-control"><option>Selecione uma lista</option></select>
          </div>
        </div>
      </div>

      <!-- Abas (Itens / Comissões) -->
      <div class="tab-nav" style="margin-bottom:0;border-bottom:2px solid var(--border-subtle)">
        <button class="tab-btn active" style="border-bottom:2px solid var(--brand-success);margin-bottom:-2px">Itens do ${type === 'quotation' ? 'orçamento' : 'pedido'}</button>
        <button class="tab-btn" onclick="alert('Aba comissões em desenvolvimento')">Comissões</button>
      </div>

      <!-- Tabela de itens -->
      <div class="advanced-section" style="margin-top:16px">
        <div class="table-container" style="overflow:visible">
          <table style="width:100%; border-collapse:collapse">
            <thead>
              <tr style="border-bottom:1px solid var(--border-subtle); color:var(--text-muted); font-size:12px; text-align:left">
                <th style="padding:12px;width:40px"></th>
                <th style="padding:12px;width:30%">Descrição</th>
                <th style="padding:12px">Código</th>
                <th style="padding:12px">Un</th>
                <th style="padding:12px">Quantidade</th>
                <th style="padding:12px">Preço lista</th>
                <th style="padding:12px">Desc (%)</th>
                <th style="padding:12px">Preço un</th>
                <th style="padding:12px">Preço total</th>
                <th style="padding:12px;width:40px"></th>
              </tr>
            </thead>
            <tbody id="adv-items-body">
              <!-- Itens injetados via JS -->
            </tbody>
          </table>
        </div>
        <div style="text-align:right; margin-top:12px">
          <button class="btn btn-ghost btn-sm" style="color:var(--brand-success)" onclick="addAdvancedOrderItem()">+ Adicionar outro item</button>
        </div>
      </div>

      <!-- Totais -->
      <div class="advanced-section">
        <h3 class="advanced-section-title">Totais</h3>
        <div class="totals-grid">
          <div class="total-box"><span class="total-label">Nº de itens</span><input type="text" id="tot-items" class="total-value" readonly value="0"></div>
          <div class="total-box"><span class="total-label">Soma das quantidades</span><input type="text" id="tot-qty" class="total-value" readonly value="0,00"></div>
          <div class="total-box"><span class="total-label">Desconto</span><input type="text" id="tot-disc" class="total-value" readonly value="0,00"></div>
          <div class="total-box"><span class="total-label">Prazo de entrega</span><input type="text" class="total-value" readonly value="0"></div>
          <div class="total-box"><span class="total-label">Outras despesas</span><input type="text" class="total-value" readonly value="0,00"></div>
          
          <div class="total-box"><span class="total-label">Desconto total da venda</span><input type="text" class="total-value" readonly value="0,00"></div>
          <div class="total-box"><span class="total-label">Total de comissões</span><input type="text" class="total-value" readonly value="0,00"></div>
          <div class="total-box"><span class="total-label">Desconto total dos itens</span><input type="text" class="total-value" readonly value="0,00"></div>
          <div class="total-box"><span class="total-label">Total dos itens</span><input type="text" id="tot-subtotal" class="total-value" readonly value="0,00"></div>
          <div class="total-box" style="background:rgba(16,185,129,0.05)"><span class="total-label">Total da venda</span><input type="text" id="tot-grand" class="total-value highlight" readonly value="0,00"></div>
        </div>
      </div>

      <!-- Detalhes, Pagamento, etc... -->
      <div class="form-grid form-grid-5" style="margin-top:32px">
        <div class="form-group"><label>Número</label><input type="text" class="form-control" value="${existingId || orderId}" readonly></div>
        <div class="form-group"><label>Data ${type === 'quotation' ? 'da cotação' : 'da venda'}</label><input type="date" class="form-control" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group"><label>Data saída</label><input type="date" class="form-control" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group"><label>Data prevista</label><input type="date" class="form-control"></div>
        <div class="form-group"><label>${type === 'quotation' ? 'Validade' : 'Pedido de compra'}</label><input type="text" class="form-control"></div>
      </div>

      <!-- Observações -->
      <div class="advanced-section" style="margin-top:32px">
        <h3 class="advanced-section-title">Dados adicionais</h3>
        <div class="form-group">
          <label>Observações do ${type === 'quotation' ? 'orçamento' : 'pedido'}</label>
          <textarea class="form-control" style="min-height: 100px;" placeholder="Digite aqui as observações gerais que sairão na impressão..."></textarea>
        </div>
      </div>

    </div>
  `;

  if (existingRecord) {
    const totalItems = Math.min(Number(existingRecord.items) || 1, 5); // Limit mock items to 5
    for(let i=0; i<totalItems; i++) {
      addAdvancedOrderItem(existingRecord.value / totalItems);
    }
  } else {
    // Adiciona a primeira linha vazia
    addAdvancedOrderItem();
  }
};

window.addAdvancedOrderItem = (mockValue = null) => {
  const tbody = document.getElementById('adv-items-body');
  const index = window.advancedOrderState.items.length;
  
  let initialSku = '';
  let initialPrice = 0;
  if (mockValue !== null && window.advancedOrderState.products.length > 0) {
    const randomProduct = window.advancedOrderState.products[Math.floor(Math.random() * window.advancedOrderState.products.length)];
    initialSku = randomProduct.sku;
    initialPrice = mockValue;
  }

  const item = { sku: initialSku, qty: 1, price: initialPrice, discount: 0 };
  window.advancedOrderState.items.push(item);
  
  const options = window.advancedOrderState.products.map(p => `<option value="${p.sku}" data-price="${p.basePrice}" ${p.sku === initialSku ? 'selected' : ''}>${p.name}</option>`).join('');

  const tr = document.createElement('tr');
  tr.id = `adv-row-${index}`;
  tr.style.borderBottom = '1px solid var(--border-subtle)';
  tr.innerHTML = `
    <td style="padding:8px"><div style="background:var(--bg-elevated);width:24px;height:24px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--text-muted)">${index + 1}</div></td>
    <td style="padding:8px"><select class="table-input" onchange="advItemChange(${index}, 'sku', this)"><option value="">Selecione o produto...</option>${options}</select></td>
    <td style="padding:8px"><input type="text" id="adv-cod-${index}" class="table-input" readonly value="${initialSku}"></td>
    <td style="padding:8px"><input type="text" class="table-input" value="UN" readonly></td>
    <td style="padding:8px"><input type="number" class="table-input" value="1" min="1" onchange="advItemChange(${index}, 'qty', this)" onkeyup="advItemChange(${index}, 'qty', this)"></td>
    <td style="padding:8px"><input type="text" id="adv-price-${index}" class="table-input" readonly value="${initialPrice.toFixed(2).replace('.',',')}"></td>
    <td style="padding:8px"><input type="number" class="table-input" value="0" min="0" max="100" onchange="advItemChange(${index}, 'discount', this)" onkeyup="advItemChange(${index}, 'discount', this)"></td>
    <td style="padding:8px"><input type="text" id="adv-net-${index}" class="table-input" readonly value="${initialPrice.toFixed(2).replace('.',',')}"></td>
    <td style="padding:8px;background:var(--bg-elevated)"><input type="text" id="adv-total-${index}" class="table-input" readonly value="${initialPrice.toFixed(2).replace('.',',')}" style="font-weight:bold"></td>
    <td style="padding:8px;text-align:center"><button class="btn btn-ghost btn-sm" style="color:var(--brand-danger)" onclick="advRemoveItem(${index})">🗑</button></td>
  `;
  tbody.appendChild(tr);
  advCalculateTotals();
};

window.advItemChange = (index, field, el) => {
  const item = window.advancedOrderState.items[index];
  if (field === 'sku') {
    const sel = el.options[el.selectedIndex];
    item.sku = el.value;
    item.price = Number(sel.getAttribute('data-price')) || 0;
    document.getElementById(`adv-cod-${index}`).value = item.sku;
    document.getElementById(`adv-price-${index}`).value = item.price.toFixed(2).replace('.',',');
  } else if (field === 'qty') {
    item.qty = Number(el.value) || 1;
  } else if (field === 'discount') {
    item.discount = Number(el.value) || 0;
  }

  const netPrice = item.price * (1 - (item.discount / 100));
  const total = netPrice * item.qty;

  document.getElementById(`adv-net-${index}`).value = netPrice.toFixed(2).replace('.',',');
  document.getElementById(`adv-total-${index}`).value = total.toFixed(2).replace('.',',');

  advCalculateTotals();
};

window.advRemoveItem = (index) => {
  const tr = document.getElementById(`adv-row-${index}`);
  if (tr) tr.remove();
  window.advancedOrderState.items[index].deleted = true;
  advCalculateTotals();
};

window.advCalculateTotals = () => {
  const items = window.advancedOrderState.items.filter(i => !i.deleted && i.sku);
  
  const numItems = items.length;
  const sumQty = items.reduce((acc, i) => acc + i.qty, 0);
  const totalSub = items.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const totalFinal = items.reduce((acc, i) => acc + ((i.price * (1 - i.discount/100)) * i.qty), 0);
  const discountVal = totalSub - totalFinal;

  document.getElementById('tot-items').value = numItems;
  document.getElementById('tot-qty').value = sumQty.toFixed(2).replace('.',',');
  document.getElementById('tot-disc').value = discountVal.toFixed(2).replace('.',',');
  document.getElementById('tot-subtotal').value = totalFinal.toFixed(2).replace('.',',');
  document.getElementById('tot-grand').value = totalFinal.toFixed(2).replace('.',',');
  
  // Guardando o valor bruto no dataset para salvar depois
  document.getElementById('tot-grand').dataset.rawTotal = totalFinal;
};

window.saveAdvancedOrder = async (type, orderId) => {
  const clienteId = document.getElementById('adv-cliente').value;
  if (!clienteId) return alert('Selecione um cliente!');

  const clienteName = document.getElementById('adv-cliente').options[document.getElementById('adv-cliente').selectedIndex].text;
  const value = Number(document.getElementById('tot-grand').dataset.rawTotal || 0);
  const itemsCount = Number(document.getElementById('tot-items').value || 0);
  const vendedor = document.getElementById('adv-vendedor').value;

  if (value <= 0 || itemsCount <= 0) return alert('Adicione pelo menos um item válido ao pedido!');

  if (type === 'quotation') {
    await window.API.addQuotation({
      client: clienteName,
      value: value,
      seller: vendedor,
      status: 'draft'
    });
  } else {
    await window.API.addOrder({
      client: clienteName,
      value: value,
      items: itemsCount,
      seller: vendedor,
      status: 'approved'
    });
  }

  renderSales();
};

window.openNewQuotationModal = () => {
  const modalHtml = `
    <div class="modal-header">
      <h3 class="modal-title">Nova Cotação</h3>
      <button class="modal-close" onclick="hideAppModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Cliente / Empresa</label>
        <input type="text" id="new-quotation-client" class="form-control" placeholder="Ex: Nova Energia SA">
      </div>
      <div class="form-group">
        <label>Valor Estimado (R$)</label>
        <input type="number" id="new-quotation-value" class="form-control" placeholder="Ex: 25000">
      </div>
      <div class="form-group">
        <label>Vendedor</label>
        <select id="new-quotation-seller" class="form-control">
          <option>Lucas M.</option>
          <option>Ana S.</option>
          <option>Pedro R.</option>
          <option>Carla T.</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="hideAppModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="submitNewQuotation()" id="btn-save-quotation">Criar Cotação</button>
    </div>
  `;
  window.showAppModal(modalHtml);
};

window.submitNewQuotation = async () => {
  const client = document.getElementById('new-quotation-client').value;
  const value = document.getElementById('new-quotation-value').value;
  const seller = document.getElementById('new-quotation-seller').value;

  if (!client || !value) return alert('Preencha o cliente e o valor!');

  const btn = document.getElementById('btn-save-quotation');
  btn.innerHTML = 'Salvando...';
  btn.disabled = true;

  await window.API.addQuotation({ client, value, seller, status: 'draft' });
  window.hideAppModal();
  
  // Re-render and navigate back to quotations tab
  await renderSales();
  setTimeout(() => {
    document.querySelectorAll('.tab-btn')[1].click();
  }, 50);
};

window.invoiceOrder = async (orderId) => {
  if (confirm(`Deseja faturar o pedido ${orderId}?`)) {
    await window.API.updateOrderStatus(orderId, 'invoiced');
    renderSales();
  }
};

window.printOrder = async (id) => {
  const masterData = await window.API.getMasterData();
  const salesData = await window.API.getSalesData();
  
  // Find order or quotation
  let record = salesData.orders.find(o => o.id === id);
  let isQuotation = false;
  if (!record) {
    record = salesData.quotations.find(q => q.id === id);
    isQuotation = true;
  }
  
  if (!record) return alert('Documento não encontrado.');

  const client = masterData.customers.find(c => c.name === record.client) || { name: record.client, document: '00.000.000/0000-00', email: 'N/A' };
  
  // Generate dummy items based on items count
  const itemsCount = record.items || 1;
  const unitPrice = record.value / itemsCount;
  let itemsHtml = '';
  for(let i=0; i<itemsCount; i++) {
    const prod = masterData.products[i % masterData.products.length];
    itemsHtml += `
      <tr>
        <td style="padding: 4px; border: 1px solid #000; font-size: 11px;">${prod.name}</td>
        <td style="padding: 4px; border: 1px solid #000; font-size: 11px;">${prod.sku}</td>
        <td style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: center;">UN</td>
        <td style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: center;">1,00</td>
        <td style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">${window.formatCurrency(unitPrice)}</td>
        <td style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">0,00%</td>
        <td style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">${window.formatCurrency(unitPrice)}</td>
        <td style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">${window.formatCurrency(unitPrice)}</td>
      </tr>
    `;
  }

  const printHtml = `
    <div style="font-family: Arial, sans-serif; color: #000; width: 100%; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="width: 30%;">
            <div style="font-size: 24px; font-weight: bold; font-family: sans-serif; letter-spacing: -1px;">
              <span style="color:#000;">OminiSis</span> <span style="color: #666; font-size: 14px;">ERP</span>
            </div>
          </td>
          <td style="text-align: right; font-size: 10px; line-height: 1.4;">
            <strong>OminiSis Tecnologia da Informação LTDA</strong><br>
            Av. Paulista, 1000 - Bela Vista<br>
            01310-100 - São Paulo, SP<br>
            CNPJ: 00.000.000/0001-00
          </td>
        </tr>
      </table>

      <h2 style="text-align: center; margin-bottom: 20px;">${isQuotation ? 'Cotação' : 'Pedido'} ${record.id}</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1px solid #000;">
        <tr>
          <td style="padding: 5px; border: 1px solid #000; vertical-align: top; width: 60%;">
            <strong style="font-size:12px;">Cliente</strong><br>
            <strong style="font-size:14px;">${client.name.toUpperCase()}</strong><br>
            <span style="font-size:11px;">
              CNPJ/CPF: ${client.document}<br>
              Endereço Padrão, 123 - Centro, São Paulo - SP<br>
              Email: ${client.email}
            </span>
          </td>
          <td style="padding: 0; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px; border-bottom: 1px solid #000; border-right: 1px solid #000; font-size: 12px;"><strong>Número do ${isQuotation ? 'orçamento' : 'pedido'}</strong></td>
                <td style="padding: 4px; border-bottom: 1px solid #000; font-size: 12px;">${record.id}</td>
              </tr>
              <tr>
                <td style="padding: 4px; border-bottom: 1px solid #000; border-right: 1px solid #000; font-size: 12px;"><strong>Data</strong></td>
                <td style="padding: 4px; border-bottom: 1px solid #000; font-size: 12px;">${record.date || record.validity}</td>
              </tr>
              <tr>
                <td style="padding: 4px; border-right: 1px solid #000; font-size: 12px;"><strong>Vendedor</strong></td>
                <td style="padding: 4px; font-size: 12px;">${record.seller}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="border: 1px solid #000; padding: 4px; margin-bottom: 15px; font-size: 12px;">
        <strong>Loja:</strong> Padrão
      </div>

      <strong style="font-size: 12px;">Itens do ${isQuotation ? 'orçamento' : 'pedido de venda'}</strong>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1px solid #000; margin-top: 5px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: left;">Descrição do produto/serviço</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: left;">Código</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px;">Un.</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px;">Qtd.</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">Preço de lista</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">Desc %</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">Valor unitário</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="width: 60%;"></td>
          <td style="width: 40%;">
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              <tr><td style="text-align: right; padding-right: 10px;"><strong>Nº de itens</strong></td><td style="text-align: right;">${itemsCount}</td></tr>
              <tr><td style="text-align: right; padding-right: 10px;"><strong>Desconto dos itens</strong></td><td style="text-align: right;">0,00</td></tr>
              <tr><td style="text-align: right; padding-right: 10px;"><strong>Soma das Qtdes</strong></td><td style="text-align: right;">${itemsCount},00</td></tr>
              <tr><td style="text-align: right; padding-right: 10px;"><strong>Total de produtos</strong></td><td style="text-align: right;">${window.formatCurrency(record.value)}</td></tr>
              <tr><td style="text-align: right; padding-right: 10px;"><strong>Frete</strong></td><td style="text-align: right;">0,00</td></tr>
              <tr><td style="text-align: right; padding-right: 10px;"><strong>Total do pedido</strong></td><td style="text-align: right;"><strong>${window.formatCurrency(record.value)}</strong></td></tr>
            </table>
          </td>
        </tr>
      </table>

      <strong style="font-size: 12px;">Parcelas</strong>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin-top: 5px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: left;">Dias</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: left;">Data vencimento</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: left;">Forma de pagamento</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">Valor</th>
            <th style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: left;">Observação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 4px; border: 1px solid #000; font-size: 11px;">0</td>
            <td style="padding: 4px; border: 1px solid #000; font-size: 11px;">${record.date || record.validity}</td>
            <td style="padding: 4px; border: 1px solid #000; font-size: 11px;">Boleto Bancário</td>
            <td style="padding: 4px; border: 1px solid #000; font-size: 11px; text-align: right;">${window.formatCurrency(record.value)}</td>
            <td style="padding: 4px; border: 1px solid #000; font-size: 11px;"></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('print-area').innerHTML = printHtml;
  setTimeout(() => {
    window.print();
  }, 100);
};

window.convertQuotation = async (quotationId, client, value, seller) => {
  if (confirm(`Deseja converter a cotação ${quotationId} em um Pedido de Venda Real?`)) {
    // We add an order
    await window.API.addOrder({ client, value, items: 1, seller, status: 'approved' });
    // And mark the quotation as converted (in a real app we'd have a specific method)
    // To keep it simple, we use a quick hack to update the status in the array directly since there is no updateQuotation endpoint.
    const q = DATA.quotations.find(x => x.id === quotationId);
    if (q) q.status = 'converted';
    
    renderSales();
  }
};
