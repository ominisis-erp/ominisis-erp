// ============================================================
// PURCHASE MODULE — OminiSis Enterprise ERP
// Purchase orders, supplier list, comparative quotation map
// ============================================================

window.renderPurchase = async function() {
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

  // Fetch data
  const purchaseData = await window.API.getPurchasesData();
  const masterData = await window.API.getMasterData();
  
  // Save globally for easy access
  window.purchaseCache = purchaseData;
  window.masterDataCache = masterData;

  const purchases = purchaseData.purchases || [];
  const suppliers = purchaseData.suppliers || [];
  
  const totalPO = purchases.reduce((s, o) => s + o.value, 0);
  const activeSuppliers = suppliers.filter(s => s.status === 'active' || s.status === 'Ativo').length;

  content.innerHTML = `
    <div class="animate-in" style="padding-bottom: 60px;">
      <div class="module-header">
        <div>
          <h1 class="module-title">🛒 Compras & Suprimentos</h1>
          <p class="module-subtitle">Pedidos de compra, mapa de cotação e fornecedores</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="renderQuotationMap()">📊 Novo Mapa de Cotação</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">🛒</div>
          <div class="kpi-value">${window.formatCurrency(totalPO)}</div>
          <div class="kpi-label">Compras Realizadas</div>
        </div>
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">⏳</div>
          <div class="kpi-value">${purchases.filter(p => p.status === 'pending').length}</div>
          <div class="kpi-label">Pedidos Pendentes</div>
        </div>
        <div class="kpi-card kpi-info">
          <div class="kpi-icon">🤝</div>
          <div class="kpi-value">${activeSuppliers}</div>
          <div class="kpi-label">Fornecedores Ativos</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-icon">✅</div>
          <div class="kpi-value">${purchases.length}</div>
          <div class="kpi-label">Total de Pedidos (OCs)</div>
        </div>
      </div>

      <div class="tab-nav" id="purchase-tabs">
        <button class="tab-btn active" onclick="purchaseTab('orders', this)">📦 Pedidos de Compra (OC)</button>
        <button class="tab-btn" onclick="purchaseTab('suppliers', this)">🤝 Fornecedores Homologados</button>
      </div>

      <div id="purchase-orders">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Ordens de Compra</h3>
          </div>
          <div class="table-container">
            <table>
              <thead><tr>
                <th>Nº OC</th><th>Fornecedor</th><th>Valor</th><th>Emissão</th><th>Entrega Prev.</th><th>Status</th>
              </tr></thead>
              <tbody>
                ${purchases.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted)">Nenhuma ordem de compra encontrada.</td></tr>` : 
                purchases.map(o => `
                  <tr onclick="window.renderPurchaseOrderDetails('${o.id}')" style="cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='var(--bg-elevated)'" onmouseout="this.style.background='transparent'">
                    <td style="color:var(--success-color);"><strong>${o.id}</strong></td>
                    <td>${o.supplier}</td>
                    <td><strong style="color:var(--text-primary)">${window.formatCurrency(o.value)}</strong></td>
                    <td>${o.date}</td>
                    <td>${o.delivery || 'A combinar'}</td>
                    <td>${window.getStatusBadge(o.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="purchase-suppliers" style="display:none">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Fornecedores Homologados</h3>
          </div>
          <div class="table-container">
            <table>
              <thead><tr>
                <th>Código</th><th>Fornecedor</th><th>Email</th><th>Documento</th><th>Status</th>
              </tr></thead>
              <tbody>
                ${suppliers.map(s => `
                  <tr>
                    <td><strong>${s.id}</strong></td>
                    <td>${s.name}</td>
                    <td>${s.email || '-'}</td>
                    <td>${s.document}</td>
                    <td>${window.getStatusBadge(s.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  window.purchaseTab = (tab, btn) => {
    document.querySelectorAll('#purchase-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['orders', 'suppliers'].forEach(t => {
      const el = document.getElementById(`purchase-${t}`);
      if (el) el.style.display = t === tab ? '' : 'none';
    });
  };
};

window.renderQuotationMap = () => {
  const products = window.masterDataCache.products.filter(p => p.type === 'ROH' || p.type === 'HALB' || p.type === 'Insumo');
  
  if(!window.quotationState) {
    window.quotationState = {
      items: [] 
    };
  }

  // Draw the UI
  drawQuotationUI(products);
};

window.drawQuotationUI = (availableProducts) => {
  const content = document.getElementById('content');
  const qState = window.quotationState;
  
  let html = `
    <div class="animate-in" style="padding-bottom: 60px;">
      <div class="advanced-form-header" style="position:sticky; top:0; z-index:10; background:var(--bg-base); padding: 15px 20px; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="module-title" style="margin:0; font-size: 24px;">📊 Mapa de Cotação</h1>
          <p class="module-subtitle">Comparativo de preços entre fornecedores homologados</p>
        </div>
        <div style="display:flex; gap: 10px; align-items:center;">
          <button class="btn btn-ghost" style="border: 1px solid var(--border-color);" onclick="renderPurchase()">Voltar</button>
          <button class="btn btn-primary" style="background:var(--success-color);" onclick="generatePurchaseOrders(event)">Gerar Pedidos (OC)</button>
        </div>
      </div>
      
      <div style="padding: 20px; max-width: 1400px; margin: 0 auto; display:flex; flex-direction:column; gap: 20px;">
        
        <!-- Add Material Row -->
        <div class="card" style="padding: 15px; display:flex; gap:15px; align-items:flex-end;">
          <div class="form-group" style="flex:1;">
            <label>Adicionar Material à Cotação</label>
            <select id="quote-product-select" class="form-control">
              <option value="">Selecione um material (Filtro por MP/Insumos)</option>
              ${availableProducts.map(p => `<option value="${p.id}">${p.sku} - ${p.name} (Fornecedores: ${p.suppliers?.length || 0})</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="width: 150px;">
            <label>Quantidade</label>
            <input type="number" id="quote-qty" class="form-control" value="1" min="1">
          </div>
          <button class="btn btn-secondary" onclick="addQuoteItem()">Adicionar na Tabela</button>
        </div>
        
        <!-- Comparative Map -->
        <div class="card">
          <div class="table-container" style="overflow-x: auto;">
            <table style="width:100%; border-collapse:collapse; min-width: 800px;">
              <thead>
                <tr>
                  <th style="padding:12px; border-bottom:2px solid var(--border-color); text-align:left;">Material</th>
                  <th style="padding:12px; border-bottom:2px solid var(--border-color); text-align:center; width: 100px;">Qtd</th>
                  <th style="padding:12px; border-bottom:2px solid var(--border-color); text-align:left;">Fornecedores Homologados & Preços</th>
                  <th style="padding:12px; border-bottom:2px solid var(--border-color); text-align:right; width: 150px;">Melhor Opção</th>
                  <th style="padding:12px; border-bottom:2px solid var(--border-color); text-align:center; width: 50px;"></th>
                </tr>
              </thead>
              <tbody>
  `;
  
  if (qState.items.length === 0) {
    html += `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-muted);">Adicione materiais acima para começar a cotação.</td></tr>`;
  } else {
    qState.items.forEach((item, index) => {
      const prod = availableProducts.find(p => p.id === item.productId);
      const homologatedSuppliers = prod.suppliers || [];
      
      html += `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding:12px;">
            <strong>${prod.sku}</strong><br>
            <span style="font-size:12px; color:var(--text-muted);">${prod.name} (${prod.unit})</span>
          </td>
          <td style="padding:12px; text-align:center;">
            <input type="number" class="form-control" style="width:70px; text-align:center; margin:0 auto;" value="${item.qty}" onchange="updateQuoteQty(${index}, this.value)">
          </td>
          <td style="padding:12px;">
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              ${homologatedSuppliers.length === 0 ? `<span style="color:var(--text-danger); font-size:12px; font-weight:600;">Nenhum fornecedor homologado para este item. Vá em Cadastros > Produto para homologar.</span>` : 
                homologatedSuppliers.map(supId => {
                  const supName = window.masterDataCache.suppliers.find(s => s.id === supId)?.name || supId;
                  const currentPrice = item.quotes[supId] || '';
                  const isWinner = item.winnerId === supId;
                  
                  return `
                    <div style="border: 1px solid ${isWinner ? 'var(--success-color)' : 'var(--border-color)'}; background: ${isWinner ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-elevated)'}; padding: 10px; border-radius: var(--radius-md); width: 220px; transition: all 0.2s ease;">
                      <div style="font-size:12px; margin-bottom:8px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${supName}">${supName}</div>
                      <div style="display:flex; gap:8px; align-items:center;">
                        <span style="font-size:12px; color:var(--text-muted); font-weight:600;">R$</span>
                        <input type="number" class="form-control" style="height:28px; font-size:13px; padding:0 8px; font-weight:600;" placeholder="0.00" value="${currentPrice}" onchange="updateQuotePrice(${index}, '${supId}', this.value)">
                        <input type="radio" name="winner_${index}" style="width:18px; height:18px; cursor:pointer; accent-color: var(--success-color);" ${isWinner ? 'checked' : ''} onclick="setQuoteWinner(${index}, '${supId}')" title="Escolher este fornecedor">
                      </div>
                    </div>
                  `;
                }).join('')
              }
            </div>
          </td>
          <td style="padding:12px; text-align:right;">
            ${item.winnerId ? `
              <div style="color:var(--success-color); font-weight:700; font-size:16px;">${window.formatCurrency(item.qty * (item.quotes[item.winnerId] || 0))}</div>
              <div style="font-size:11px; color:var(--text-muted);">Total do item</div>
            ` : `<span style="color:var(--text-warning); font-size:12px; font-weight:600;">Selecione o vencedor</span>`}
          </td>
          <td style="padding:12px; text-align:center;">
             <button class="btn btn-ghost btn-sm" style="color:var(--text-danger);" onclick="removeQuoteItem(${index})">🗑</button>
          </td>
        </tr>
      `;
    });
  }
  
  html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
  
  content.innerHTML = html;
};

window.addQuoteItem = () => {
  const prodId = document.getElementById('quote-product-select').value;
  const qty = document.getElementById('quote-qty').value;
  if(!prodId) return;
  
  const existing = window.quotationState.items.find(i => i.productId === prodId);
  if (existing) {
    existing.qty = Number(existing.qty) + Number(qty);
  } else {
    window.quotationState.items.push({
      productId: prodId,
      qty: Number(qty),
      quotes: {}, 
      winnerId: null
    });
  }
  
  window.renderQuotationMap();
};

window.updateQuoteQty = (index, val) => {
  window.quotationState.items[index].qty = Number(val);
  window.renderQuotationMap();
};

window.updateQuotePrice = (index, supId, val) => {
  window.quotationState.items[index].quotes[supId] = Number(val);
  
  // Auto-select as winner if it's the only price or if it's the first price entered
  if (!window.quotationState.items[index].winnerId) {
    window.quotationState.items[index].winnerId = supId;
  }
  
  window.renderQuotationMap();
};

window.setQuoteWinner = (index, supId) => {
  window.quotationState.items[index].winnerId = supId;
  window.renderQuotationMap();
};

window.removeQuoteItem = (index) => {
  window.quotationState.items.splice(index, 1);
  window.renderQuotationMap();
};

window.generatePurchaseOrders = async (event) => {
  const items = window.quotationState.items;
  if(items.length === 0) return alert('Adicione materiais à cotação primeiro.');
  
  // Group winning items by supplier
  const ordersBySupplier = {};
  
  for (const item of items) {
    if (!item.winnerId) return alert('Por favor, marque (clique na bolinha) o fornecedor vencedor para todos os materiais.');
    if (!item.quotes[item.winnerId]) return alert('Por favor, preencha o preço do fornecedor vencedor escolhido.');
    
    if (!ordersBySupplier[item.winnerId]) {
      ordersBySupplier[item.winnerId] = { supplierId: item.winnerId, items: [], totalValue: 0 };
    }
    
    ordersBySupplier[item.winnerId].items.push(item);
    ordersBySupplier[item.winnerId].totalValue += (item.qty * item.quotes[item.winnerId]);
  }
  
  // Visual feedback
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '⏳ Gerando OCs...';
  btn.disabled = true;
  
  const supKeys = Object.keys(ordersBySupplier);
  for (const supId of supKeys) {
    const orderData = ordersBySupplier[supId];
    const supName = window.masterDataCache.suppliers.find(s => s.id === supId)?.name || supId;
    
    await window.API.addPurchaseOrder({
      supplier: supName,
      value: orderData.totalValue,
      status: 'approved',
      items: orderData.items,
      delivery: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    });
  }
  
  // Clear state
  window.quotationState = null;
  
  // Go back to purchases
  await window.renderPurchase();
};

window.renderPurchaseOrderDetails = (orderId) => {
  const purchase = window.purchaseCache.purchases.find(p => p.id === orderId);
  if (!purchase) return alert('Ordem de Compra não encontrada');
  
  const content = document.getElementById('content');
  
  let itemsHtml = '';
  if (Array.isArray(purchase.items)) {
    // Items from new quotation map
    itemsHtml = purchase.items.map(i => {
      const p = window.masterDataCache.products.find(prod => prod.id === i.productId);
      return `
        <tr>
          <td style="padding:10px; border-bottom:1px solid var(--border-color)">${p ? p.sku : i.productId}</td>
          <td style="padding:10px; border-bottom:1px solid var(--border-color)">${p ? p.name : 'Produto'}</td>
          <td style="text-align:center; padding:10px; border-bottom:1px solid var(--border-color)">${i.qty}</td>
          <td style="text-align:right; padding:10px; border-bottom:1px solid var(--border-color)">${window.formatCurrency(i.quotes[purchase.supplier] || i.quotes[i.winnerId] || 0)}</td>
          <td style="text-align:right; padding:10px; border-bottom:1px solid var(--border-color)"><strong>${window.formatCurrency(i.qty * (i.quotes[purchase.supplier] || i.quotes[i.winnerId] || 0))}</strong></td>
        </tr>
      `;
    }).join('');
  } else {
    // Mock items for existing static purchases
    const count = typeof purchase.items === 'number' ? purchase.items : 3;
    const splitValue = purchase.value / count;
    for (let i = 0; i < count; i++) {
      itemsHtml += `
        <tr>
          <td style="padding:10px; border-bottom:1px solid var(--border-color)">MP-00${i+1}</td>
          <td style="padding:10px; border-bottom:1px solid var(--border-color)">Material Genérico ${i+1}</td>
          <td style="text-align:center; padding:10px; border-bottom:1px solid var(--border-color)">10</td>
          <td style="text-align:right; padding:10px; border-bottom:1px solid var(--border-color)">${window.formatCurrency(splitValue / 10)}</td>
          <td style="text-align:right; padding:10px; border-bottom:1px solid var(--border-color)"><strong>${window.formatCurrency(splitValue)}</strong></td>
        </tr>
      `;
    }
  }

  content.innerHTML = `
    <div class="animate-in" style="padding-bottom: 60px; max-width: 900px; margin: 0 auto;">
      <div class="advanced-form-header" style="position:sticky; top:0; z-index:10; background:var(--bg-base); padding: 15px 0; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap: 15px;">
          <button class="btn btn-ghost" onclick="renderPurchase()">← Voltar</button>
          <div>
            <h1 class="module-title" style="margin:0; font-size: 24px;">Ordem de Compra ${purchase.id}</h1>
            <p class="module-subtitle">Emitida em ${purchase.date}</p>
          </div>
        </div>
        <div style="display:flex; gap: 10px;">
          ${purchase.status !== 'received' ? `<button class="btn btn-primary" style="background:var(--success-color);" onclick="doReceivePurchaseOrder('${purchase.id}')">📥 Dar Entrada na OC</button>` : `<span class="badge badge-success" style="font-size:14px; padding: 6px 12px;">✅ OC Recebida (NF: ${purchase.nf || '-'})</span>`}
          <button class="btn btn-secondary" onclick="window.printPurchaseOrder('${purchase.id}')">🖨️ Imprimir OC</button>
        </div>
      </div>
      
      <div class="card" style="padding:30px;">
        <div style="display:flex; justify-content:space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
          <div>
            <h3 style="color:var(--text-muted); font-size:12px; text-transform:uppercase; margin-bottom:5px;">Fornecedor</h3>
            <div style="font-size:18px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">${purchase.supplier}</div>
            <div style="color:var(--text-muted); font-size:14px;">Solicitante: ${purchase.requester || 'Sistema'}</div>
          </div>
          <div style="text-align:right;">
            <h3 style="color:var(--text-muted); font-size:12px; text-transform:uppercase; margin-bottom:5px;">Status</h3>
            <div style="margin-bottom:10px;">${window.getStatusBadge(purchase.status)}</div>
            <div style="color:var(--text-muted); font-size:14px;">Previsão de Entrega: <strong>${purchase.delivery || 'A combinar'}</strong></div>
          </div>
        </div>
        
        <h3 style="font-size:16px; font-weight:600; margin-bottom:15px; color:var(--text-primary);">Itens da Ordem</h3>
        <table style="width:100%; border-collapse:collapse; margin-bottom:30px;">
          <thead>
            <tr>
              <th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color); color:var(--text-muted);">Código</th>
              <th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color); color:var(--text-muted);">Descrição</th>
              <th style="text-align:center; padding:10px; border-bottom:2px solid var(--border-color); color:var(--text-muted);">Qtd</th>
              <th style="text-align:right; padding:10px; border-bottom:2px solid var(--border-color); color:var(--text-muted);">Preço Unit.</th>
              <th style="text-align:right; padding:10px; border-bottom:2px solid var(--border-color); color:var(--text-muted);">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="text-align:right; padding:15px; font-weight:600; font-size:16px;">Total da OC:</td>
              <td style="text-align:right; padding:15px; font-weight:700; font-size:18px; color:var(--success-color);">${window.formatCurrency(purchase.value)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background:var(--bg-elevated); padding:15px; border-radius:var(--radius-md);">
          <h4 style="font-size:14px; margin-bottom:5px; color:var(--text-main);">Condições e Observações</h4>
          <p style="font-size:13px; color:var(--text-muted); margin:0;">
            1. O número desta OC deve constar na Nota Fiscal.<br>
            2. Horário de recebimento: Seg a Sex, das 08h às 17h.<br>
            3. Faturamento direto para OminiSis Enterprise Solutions (CNPJ: 00.000.000/0001-00).
          </p>
        </div>
      </div>
    </div>
  `;
};

window.doReceivePurchaseOrder = async (orderId) => {
  const nf = prompt("Digite o número da Nota Fiscal (NF) ou Documento referente a esta entrega:");
  if (!nf) return;

  const res = await window.API.receivePurchaseOrder(orderId, nf);
  if (res.success) {
    alert(`Entrada realizada com sucesso! Foram movimentados itens no estoque e a OC foi marcada como recebida.`);
    window.renderPurchaseOrderDetails(orderId);
  } else {
    alert(`Erro ao dar entrada: ${res.error}`);
  }
};

window.printPurchaseOrder = (orderId) => {
  const purchase = window.purchaseCache.purchases.find(p => p.id === orderId);
  if (!purchase) return;
  
  let itemsHtml = '';
  if (Array.isArray(purchase.items)) {
    itemsHtml = purchase.items.map(i => {
      const p = window.masterDataCache.products.find(prod => prod.id === i.productId);
      return `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #ddd; font-size:12px;">${p ? p.sku : i.productId}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd; font-size:12px;">${p ? p.name : 'Produto'}</td>
          <td style="text-align:center; padding:8px; border-bottom:1px solid #ddd; font-size:12px;">${i.qty}</td>
          <td style="text-align:right; padding:8px; border-bottom:1px solid #ddd; font-size:12px;">${window.formatCurrency(i.quotes[purchase.supplier] || i.quotes[i.winnerId] || 0)}</td>
          <td style="text-align:right; padding:8px; border-bottom:1px solid #ddd; font-size:12px;"><strong>${window.formatCurrency(i.qty * (i.quotes[purchase.supplier] || i.quotes[i.winnerId] || 0))}</strong></td>
        </tr>
      `;
    }).join('');
  } else {
    const count = typeof purchase.items === 'number' ? purchase.items : 3;
    const splitValue = purchase.value / count;
    for (let i = 0; i < count; i++) {
      itemsHtml += `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #ddd; font-size:12px;">MP-00${i+1}</td>
          <td style="padding:8px; border-bottom:1px solid #ddd; font-size:12px;">Material Genérico ${i+1}</td>
          <td style="text-align:center; padding:8px; border-bottom:1px solid #ddd; font-size:12px;">10</td>
          <td style="text-align:right; padding:8px; border-bottom:1px solid #ddd; font-size:12px;">${window.formatCurrency(splitValue / 10)}</td>
          <td style="text-align:right; padding:8px; border-bottom:1px solid #ddd; font-size:12px;"><strong>${window.formatCurrency(splitValue)}</strong></td>
        </tr>
      `;
    }
  }

  const printHtml = `
    <div style="font-family: Arial, sans-serif; color: #000; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="display:flex; justify-content:space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
        <div>
          <h1 style="margin:0; font-size:24px; color: #10b981;">OminiSis ERP</h1>
          <p style="margin:5px 0 0 0; font-size:12px;">CNPJ: 00.000.000/0001-00<br>Rua Fictícia, 123 - São Paulo/SP</p>
        </div>
        <div style="text-align:right;">
          <h2 style="margin:0; font-size:20px;">ORDEM DE COMPRA (OC)</h2>
          <div style="font-size:18px; font-weight:bold; margin-top:5px;">Nº ${purchase.id}</div>
          <div style="font-size:12px; margin-top:5px;">Data de Emissão: ${purchase.date}</div>
        </div>
      </div>
      
      <div style="border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
        <h3 style="margin:0 0 10px 0; font-size:14px; border-bottom:1px solid #ddd; padding-bottom:5px;">Dados do Fornecedor</h3>
        <table style="width:100%;">
          <tr>
            <td style="width:50%; font-size:12px;"><strong>Razão Social:</strong> ${purchase.supplier}</td>
            <td style="width:50%; font-size:12px;"><strong>Entrega Prevista:</strong> ${purchase.delivery || 'A combinar'}</td>
          </tr>
          <tr>
            <td style="font-size:12px;"><strong>Solicitante Interno:</strong> ${purchase.requester || 'Sistema'}</td>
            <td style="font-size:12px;"><strong>Status Atual:</strong> ${purchase.status === 'approved' ? 'Aprovado' : purchase.status}</td>
          </tr>
        </table>
      </div>
      
      <table style="width:100%; border-collapse:collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="text-align:left; padding:8px; border:1px solid #000; font-size:12px;">Código</th>
            <th style="text-align:left; padding:8px; border:1px solid #000; font-size:12px;">Descrição do Material</th>
            <th style="text-align:center; padding:8px; border:1px solid #000; font-size:12px;">Qtd</th>
            <th style="text-align:right; padding:8px; border:1px solid #000; font-size:12px;">Preço Unit. (R$)</th>
            <th style="text-align:right; padding:8px; border:1px solid #000; font-size:12px;">Subtotal (R$)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align:right; padding:10px; border:1px solid #000; font-weight:bold; font-size:14px;">VALOR TOTAL DA OC:</td>
            <td style="text-align:right; padding:10px; border:1px solid #000; font-weight:bold; font-size:14px;">${window.formatCurrency(purchase.value)}</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="font-size:11px; color:#555; border-top:1px solid #000; padding-top:10px; margin-top:30px;">
        <strong>INSTRUÇÕES PARA FATURAMENTO E ENTREGA:</strong><br>
        1. O número desta Ordem de Compra (${purchase.id}) deve constar obrigatoriamente na Nota Fiscal.<br>
        2. Entregas fora do horário comercial (08:00 às 17:00) deverão ser agendadas previamente.<br>
        3. Para dúvidas, contatar nosso departamento de compras.<br>
        <br>
        <div style="text-align:center; margin-top:40px;">
          _______________________________________________________<br>
          Assinatura do Responsável (Compras)
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('print-area').innerHTML = printHtml;
  setTimeout(() => window.print(), 100);
};
