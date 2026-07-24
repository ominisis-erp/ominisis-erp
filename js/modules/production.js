// ============================================================
// PRODUCTION MODULE (PCP / MRP) — OminiSis Enterprise ERP
// Machine Status, OEE Gauge, BOM, Production Orders
// ============================================================

window.renderProduction = async () => {
  const content = document.getElementById('content');
  content.innerHTML = `<div class="loading">Carregando Módulo de Produção...</div>`;

  try {
    const data = await window.API.getProductionData();
    window.productionState = {
      ops: data.productionOrders,
      machines: data.machines,
      products: data.products,
      currentTab: 'machines',
      selectedBomProduct: data.products.length > 0 ? data.products[0].id : null
    };
    
    // Calcula KPIs
    let totalProduced = 0;
    let activeOps = 0;
    let totalYieldSum = 0;
    let opsYieldCount = 0;

    data.productionOrders.forEach(op => {
      totalProduced += op.producedQty;
      if (op.status === 'running' || op.status === 'setup' || op.status === 'pending' || op.status === 'released') {
        activeOps++;
      }
      if (op.producedQty > 0 || op.scrapQty > 0) {
        totalYieldSum += op.yield;
        opsYieldCount++;
      }
    });

    const avgYield = opsYieldCount > 0 ? (totalYieldSum / opsYieldCount).toFixed(1) : 100;
    const machinesInMaintenance = data.machines.filter(m => m.status === 'maintenance').length;
    
    // Simulate OEE (Disponibilidade x Performance x Qualidade)
    const availability = 0.92;
    const performance = 0.95;
    const quality = (avgYield / 100);
    const globalOEE = Math.round((availability * performance * quality) * 100);

    const html = `
      <div class="animate-in" style="padding-bottom: 60px;">
        <div class="module-header">
          <div>
            <h1 class="module-title">⚙️ Produção & Chão de Fábrica</h1>
            <p class="module-subtitle">Ordens de Produção (OP), acompanhamento em tempo real, capacidade de postos e cálculo de OEE</p>
          </div>
          <div class="module-actions">
            <button class="btn btn-secondary btn-sm" onclick="alert('Cálculo de Necessidade de Materiais (MRP) rodará com base na demanda de vendas.')">⚡ Rodar MRP</button>
            <button class="btn btn-primary btn-sm" onclick="openCreateOpModal()">➕ Criar OP</button>
          </div>
        </div>

        <!-- Production KPIs -->
        <div class="grid-1-2" style="margin-bottom:24px">
          
          <!-- OEE Gauge Card -->
          <div class="card flex-center" style="flex-direction:column">
            <div class="card-title" style="margin-bottom:16px">OEE Global da Fábrica</div>
            <div class="oee-gauge" id="oee-gauge-container"></div>
            <div style="display:flex;gap:12px;margin-top:16px;font-size:11px">
              <span style="color:var(--success-color)">Disp: ${(availability*100).toFixed(0)}%</span>
              <span style="color:var(--primary-color)">Perf: ${(performance*100).toFixed(0)}%</span>
              <span style="color:${quality >= 0.95 ? 'var(--success-color)' : 'var(--warning-color)'}">Qual: ${(quality*100).toFixed(1)}%</span>
            </div>
          </div>

          <!-- Metrics Grid -->
          <div class="grid-2">
            <div class="kpi-card kpi-primary">
              <div class="kpi-icon">⚙️</div>
              <div class="kpi-value">${activeOps}</div>
              <div class="kpi-label">OPs em Andamento</div>
            </div>
            <div class="kpi-card kpi-success">
              <div class="kpi-icon">📦</div>
              <div class="kpi-value">${totalProduced.toLocaleString('pt-BR')} UN</div>
              <div class="kpi-label">Volume Produzido</div>
            </div>
            <div class="kpi-card kpi-warning">
              <div class="kpi-icon">🔧</div>
              <div class="kpi-value">${machinesInMaintenance}</div>
              <div class="kpi-label">Máquinas em Manutenção</div>
            </div>
            <div class="kpi-card ${avgYield < 95 ? 'kpi-danger' : 'kpi-success'}">
              <div class="kpi-icon">🗑️</div>
              <div class="kpi-value">${(100 - avgYield).toFixed(1)}%</div>
              <div class="kpi-label">Índice de Scrap/Refugo</div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tab-nav" id="production-tabs">
          <button class="tab-btn active" onclick="prodTab('machines', this)">🖥️ Máquinas (Centros Trabalho)</button>
          <button class="tab-btn" onclick="prodTab('sectors', this)">🏭 Setores Fabris</button>
          <button class="tab-btn" onclick="prodTab('ops', this)">📋 Ordens de Produção (OP)</button>
          <button class="tab-btn" onclick="prodTab('products', this)">📦 Engenharia de Produtos</button>
          <button class="tab-btn" onclick="prodTab('mrp', this)" style="background: var(--primary-color); color: white; border-color: var(--primary-color);">📈 Planejamento (MRP)</button>
        </div>

        <!-- Tab Contents -->
        <div id="prod-tab-content">
          ${renderMachinesTab()}
        </div>

      </div>
    `;

    content.innerHTML = html;

    // Draw OEE gauge after render
    requestAnimationFrame(() => {
      window.Charts.drawGauge('oee-gauge-container', globalOEE);
    });

  } catch (err) {
    console.error(err);
    content.innerHTML = `<div class="error-state">Erro ao carregar módulo de Produção.</div>`;
  }
};

window.prodTab = (tabId, btnEl) => {
  document.querySelectorAll('#production-tabs .tab-btn').forEach(b => {
    b.classList.remove('active');
    if (b.innerText.includes('MRP')) {
      b.style.opacity = '0.9';
    }
  });
  btnEl.classList.add('active');
  window.productionState.currentTab = tabId;
  
  const contentEl = document.getElementById('prod-tab-content');
  if (tabId === 'machines') contentEl.innerHTML = renderMachinesTab();
  else if (tabId === 'sectors') contentEl.innerHTML = renderSectorsTab();
  else if (tabId === 'ops') contentEl.innerHTML = renderOpsTab();
  else if (tabId === 'products') contentEl.innerHTML = renderProductsTab();
  else if (tabId === 'mrp') contentEl.innerHTML = renderMrpTab();
};

function renderMachinesTab() {
  const machines = window.productionState.machines;
  return `
    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="card-title">Sensores IoT & Postos de Trabalho</h3>
        <input type="text" class="form-control" placeholder="Buscar Máquina..." id="filter-machine-text" style="width:250px; padding: 6px 12px; font-size:13px;" onkeyup="filterMachineGrid()">
      </div>
      <div class="machine-grid">
        ${machines.map(m => {
          const statusColor = m.status === 'running' ? 'var(--success-color)' : 
                              m.status === 'setup' ? 'var(--warning-color)' : 
                              m.status === 'idle' ? 'var(--text-muted)' : 'var(--danger-color)';
          const sector = DATA.sectors.find(s => s.id === m.sectorId);
          const sectorName = sector ? sector.name : 'Geral';
          return `
            <div class="machine-card" style="border:1px solid var(--border-color); cursor:pointer; padding:15px; border-radius:var(--radius-md); background:var(--bg-elevated); transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'" onclick="renderMachineDetails('${m.id}')">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <span class="machine-name" style="font-weight:600; font-size:14px; color:var(--text-main);">${m.name}</span>
                <span class="font-mono" style="font-size:10px;color:var(--text-muted)">${m.id}</span>
              </div>
              <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px">Tipo: ${m.type} | Setor: ${sectorName}</div>
              
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding: 4px 8px; border-radius: 4px; background: rgba(0,0,0,0.1); width: fit-content;">
                <span class="status-dot" style="width:8px; height:8px; border-radius:50%; background:${statusColor}; display:inline-block;"></span>
                <span style="font-size:11px;font-weight:600;text-transform:uppercase; color:${statusColor};">${m.status}</span>
              </div>

              <div style="margin-top:12px;display:flex;justify-content:space-between;font-size:11px">
                <span style="color:var(--text-muted);">OP rodando:</span>
                <strong>${m.order || 'Nenhuma'}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-top:4px">
                <span style="color:var(--text-muted);">OEE máquina:</span>
                <strong style="color:var(--primary-color)">${m.oee}%</strong>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderSectorsTab() {
  const sectors = DATA.sectors;
  const machines = window.productionState.machines;
  
  let html = `<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;">
    <h3 class="card-title">Hierarquia de Setores Fabris</h3>
    <button class="btn btn-primary">➕ Novo Setor</button>
  </div><div style="padding: 20px;">`;
  
  sectors.forEach(sector => {
    const sectorMachines = machines.filter(m => m.sectorId === sector.id);
    html += `
      <div style="margin-bottom:20px; border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden;">
        <div style="background:${sector.color}20; padding:15px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="margin:0; font-size:16px; color:${sector.color}; display:flex; align-items:center; gap:10px;">
              🏭 ${sector.name}
            </h4>
            <div style="font-size:12px; color:var(--text-muted); margin-top:5px;">Responsável: ${sector.manager}</div>
          </div>
          <div style="font-size:14px; font-weight:bold; color:var(--text-muted);">${sectorMachines.length} Máquinas</div>
        </div>
        <div style="padding:15px; background:var(--bg-base);">
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:1px solid var(--border-color);">
                <th style="text-align:left; padding:8px; font-size:12px; color:var(--text-muted);">ID</th>
                <th style="text-align:left; padding:8px; font-size:12px; color:var(--text-muted);">Centro de Trabalho</th>
                <th style="text-align:center; padding:8px; font-size:12px; color:var(--text-muted);">Taxa HM (R$)</th>
                <th style="text-align:center; padding:8px; font-size:12px; color:var(--text-muted);">Taxa HH (R$)</th>
                <th style="text-align:center; padding:8px; font-size:12px; color:var(--text-muted);">OEE</th>
                <th style="text-align:right; padding:8px; font-size:12px; color:var(--text-muted);">Status</th>
              </tr>
            </thead>
            <tbody>
              ${sectorMachines.map(m => `
                <tr style="border-bottom:1px solid var(--border-color)30;">
                  <td style="padding:8px; font-size:13px; font-family:monospace; color:var(--primary-color); cursor:pointer;" onclick="renderMachineDetails('${m.id}')">${m.id}</td>
                  <td style="padding:8px; font-size:13px;">${m.name}</td>
                  <td style="padding:8px; font-size:13px; text-align:center;">R$ ${m.costHM}</td>
                  <td style="padding:8px; font-size:13px; text-align:center;">R$ ${m.costHH}</td>
                  <td style="padding:8px; font-size:13px; text-align:center;">${m.oee}%</td>
                  <td style="padding:8px; font-size:13px; text-align:right;">${window.getStatusBadge(m.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  });
  
  html += `</div></div>`;
  return html;
}

function renderProductsTab() {
  const products = window.productionState.products;
  return `
    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="card-title">Cadastro Central de Produtos</h3>
        <input type="text" class="form-control" placeholder="Buscar Produto..." style="width:250px; padding: 6px 12px; font-size:13px;" onkeyup="filterBomTable()">
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">SKU / Produto</th>
              <th style="text-align:left;">Categoria</th>
              <th style="text-align:center;">Itens na BOM</th>
              <th style="text-align:center;">Fases no Roteiro</th>
              <th style="text-align:right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td><strong>${p.sku}</strong><br><span style="color:var(--text-muted); font-size:12px;">${p.name}</span></td>
                <td>Produto Acabado (FERT)</td>
                <td style="text-align:center;">${p.bom ? p.bom.length : 0}</td>
                <td style="text-align:center;">${p.routing ? p.routing.length : 0}</td>
                <td style="text-align:right;">
                  <button class="btn btn-primary btn-sm" onclick="viewProductMaster('${p.id}')">⚙️ Abrir Cadastro</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================================
// MRP (Material Requirements Planning)
// ============================================================================

window.mrpState = {
  lastRun: null,
  demands: [],
  plannedOrders: [],
  purchaseReqs: []
};

window.renderMrpTab = () => {
  if (!window.mrpState.lastRun) {
    return `
      <div class="card" style="text-align:center; padding: 50px 20px;">
        <div style="font-size:48px; margin-bottom:20px;">⚙️</div>
        <h2 style="margin-bottom:10px;">Simulador de Planejamento (MRP)</h2>
        <p style="color:var(--text-muted); max-width:600px; margin:0 auto 30px auto; line-height:1.5;">
          O MRP irá analisar todos os Pedidos de Venda Aprovados e Pendentes, cruzar as quantidades com o estoque atual de produtos acabados, e fazer a explosão das Estruturas (BOM) para sugerir exatamente o que precisa ser fabricado e comprado.
        </p>
        <button class="btn btn-primary" style="font-size:16px; padding: 12px 30px;" onclick="runMrpSimulation()">▶️ Rodar Simulação MRP Agora</button>
      </div>
    `;
  }
  
  return renderMrpResults();
};

window.runMrpSimulation = () => {
  const masterProducts = window.productionState.products; // Includes FERT, HALB, ROH from data.js
  const salesOrders = DATA.salesOrders.filter(so => so.status === 'approved' || so.status === 'pending');
  
  let demands = [];
  let plannedOrders = [];
  let purchaseReqs = [];
  
  // 1. Gather Gross Requirements from Sales Orders
  let grossReqs = {};
  salesOrders.forEach(so => {
    if (so.detailItems) {
      so.detailItems.forEach(item => {
        if (!grossReqs[item.sku]) grossReqs[item.sku] = 0;
        grossReqs[item.sku] += item.qty;
      });
    }
  });

  // Track simulated stock adjustments during the MRP run
  let simulatedStock = {};
  masterProducts.forEach(p => {
    simulatedStock[p.sku] = p.stock || 0;
  });

  // 2. Process Gross Requirements for FERT (Finished Goods)
  for (const sku in grossReqs) {
    const qtyNeeded = grossReqs[sku];
    const prod = masterProducts.find(p => p.sku === sku);
    if (!prod) continue;

    demands.push({
      sku: prod.sku,
      name: prod.name,
      grossDemand: qtyNeeded,
      stock: simulatedStock[sku]
    });

    const netRequirement = qtyNeeded - simulatedStock[sku];
    
    if (netRequirement > 0) {
      // Need to produce FERT
      plannedOrders.push({
        sku: prod.sku,
        name: prod.name,
        qty: netRequirement,
        type: prod.type,
        parent: 'Vendas'
      });
      // Simulate production completing (we get the stock)
      simulatedStock[sku] += netRequirement;
      
      // 3. Explode BOM for FERT
      explodeBOM(prod, netRequirement, plannedOrders, purchaseReqs, simulatedStock, masterProducts);
    } else {
      // We have enough stock to cover demand
      simulatedStock[sku] -= qtyNeeded;
    }
  }

  // 4. Save state and re-render
  window.mrpState = {
    lastRun: new Date().toLocaleString(),
    demands,
    plannedOrders,
    purchaseReqs
  };

  const contentEl = document.getElementById('prod-tab-content');
  contentEl.innerHTML = renderMrpResults();
};

function explodeBOM(parentProd, qtyToProduce, plannedOrders, purchaseReqs, simulatedStock, masterProducts) {
  if (!parentProd.bom || parentProd.bom.length === 0) return;

  parentProd.bom.forEach(bomItem => {
    const requiredQty = bomItem.qty * qtyToProduce;
    const compProd = masterProducts.find(p => p.sku === bomItem.itemSku);
    if (!compProd) return;

    const currentStock = simulatedStock[compProd.sku] || 0;
    const netReq = requiredQty - currentStock;

    if (netReq > 0) {
      if (compProd.type === 'HALB') {
        // Need to produce Subassembly
        plannedOrders.push({
          sku: compProd.sku,
          name: compProd.name,
          qty: netReq,
          type: compProd.type,
          parent: parentProd.sku
        });
        simulatedStock[compProd.sku] += netReq;
        // Recursive explosion
        explodeBOM(compProd, netReq, plannedOrders, purchaseReqs, simulatedStock, masterProducts);
      } else if (compProd.type === 'ROH' || compProd.type === 'RAW') {
        // Need to purchase Raw Material
        // Aggregate if already exists
        const existingReq = purchaseReqs.find(r => r.sku === compProd.sku);
        if (existingReq) {
          existingReq.qty += netReq;
          if (!existingReq.parents.includes(parentProd.sku)) existingReq.parents.push(parentProd.sku);
        } else {
          purchaseReqs.push({
            sku: compProd.sku,
            name: compProd.name,
            qty: netReq,
            unit: compProd.unit,
            supplier: compProd.suppliers && compProd.suppliers.length > 0 ? DATA.suppliers.find(s=>s.id===compProd.suppliers[0])?.name || 'N/D' : 'Sem Fornecedor',
            parents: [parentProd.sku]
          });
        }
        simulatedStock[compProd.sku] += netReq;
      }
    } else {
      // Consume stock
      simulatedStock[compProd.sku] -= requiredQty;
    }
  });
}

window.renderMrpResults = () => {
  const state = window.mrpState;
  
  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <div>
        <h2 style="margin:0; font-size:20px;">Relatório da Simulação MRP</h2>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Última execução: ${state.lastRun}</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-ghost" onclick="runMrpSimulation()">🔄 Rodar Novamente</button>
        <button class="btn btn-primary" onclick="approveMrp()">✅ Efetivar Plano (Aprovar)</button>
      </div>
    </div>
    
    <!-- DEMANDS -->
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header"><h3 class="card-title">1. Demanda Bruta (Pedidos de Venda) x Estoque FERT</h3></div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">Produto Acabado (SKU)</th>
              <th style="text-align:center;">Demanda Bruta (PVs)</th>
              <th style="text-align:center;">Estoque Atual</th>
              <th style="text-align:center;">Necessidade Líquida</th>
            </tr>
          </thead>
          <tbody>
            ${state.demands.length > 0 ? state.demands.map(d => {
              const net = Math.max(0, d.grossDemand - d.stock);
              return `
                <tr>
                  <td><strong>${d.sku}</strong><br><span style="font-size:11px; color:var(--text-muted)">${d.name}</span></td>
                  <td style="text-align:center;">${d.grossDemand}</td>
                  <td style="text-align:center;">${d.stock}</td>
                  <td style="text-align:center; font-weight:bold; color:${net > 0 ? 'var(--danger-color)' : 'var(--success-color)'}">${net > 0 ? net : '0 (Atendido)'}</td>
                </tr>
              `;
            }).join('') : `<tr><td colspan="4" style="text-align:center;">Nenhuma demanda encontrada.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid-2">
      <!-- PLANNED ORDERS -->
      <div class="card">
        <div class="card-header"><h3 class="card-title">2. Ordens de Produção Planejadas (FERT & HALB)</h3></div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="text-align:left;">Produzir (SKU)</th>
                <th style="text-align:center;">Qtd Sugerida</th>
                <th style="text-align:left;">Origem (Pai)</th>
              </tr>
            </thead>
            <tbody>
              ${state.plannedOrders.length > 0 ? state.plannedOrders.map(po => `
                <tr>
                  <td><strong>${po.sku}</strong> <span style="font-size:10px; padding:2px 4px; background:var(--bg-base); border-radius:4px; border:1px solid var(--border-color);">${po.type}</span></td>
                  <td style="text-align:center; font-weight:bold;">${po.qty}</td>
                  <td style="font-size:12px; color:var(--text-muted);">${po.parent}</td>
                </tr>
              `).join('') : `<tr><td colspan="3" style="text-align:center;">Estoque suficiente. Nenhuma produção sugerida.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- PURCHASE REQUISITIONS -->
      <div class="card">
        <div class="card-header"><h3 class="card-title">3. Solicitações de Compra Planejadas (ROH)</h3></div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="text-align:left;">Comprar (Matéria-Prima)</th>
                <th style="text-align:center;">Qtd Sugerida</th>
                <th style="text-align:left;">Fornecedor Principal</th>
              </tr>
            </thead>
            <tbody>
              ${state.purchaseReqs.length > 0 ? state.purchaseReqs.map(pr => `
                <tr>
                  <td><strong>${pr.sku}</strong><br><span style="font-size:11px; color:var(--text-muted)">${pr.name}</span></td>
                  <td style="text-align:center; font-weight:bold; color:var(--primary-color);">${pr.qty} ${pr.unit}</td>
                  <td style="font-size:12px;">${pr.supplier}</td>
                </tr>
              `).join('') : `<tr><td colspan="3" style="text-align:center;">Estoque suficiente. Nenhuma compra sugerida.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

window.approveMrp = () => {
  if (confirm("Você deseja transformar essa simulação em requisições reais no sistema? (Nesta versão protótipo, isso é apenas uma simulação visual)")) {
    alert("MRP Efetivado com sucesso! As OPs planejadas foram geradas no PCP e as Requisições de Compra enviadas para o módulo de Suprimentos.");
  }
};


function renderOpsTab() {
  const ops = window.productionState.ops;
  return `
    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="card-title">Ordens de Produção Ativas e Concluídas</h3>
        <div style="display:flex; gap:10px;">
          <input type="text" class="form-control" placeholder="Buscar OP, Produto..." id="filter-op-text" style="width:200px; padding: 6px 12px; font-size:13px;" onkeyup="filterOpTable()">
          <select class="form-control" id="filter-op-status" style="width:150px; padding: 6px 12px; font-size:13px;" onchange="filterOpTable()">
            <option value="all">Todos Status</option>
            <option value="planned">Planejada</option>
            <option value="released">Liberada</option>
            <option value="running">Em Execução</option>
            <option value="completed">Concluída</option>
          </select>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">Código OP</th>
              <th style="text-align:left;">Produto</th>
              <th style="text-align:center;">Programado</th>
              <th style="text-align:center;">Produzido</th>
              <th style="text-align:center;">Rendimento</th>
              <th style="text-align:left;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${ops.map(op => {
              const prod = window.productionState.products.find(p => p.id === op.productId);
              return `
                <tr onclick="renderOpDetails('${op.id}')" style="cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='var(--bg-elevated)'" onmouseout="this.style.background='transparent'">
                  <td><strong>${op.id}</strong></td>
                  <td>${prod ? prod.sku : op.productId}<br><span style="font-size:11px; color:var(--text-muted);">${prod ? prod.name : ''}</span></td>
                  <td style="text-align:center;">${op.targetQty} ${prod ? prod.unit : 'UN'}</td>
                  <td style="text-align:center;">${op.producedQty} ${prod ? prod.unit : 'UN'}</td>
                  <td style="text-align:center;"><span style="color:${op.yield >= 95 ? 'var(--success-color)' : op.yield > 0 ? 'var(--warning-color)' : 'var(--text-muted)'}; font-weight:600;">${op.yield}%</span></td>
                  <td>${window.getStatusBadge(op.status)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.selectBomProduct = (productId) => {
  window.productionState.selectedBomProduct = productId;
  const contentEl = document.getElementById('prod-tab-content');
  contentEl.innerHTML = renderBomTab();
};

function renderBomTab() {
  const products = window.productionState.products;
  const selectedId = window.productionState.selectedBomProduct;
  const selectedProd = products.find(p => p.id === selectedId);
  
  let bomHtml = '';
  if (selectedProd && selectedProd.bom && selectedProd.bom.length > 0) {
    bomHtml = selectedProd.bom.map((item, idx) => {
      // Find the component in master data to get current stock
      const comp = window.DATA.masterProducts.find(p => p.sku === item.itemSku) || window.DATA.masterProducts.find(p => p.id === item.itemSku);
      
      const compName = comp ? comp.name : 'Desconhecido';
      const compUnit = comp ? comp.unit : 'UN';
      const currentStock = comp ? comp.stock : 0;
      
      const isCritical = currentStock < item.qty;
      const statusBadge = isCritical ? window.getStatusBadge('critical') : window.getStatusBadge('ok');
      
      return `
        <tr>
          <td><strong>${idx + 1}. ${compName}</strong></td>
          <td class="font-mono" style="font-size:12px;">${item.itemSku}</td>
          <td style="text-align:center;">${item.qty}</td>
          <td style="text-align:center;">${compUnit}</td>
          <td style="text-align:center; color:${isCritical ? 'var(--danger-color)' : 'var(--text-main)'}; font-weight:600;">${currentStock}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');
  } else {
    bomHtml = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">Este produto não possui estrutura (BOM) cadastrada.</td></tr>`;
  }

  return `
    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="card-title">Árvore de Estrutura do Produto (BOM)</h3>
        <div style="display:flex; gap:10px;">
          <select class="form-control" style="width:300px; cursor:pointer;" onchange="selectBomProduct(this.value)">
            ${products.map(p => `<option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.sku} - ${p.name}</option>`).join('')}
          </select>
          <input type="text" class="form-control" placeholder="Buscar Componente..." id="filter-bom-text" style="width:200px; padding: 6px 12px; font-size:13px;" onkeyup="filterBomTable()">
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">Item / Componente</th>
              <th style="text-align:left;">Código SKU</th>
              <th style="text-align:center;">Qtd P/ 1 Unidade</th>
              <th style="text-align:center;">Unidade</th>
              <th style="text-align:center;">Estoque Atual</th>
              <th style="text-align:left;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${bomHtml}
          </tbody>
        </table>
      </div>
      <div style="padding:15px; background:var(--bg-elevated); margin-top:10px; border-radius:var(--radius-md);">
        <p style="font-size:12px; color:var(--text-muted); margin:0;">
          💡 <strong>Nota sobre Baixa de Estoque:</strong> Quando uma Ordem de Produção é concluída, o sistema automaticamente consome as quantidades dos componentes acima proporcionais ao volume produzido (Backflush), e dá entrada no estoque do produto principal.
        </p>
      </div>
    </div>
  `;
}

// ============================================================================
// OP Details / Apontamentos / Status Pipeline
// ============================================================================

window.renderOpDetails = (opId) => {
  const content = document.getElementById('content');
  const op = window.productionState.ops.find(o => o.id === opId);
  if (!op) return;

  const prod = window.productionState.products.find(p => p.id === op.productId);
  const pctProg = Math.min(100, Math.round((op.producedQty / op.targetQty) * 100));
  
  // Pipeline Stepper Logic
  const phases = ['planned', 'released', 'running', 'completed'];
  let currentPhaseIdx = phases.indexOf(op.status);
  if (currentPhaseIdx === -1) {
    if (op.status === 'setup') currentPhaseIdx = 2; // Treat setup as running phase
    else currentPhaseIdx = 0;
  }

  const getStepHtml = (phase, label, index) => {
    let state = 'pending';
    if (index < currentPhaseIdx) state = 'completed';
    else if (index === currentPhaseIdx) state = 'active';

    let color = 'var(--text-muted)';
    let bg = 'var(--bg-elevated)';
    let border = 'var(--border-color)';
    if (state === 'active') { color = '#fff'; bg = 'var(--primary-color)'; border = 'var(--primary-color)'; }
    else if (state === 'completed') { color = '#fff'; bg = 'var(--success-color)'; border = 'var(--success-color)'; }

    return `
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; position:relative; z-index:2;">
        <div style="width:30px; height:30px; border-radius:50%; background:${bg}; border:2px solid ${border}; display:flex; align-items:center; justify-content:center; color:${color}; font-weight:bold; font-size:12px; margin-bottom:8px;">
          ${state === 'completed' ? '✓' : (index + 1)}
        </div>
        <span style="font-size:12px; font-weight:600; color:${state === 'active' ? 'var(--text-main)' : 'var(--text-muted)'}; text-transform:uppercase;">${label}</span>
      </div>
    `;
  };

  const stepperHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; position:relative; margin: 30px 0; padding: 0 40px;">
      <div style="position:absolute; top:15px; left:60px; right:60px; height:2px; background:var(--border-color); z-index:1;"></div>
      <div style="position:absolute; top:15px; left:60px; width:${(currentPhaseIdx / (phases.length - 1)) * 100}%; height:2px; background:var(--success-color); z-index:1; transition:width 0.3s;"></div>
      ${getStepHtml('planned', 'Planejada', 0)}
      ${getStepHtml('released', 'Liberada', 1)}
      ${getStepHtml('running', 'Em Execução', 2)}
      ${getStepHtml('completed', 'Concluída', 3)}
    </div>
  `;
  
  let actionsHtml = '';
  if (op.status === 'planned' || op.status === 'pending') {
    actionsHtml = `<button class="btn btn-primary" onclick="submitReleaseOp('${op.id}')">🔓 Liberar Ordem</button>`;
  } else if (op.status === 'released') {
    actionsHtml = `<button class="btn btn-primary" onclick="startOpModal('${op.id}')">▶️ Iniciar Produção (Alocar Máquina)</button>`;
  } else if (op.status === 'running' || op.status === 'setup') {
    actionsHtml = `
      <button class="btn btn-secondary" onclick="reportOpModal('${op.id}')">📝 Apontar Produção</button>
      <button class="btn btn-primary" style="background:var(--success-color);" onclick="finishOp('${op.id}')">✅ Concluir OP</button>
    `;
  } else if (op.status === 'completed') {
    actionsHtml = `<span class="badge badge-success" style="padding:8px 12px; font-size:14px;">OP Concluída em ${op.endDate}</span>`;
  }

  // Reports Table Html
  let reportsHtml = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">Nenhum apontamento registrado ainda.</td></tr>`;
  if (op.reports && op.reports.length > 0) {
    reportsHtml = op.reports.map((r, i) => `
      <tr style="border-bottom:1px solid var(--border-color);">
        <td style="padding:10px;">${r.date} ${r.time}</td>
        <td style="padding:10px;">${r.user}</td>
        <td style="text-align:center; padding:10px; color:var(--success-color); font-weight:600;">${r.good}</td>
        <td style="text-align:center; padding:10px; color:${r.scrap > 0 ? 'var(--danger-color)' : 'var(--text-muted)'}; font-weight:600;">${r.scrap}</td>
        <td style="padding:10px; color:var(--text-muted); font-size:12px;">${r.reason || '-'}</td>
      </tr>
    `).join('');
  }

  content.innerHTML = `
    <div class="animate-in" style="padding-bottom: 60px; max-width:1000px; margin:0 auto;">
      <div class="module-header" style="padding: 20px 0; border-bottom: 1px solid var(--border-color); margin-bottom: 20px;">
        <div style="display:flex; align-items:center; gap: 15px;">
          <button class="btn btn-ghost" onclick="renderProduction()">← Voltar</button>
          <div>
            <h1 class="module-title" style="margin:0; font-size: 24px;">Ordem de Produção ${op.id}</h1>
            <p class="module-subtitle">Criada em ${op.startDate} • Status: ${window.getStatusBadge(op.status)}</p>
          </div>
        </div>
        <div style="display:flex; gap: 10px; align-items:center;">
          ${actionsHtml}
        </div>
      </div>

      <!-- Pipeline Stepper -->
      <div class="card" style="margin-bottom:20px; padding: 20px 0;">
        ${stepperHtml}
      </div>

      <div class="grid-3">
        <div class="card" style="padding:20px;">
          <h3 style="font-size:14px; color:var(--text-muted); text-transform:uppercase; margin-bottom:15px;">Detalhes do Produto</h3>
          <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
            <div style="font-size:32px;">📦</div>
            <div>
              <div style="font-weight:700; font-size:18px; color:var(--text-main);">${prod ? prod.name : op.productId}</div>
              <div style="font-size:13px; color:var(--text-muted);">SKU: ${prod ? prod.sku : '-'} | Unidade: ${prod ? prod.unit : 'UN'}</div>
            </div>
          </div>
          
          <div style="margin-bottom:15px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:13px;">
              <span style="color:var(--text-muted);">Progresso da OP</span>
              <strong style="color:var(--text-main);">${pctProg}% (${op.producedQty} / ${op.targetQty})</strong>
            </div>
            <div style="height: 10px; width: 100%; background: var(--bg-base); border-radius: 5px; overflow:hidden; border: 1px solid var(--border-color);">
              <div style="height: 100%; width: ${pctProg}%; background: ${pctProg >= 100 ? 'var(--success-color)' : 'var(--primary-color)'}; border-radius: 5px; transition:width 0.3s;"></div>
            </div>
          </div>
        </div>

        <div class="card" style="padding:20px;">
          <h3 style="font-size:14px; color:var(--text-muted); text-transform:uppercase; margin-bottom:15px;">Rendimento & Qualidade</h3>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
            <span style="color:var(--text-muted);">Máquina Alocada:</span>
            <strong style="color:var(--text-main);">${op.machineId || 'Nenhuma'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
            <span style="color:var(--text-muted);">Total Produzido (Bom):</span>
            <strong style="color:var(--success-color);">${op.producedQty}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
            <span style="color:var(--text-muted);">Refugo (Scrap):</span>
            <strong style="color:var(--danger-color);">${op.scrapQty}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Yield (Rendimento):</span>
            <strong style="color:${op.yield >= 95 ? 'var(--success-color)' : 'var(--warning-color)'}; font-size:18px;">${op.yield}%</strong>
          </div>
        </div>
        
        <div class="card" style="padding:20px;">
          <h3 style="font-size:14px; color:var(--text-muted); text-transform:uppercase; margin-bottom:15px;">Custos de Transformação</h3>
          ${(() => {
            if (!prod || !prod.routing) return `<div style="color:var(--text-muted);">Sem roteiro definido para cálculo de custos.</div>`;
            let totalHM = 0, totalHH = 0, costHM = 0, costHH = 0;
            prod.routing.forEach(phase => {
              const machine = window.productionState.machines.find(m => m.id === phase.machineId);
              const mRate = machine ? (machine.costHM || 0) : 0;
              const hRate = machine ? (machine.costHH || 0) : 0;
              
              const p_hm = phase.setupTime + (phase.prodTime * op.targetQty);
              const p_hh = ((phase.humanTime || 0) * op.targetQty);
              
              totalHM += p_hm;
              totalHH += p_hh;
              costHM += (p_hm / 60) * mRate;
              costHH += (p_hh / 60) * hRate;
            });
            const totalCost = costHM + costHH;
            return `
              <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:5px;">
                <span style="color:var(--text-muted); font-size:12px;">Tempo de Máquina (HM):</span>
                <strong style="color:var(--text-main); font-size:12px;">${(totalHM / 60).toFixed(2)} h</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
                <span style="color:var(--text-muted); font-size:12px;">Tempo de Mão de Obra (HH):</span>
                <strong style="color:var(--text-main); font-size:12px;">${(totalHH / 60).toFixed(2)} h</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="color:var(--text-muted); font-size:13px;">Custo Máquina:</span>
                <strong style="color:var(--text-main); font-size:13px;">R$ ${costHM.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <span style="color:var(--text-muted); font-size:13px;">Custo Mão de Obra:</span>
                <strong style="color:var(--text-main); font-size:13px;">R$ ${costHH.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; background:var(--bg-base); padding:10px; border-radius:4px;">
                <span style="color:var(--primary-color); font-weight:bold;">Total Plan.:</span>
                <strong style="color:var(--primary-color); font-size:16px;">R$ ${totalCost.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong>
              </div>
            `;
          })()}
        </div>
      </div>

      <!-- Apontamentos Historico -->
      <div class="card" style="margin-top:20px;">
        <div class="card-header"><h3 class="card-title">Histórico de Apontamentos (Coleta de Dados)</h3></div>
        <div class="table-container">
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Data/Hora</th>
                <th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Operador</th>
                <th style="text-align:center; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Qtd Boa</th>
                <th style="text-align:center; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Refugo</th>
                <th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Motivo (Refugo)</th>
              </tr>
            </thead>
            <tbody>
              ${reportsHtml}
            </tbody>
          </table>
        </div>
      </div>
      
      ${op.status === 'completed' ? `
        <div style="margin-top:20px; padding:20px; background:rgba(16, 185, 129, 0.1); border:1px solid var(--success-color); border-radius:var(--radius-md);">
          <h4 style="color:var(--success-color); margin:0 0 10px 0; font-size:16px;">✅ OP Concluída com Sucesso</h4>
          <p style="margin:0; font-size:13px; color:var(--text-main); line-height:1.5;">
            Foi dada entrada de <strong>${op.producedQty} UN</strong> do produto <strong>${prod ? prod.sku : op.productId}</strong> no Estoque Central.<br>
            Os materiais da Estrutura de Produto (BOM) foram baixados do estoque proporcionalmente (Backflush).
          </p>
          <div style="margin-top:10px; padding:10px; background:#fff; border-radius:4px; border-left:4px solid var(--primary-color);">
            <strong style="color:var(--primary-color); font-size:12px;">Integração QM (Qualidade):</strong> <span style="font-size:12px; color:#555;">Um Lote de Inspeção (LI-9023) foi gerado automaticamente para amostragem deste recebimento.</span>
          </div>
        </div>
      ` : ''}

    </div>
  `;
};

// ============================================================================
// OP Action Modals
// ============================================================================

window.openCreateOpModal = () => {
  const products = window.productionState.products;
  const prodOptions = products.map(p => `<option value="${p.id}">${p.sku} - ${p.name}</option>`).join('');
  
  const modalHtml = `
    <div id="modal-backdrop" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:999; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(3px);">
      <div class="card" style="width: 450px; padding: 25px; animation: slideDown 0.3s ease;">
        <h2 style="margin:0 0 20px 0; font-size:18px;">Criar Nova Ordem de Produção</h2>
        
        <div class="form-group" style="margin-bottom:15px;">
          <label>Produto a Produzir</label>
          <select id="new-op-product" class="form-control">${prodOptions}</select>
        </div>
        
        <div class="form-group" style="margin-bottom:25px;">
          <label>Quantidade Programada</label>
          <input type="number" id="new-op-qty" class="form-control" value="100" min="1">
        </div>
        
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="document.getElementById('modal-backdrop').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="submitCreateOp()">Gerar Ordem (Planejada)</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitCreateOp = async () => {
  const productId = document.getElementById('new-op-product').value;
  const qty = document.getElementById('new-op-qty').value;
  
  if (!productId || !qty || qty <= 0) {
    alert("Preencha os campos corretamente.");
    return;
  }
  
  const res = await window.API.createProductionOrder(productId, qty);
  document.getElementById('modal-backdrop').remove();
  
  if (res.success) {
    renderProduction();
  } else {
    alert("Erro: " + res.error);
  }
};

window.submitReleaseOp = async (opId) => {
  if(confirm("Confirmar a Liberação da Ordem? Isso irá gerar as requisições/reservas de materiais e disponibilizar a ordem para a fábrica.")){
    const res = await window.API.releaseProductionOrder(opId);
    if (res.success) {
      renderOpDetails(opId);
    }
  }
};

window.startOpModal = (opId) => {
  const machines = window.productionState.machines.filter(m => m.status !== 'maintenance');
  const machOptions = machines.map(m => `<option value="${m.id}">${m.name} (${m.status === 'idle' ? 'Livre' : 'Ocupada'})</option>`).join('');
  
  const modalHtml = `
    <div id="modal-backdrop" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:999; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(3px);">
      <div class="card" style="width: 450px; padding: 25px;">
        <h2 style="margin:0 0 20px 0; font-size:18px;">Iniciar Produção (OP ${opId})</h2>
        <div class="form-group" style="margin-bottom:25px;">
          <label>Alocar Máquina / Posto</label>
          <select id="start-op-machine" class="form-control">
            <option value="">Sem máquina específica (Montagem Manual)</option>
            ${machOptions}
          </select>
        </div>
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="document.getElementById('modal-backdrop').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="submitStartOp('${opId}')">Iniciar Produção</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitStartOp = async (opId) => {
  const machineId = document.getElementById('start-op-machine').value;
  const res = await window.API.startProductionOrder(opId, machineId);
  document.getElementById('modal-backdrop').remove();
  
  if (res.success) {
    renderOpDetails(opId);
  }
};

window.reportOpModal = (opId) => {
  const modalHtml = `
    <div id="modal-backdrop" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:999; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(3px);">
      <div class="card" style="width: 450px; padding: 25px;">
        <h2 style="margin:0 0 20px 0; font-size:18px;">Apontamento de Produção</h2>
        
        <div class="form-group" style="margin-bottom:15px;">
          <label>Quantidade Boa Produzida</label>
          <input type="number" id="report-good-qty" class="form-control" value="0" min="0">
        </div>
        
        <div class="form-group" style="margin-bottom:15px;">
          <label>Quantidade Refugo (Scrap)</label>
          <input type="number" id="report-scrap-qty" class="form-control" value="0" min="0" onchange="document.getElementById('scrap-reason-container').style.display = this.value > 0 ? 'block' : 'none'">
        </div>

        <div class="form-group" id="scrap-reason-container" style="margin-bottom:25px; display:none;">
          <label style="color:var(--danger-color);">Motivo do Refugo</label>
          <select id="report-scrap-reason" class="form-control">
            <option value="Falha de Setup">Falha de Setup / Ajuste</option>
            <option value="Defeito no Material (MP)">Defeito no Material (MP)</option>
            <option value="Quebra de Ferramenta">Quebra de Ferramenta</option>
            <option value="Erro Operacional">Erro Operacional</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        
        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:20px;">
          <button class="btn btn-ghost" onclick="document.getElementById('modal-backdrop').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="submitReportOp('${opId}')">Salvar Apontamento</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitReportOp = async (opId) => {
  const good = parseInt(document.getElementById('report-good-qty').value) || 0;
  const scrap = parseInt(document.getElementById('report-scrap-qty').value) || 0;
  const reason = document.getElementById('report-scrap-reason').value;
  
  if (good === 0 && scrap === 0) {
    alert("Informe alguma quantidade para apontar.");
    return;
  }
  
  if (good > 0) await window.API.reportProduction(opId, good, false, '');
  if (scrap > 0) await window.API.reportProduction(opId, scrap, true, reason);
  
  document.getElementById('modal-backdrop').remove();
  renderOpDetails(opId);
};

window.finishOp = async (opId) => {
  if (confirm(`Tem certeza que deseja CONCLUIR a Ordem ${opId}?\n\nEsta ação dará entrada no estoque do produto final e dará saída nas matérias-primas da BOM (Backflush).`)) {
    const res = await window.API.finishProductionOrder(opId);
    if (res.success) {
      alert("Ordem de Produção concluída com sucesso! Um lote de inspeção (QM) foi gerado automaticamente.");
      renderOpDetails(opId);
    } else {
      alert("Erro ao concluir: " + res.error);
    }
  }
};

// ============================================================================
// Machine Details Modal
// ============================================================================

window.renderMachineDetails = (machineId) => {
  const machine = window.productionState.machines.find(m => m.id === machineId);
  if (!machine) return;

  // Calculate stats for this machine based on ops
  let totalProduced = 0;
  let totalScrap = 0;
  let opsCount = 0;
  const historyHtml = [];

  // Assuming OP history is in window.productionState.ops
  window.productionState.ops.forEach(op => {
    if (op.machineId === machineId) {
      opsCount++;
      totalProduced += op.producedQty;
      totalScrap += op.scrapQty;
      
      const prod = window.productionState.products.find(p => p.id === op.productId);
      const prodName = prod ? prod.sku : op.productId;

      historyHtml.push(`
        <tr style="border-bottom:1px solid var(--border-color);">
          <td style="padding:10px;"><strong>${op.id}</strong></td>
          <td style="padding:10px;">${prodName}</td>
          <td style="text-align:center; padding:10px;">${op.producedQty}</td>
          <td style="text-align:center; padding:10px; color:${op.scrapQty > 0 ? 'var(--danger-color)' : 'inherit'}">${op.scrapQty}</td>
          <td>${window.getStatusBadge(op.status)}</td>
          <td style="text-align:right;">
            <button class="btn btn-ghost btn-sm" onclick="document.getElementById('modal-backdrop-machine').remove(); renderOpDetails('${op.id}')">Ver OP</button>
          </td>
        </tr>
      `);
    }
  });

  const modalHtml = `
    <div id="modal-backdrop-machine" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:999; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(3px);">
      <div class="card" style="width: 800px; max-height: 90vh; overflow-y:auto; padding: 25px; animation: slideDown 0.3s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:20px;">
          <div>
            <h2 style="margin:0; font-size:20px; color:var(--primary-color);">🖥️ ${machine.name}</h2>
            <div style="font-size:12px; color:var(--text-muted); margin-top:5px;">ID: ${machine.id} | Tipo: ${machine.type} | Status atual: ${machine.status.toUpperCase()}</div>
          </div>
          <button class="btn btn-ghost" onclick="document.getElementById('modal-backdrop-machine').remove()">✕ Fechar</button>
        </div>
        
        <div class="grid-2" style="margin-bottom:20px;">
          <div class="kpi-card" style="padding:15px;">
            <div style="font-size:12px; color:var(--text-muted);">Total Produzido (Boa)</div>
            <div style="font-size:24px; font-weight:bold; color:var(--success-color);">${totalProduced} UN</div>
          </div>
          <div class="kpi-card" style="padding:15px;">
            <div style="font-size:12px; color:var(--text-muted);">Total Refugo (Scrap)</div>
            <div style="font-size:24px; font-weight:bold; color:var(--danger-color);">${totalScrap} UN</div>
          </div>
          <div class="kpi-card" style="padding:15px;">
            <div style="font-size:12px; color:var(--text-muted);">OPs Processadas</div>
            <div style="font-size:24px; font-weight:bold;">${opsCount}</div>
          </div>
          <div class="kpi-card" style="padding:15px;">
            <div style="font-size:12px; color:var(--text-muted);">OEE Atual</div>
            <div style="font-size:24px; font-weight:bold; color:var(--primary-color);">${machine.oee}%</div>
          </div>
        </div>

        <h3 style="font-size:16px; margin-bottom:10px;">Histórico de Ordens na Máquina</h3>
        <div class="table-container">
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Ordem</th>
                <th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Produto</th>
                <th style="text-align:center; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Produzido</th>
                <th style="text-align:center; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Refugo</th>
                <th style="text-align:left; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Status</th>
                <th style="text-align:right; padding:10px; border-bottom:2px solid var(--border-color); font-size:12px;">Ação</th>
              </tr>
            </thead>
            <tbody>
              ${historyHtml.length > 0 ? historyHtml.join('') : '<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">Nenhuma OP registrada nesta máquina.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.filterOpTable = () => {
  const text = document.getElementById('filter-op-text').value.toLowerCase();
  const status = document.getElementById('filter-op-status').value;
  const rows = document.querySelectorAll('#prod-tab-content table tbody tr');

  rows.forEach(row => {
    // Basic check for empty rows
    if (row.children.length < 5) return; 

    const opId = row.children[0].textContent.toLowerCase();
    const product = row.children[1].textContent.toLowerCase();
    const rowStatusBadge = row.children[5].textContent.trim();
    
    // Map badge text back to internal status (or just check badge text directly)
    // badges: Planejada, Liberada, Em Execução, Concluída
    let rowStatus = 'all';
    if (rowStatusBadge.includes('Planejada')) rowStatus = 'planned';
    else if (rowStatusBadge.includes('Liberada')) rowStatus = 'released';
    else if (rowStatusBadge.includes('Execução')) rowStatus = 'running';
    else if (rowStatusBadge.includes('Concluída')) rowStatus = 'completed';

    const matchText = opId.includes(text) || product.includes(text);
    const matchStatus = status === 'all' || rowStatus === status;

    if (matchText && matchStatus) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
};

window.filterMachineGrid = () => {
  const text = document.getElementById('filter-machine-text').value.toLowerCase();
  const cards = document.querySelectorAll('.machine-grid .machine-card');

  cards.forEach(card => {
    const cardText = card.textContent.toLowerCase();
    if (cardText.includes(text)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
};

window.filterBomTable = () => {
  const text = document.getElementById('filter-bom-text').value.toLowerCase();
  const rows = document.querySelectorAll('#prod-tab-content table tbody tr');

  rows.forEach(row => {
    if (row.children.length < 5) return;
    const rowText = row.textContent.toLowerCase();
    if (rowText.includes(text)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
};

// ============================================================================
// Routings (Process Map)
// ============================================================================

window.selectRoutingProduct = (productId) => {
  window.productionState.selectedRoutingProduct = productId;
  const contentEl = document.getElementById('prod-tab-content');
  contentEl.innerHTML = window.renderRoutingsTab();
};

window.renderRoutingsTab = () => {
  const products = window.productionState.products;
  const selectedId = window.productionState.selectedRoutingProduct || products[0].id;
  const selectedProd = products.find(p => p.id === selectedId);
  
  let routingHtml = '';
  if (selectedProd && selectedProd.routing && selectedProd.routing.length > 0) {
    routingHtml = selectedProd.routing.map((item, idx) => {
      const machine = window.productionState.machines.find(m => m.id === item.machineId);
      const machineName = machine ? machine.name : item.machineId;
      
      return `
        <tr>
          <td style="text-align:center;"><strong>${item.phase}</strong></td>
          <td>${item.name}</td>
          <td>${machineName}</td>
          <td style="text-align:center;">${item.setupTime} min</td>
          <td style="text-align:center;">${item.prodTime} min/un</td>
          <td style="text-align:center;">${item.humanTime || 0} min/un</td>
          <td style="text-align:right;">
            <button class="btn btn-ghost btn-sm" style="color:var(--danger-color);" onclick="removeRoutingPhase('${selectedId}', ${idx})">Remover</button>
          </td>
        </tr>
      `;
    }).join('');
  } else {
    routingHtml = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">Este produto não possui roteiro de produção cadastrado.</td></tr>`;
  }

  return `
    <div class="card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h3 class="card-title">Mapa de Processo / Roteiros</h3>
        <div style="display:flex; gap:10px;">
          <select class="form-control" style="width:300px; cursor:pointer;" onchange="selectRoutingProduct(this.value)">
            ${products.map(p => `<option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.sku} - ${p.name}</option>`).join('')}
          </select>
          <button class="btn btn-primary" onclick="openAddRoutingPhaseModal('${selectedId}')">➕ Adicionar Fase</button>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="text-align:center;">Fase / Op</th>
              <th style="text-align:left;">Descrição da Operação</th>
              <th style="text-align:left;">Centro de Trabalho (Máquina)</th>
              <th style="text-align:center;">Tempo de Setup</th>
              <th style="text-align:center;">Tempo de Máquina (HM)</th>
              <th style="text-align:center;">Tempo Homem (HH)</th>
              <th style="text-align:right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${routingHtml}
          </tbody>
        </table>
      </div>
      <div style="padding:15px; background:var(--bg-elevated); margin-top:10px; border-radius:var(--radius-md);">
        <p style="font-size:12px; color:var(--text-muted); margin:0;">
          💡 <strong>Nota sobre Roteiros:</strong> O Roteiro de Produção define a sequência de operações e as máquinas padrões onde o produto será fabricado. Durante a Liberação da OP, o sistema sugerirá as máquinas alocadas neste roteiro.
        </p>
      </div>
    </div>
  `;
};

window.openAddRoutingPhaseModal = (productId) => {
  const machines = window.productionState.machines;
  const machOptions = machines.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  
  const modalHtml = `
    <div id="modal-backdrop-routing" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:999; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(3px);">
      <div class="card" style="width: 450px; padding: 25px;">
        <h2 style="margin:0 0 20px 0; font-size:18px;">Adicionar Fase ao Roteiro</h2>
        
        <div class="form-group" style="margin-bottom:15px;">
          <label>Nº da Fase (ex: 0010, 0020)</label>
          <input type="text" id="new-rout-phase" class="form-control" value="0010">
        </div>
        
        <div class="form-group" style="margin-bottom:15px;">
          <label>Descrição (ex: Corte, Solda)</label>
          <input type="text" id="new-rout-name" class="form-control">
        </div>
        
        <div class="form-group" style="margin-bottom:15px;">
          <label>Centro de Trabalho (Máquina Padrão)</label>
          <select id="new-rout-machine" class="form-control">
            ${machOptions}
          </select>
        </div>

        <div class="grid-3" style="gap:15px; margin-bottom:25px;">
          <div class="form-group">
            <label>T. Setup (min)</label>
            <input type="number" id="new-rout-setup" class="form-control" value="0">
          </div>
          <div class="form-group">
            <label>T. HM/Un (min)</label>
            <input type="number" id="new-rout-prod" class="form-control" value="1">
          </div>
          <div class="form-group">
            <label>T. HH/Un (min)</label>
            <input type="number" id="new-rout-human" class="form-control" value="1">
          </div>
        </div>
        
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button class="btn btn-ghost" onclick="document.getElementById('modal-backdrop-routing').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="submitAddRoutingPhase('${productId}')">Salvar Fase</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.submitAddRoutingPhase = (productId) => {
  const phase = document.getElementById('new-rout-phase').value;
  const name = document.getElementById('new-rout-name').value;
  const machineId = document.getElementById('new-rout-machine').value;
  const setupTime = parseInt(document.getElementById('new-rout-setup').value) || 0;
  const prodTime = parseInt(document.getElementById('new-rout-prod').value) || 0;
  const humanTime = parseInt(document.getElementById('new-rout-human').value) || 0;

  if (!phase || !name) {
    alert("Preencha a Fase e Descrição.");
    return;
  }

  const prod = window.productionState.products.find(p => p.id === productId);
  if (prod) {
    if (!prod.routing) prod.routing = [];
    prod.routing.push({ phase, name, machineId, setupTime, prodTime, humanTime });
    prod.routing.sort((a, b) => a.phase.localeCompare(b.phase));
  }

  document.getElementById('modal-backdrop-routing').remove();
  window.selectRoutingProduct(productId);
};

window.removeRoutingPhase = (productId, idx) => {
  if (confirm("Remover esta fase do roteiro?")) {
    const prod = window.productionState.products.find(p => p.id === productId);
    if (prod && prod.routing) {
      prod.routing.splice(idx, 1);
      window.selectRoutingProduct(productId);
    }
  }
};

window.viewProductMaster = (productId) => {
  const prod = window.productionState.products.find(p => p.id === productId);
  if (!prod) return;
  
  window.productionState.masterProductTab = 'bom';
  
  const modalHtml = `
    <div id="modal-backdrop-master" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:999; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(3px);">
      <div class="card" style="width: 900px; max-height: 90vh; overflow-y:auto; padding: 0; animation: slideDown 0.3s ease; display:flex; flex-direction:column;">
        
        <!-- Header -->
        <div style="padding: 25px; border-bottom:1px solid var(--border-color); background:var(--bg-elevated); border-radius: 8px 8px 0 0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="display:flex; gap:15px; align-items:center;">
              <div style="font-size:40px;">📦</div>
              <div>
                <h2 style="margin:0; font-size:24px; color:var(--text-main);">${prod.sku}</h2>
                <div style="font-size:14px; color:var(--text-muted); margin-top:2px;">${prod.name} | UM: ${prod.unit}</div>
              </div>
            </div>
            <button class="btn btn-ghost" onclick="document.getElementById('modal-backdrop-master').remove()">✕ Fechar</button>
          </div>
        </div>
        
        <!-- Tabs Nav -->
        <div class="tab-nav" style="padding: 0 25px; border-bottom:1px solid var(--border-color); background:var(--bg-base);">
          <button class="tab-btn active" id="btn-master-bom" onclick="switchProductMasterTab('bom')">📄 Composição (BOM)</button>
          <button class="tab-btn" id="btn-master-routing" onclick="switchProductMasterTab('routing')">🗺️ Mapa de Processos & Setores</button>
        </div>
        
        <!-- Tab Content -->
        <div id="product-master-content" style="padding: 25px; background:var(--bg-base); flex:1;">
          ${renderProductMasterBom(prod)}
        </div>
        
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.switchProductMasterTab = (tabId) => {
  document.getElementById('btn-master-bom').classList.remove('active');
  document.getElementById('btn-master-routing').classList.remove('active');
  document.getElementById('btn-master-' + tabId).classList.add('active');
  
  const prodId = document.querySelector('#modal-backdrop-master h2').textContent;
  const prod = window.productionState.products.find(p => p.sku === prodId);
  const content = document.getElementById('product-master-content');
  
  if (tabId === 'bom') content.innerHTML = renderProductMasterBom(prod);
  if (tabId === 'routing') content.innerHTML = renderProductMasterRouting(prod);
};

window.renderProductMasterBom = (prod) => {
  let bomHtml = '';
  if (prod && prod.bom && prod.bom.length > 0) {
    bomHtml = prod.bom.map(item => `
      <tr>
        <td><strong>${item.sku}</strong></td>
        <td>${item.name}</td>
        <td style="text-align:center;">${item.qty} ${item.unit}</td>
        <td>Matéria-Prima (ROH)</td>
      </tr>
    `).join('');
  } else {
    bomHtml = `<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">Este produto não possui estrutura (BOM) cadastrada.</td></tr>`;
  }
  
  return `
    <h3 style="margin-top:0; font-size:16px;">Estrutura do Produto (BOM)</h3>
    <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Listagem de componentes e matérias-primas necessários para fabricar 1 ${prod.unit} de ${prod.sku}.</p>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Componente (SKU)</th>
            <th style="text-align:left;">Descrição</th>
            <th style="text-align:center;">Qtd. Base</th>
            <th style="text-align:left;">Tipo</th>
          </tr>
        </thead>
        <tbody>
          ${bomHtml}
        </tbody>
      </table>
    </div>
  `;
};

window.renderProductMasterRouting = (prod) => {
  let routingHtml = '';
  if (prod && prod.routing && prod.routing.length > 0) {
    routingHtml = prod.routing.map((item, idx) => {
      const machine = window.productionState.machines.find(m => m.id === item.machineId);
      const machineName = machine ? machine.name : item.machineId;
      const sector = machine ? DATA.sectors.find(s => s.id === machine.sectorId) : null;
      const sectorName = sector ? sector.name : 'Geral';
      
      return `
        <tr>
          <td style="text-align:center;"><strong>${item.phase}</strong></td>
          <td>${item.name}</td>
          <td>${sectorName}</td>
          <td>${machineName}</td>
          <td style="text-align:center;">${item.setupTime} min</td>
          <td style="text-align:center;">${item.prodTime} min</td>
          <td style="text-align:center;">${item.humanTime || 0} min</td>
        </tr>
      `;
    }).join('');
  } else {
    routingHtml = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">Este produto não possui roteiro de produção cadastrado.</td></tr>`;
  }
  
  return `
    <h3 style="margin-top:0; font-size:16px;">Mapa de Processo / Roteiros</h3>
    <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Sequência de fabricação, vinculando cada fase ao seu respectivo Setor Fabril e Centro de Trabalho.</p>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="text-align:center;">Fase</th>
            <th style="text-align:left;">Operação</th>
            <th style="text-align:left;">Setor Fabril</th>
            <th style="text-align:left;">Centro de Trabalho</th>
            <th style="text-align:center;">Setup</th>
            <th style="text-align:center;">HM/Un</th>
            <th style="text-align:center;">HH/Un</th>
          </tr>
        </thead>
        <tbody>
          ${routingHtml}
        </tbody>
      </table>
    </div>
  `;
};
