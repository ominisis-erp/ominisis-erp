// ============================================================
// MASTER DATA (CADASTROS) MODULE — OminiSis Enterprise ERP
// ============================================================

let currentMasterTab = 'customers';
let masterDataCache = null;

window.renderMasterData = async function() {
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div class="animate-in" style="display:flex;flex-direction:column;gap:20px;opacity:0.6">
      <div style="height:80px;background:var(--bg-elevated);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
      <div style="height:400px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
    </div>
  `;

  masterDataCache = await window.API.getMasterData();

  content.innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">🗂️ Cadastros Base</h1>
          <p class="module-subtitle">Gestão centralizada de Clientes, Fornecedores, Materiais e Estruturas</p>
        </div>
      </div>

      <div class="tab-nav" id="master-tabs">
        <button class="tab-btn ${currentMasterTab === 'customers' ? 'active' : ''}" onclick="switchMasterTab('customers', this)">🤝 Clientes</button>
        <button class="tab-btn ${currentMasterTab === 'suppliers' ? 'active' : ''}" onclick="switchMasterTab('suppliers', this)">🏢 Fornecedores</button>
        <button class="tab-btn ${currentMasterTab === 'products' ? 'active' : ''}" onclick="switchMasterTab('products', this)">📦 Materiais e BOM</button>
        <button class="tab-btn ${currentMasterTab === 'hierarchies' ? 'active' : ''}" onclick="switchMasterTab('hierarchies', this)">🌳 Hierarquias</button>
      </div>

      <div id="master-content"></div>
    </div>
  `;

  renderCurrentMasterTab();
};

window.switchMasterTab = (tab, btn) => {
  currentMasterTab = tab;
  document.querySelectorAll('#master-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCurrentMasterTab();
};

window.renderCurrentMasterTab = () => {
  const container = document.getElementById('master-content');
  if (currentMasterTab === 'customers') container.innerHTML = getCustomersHtml(masterDataCache.customers);
  if (currentMasterTab === 'suppliers') container.innerHTML = getSuppliersHtml(masterDataCache.suppliers);
  if (currentMasterTab === 'products') container.innerHTML = getProductsHtml(masterDataCache.products);
  if (currentMasterTab === 'hierarchies') container.innerHTML = getHierarchiesHtml(masterDataCache.hierarchies);
};

// ============================================================
// LISTINGS
// ============================================================

function getCustomersHtml(customers) {
  return `
    <div class="card animate-in">
      <div class="card-header">
        <h3 class="card-title">Clientes / Parceiros de Negócios</h3>
        <button class="btn btn-primary btn-sm" onclick="renderCustomerForm()">➕ Novo Cliente</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th><th>Nome</th><th>Documento</th><th>Email</th><th>Condição Comercial</th><th>Desc. Padrão</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(c => `
              <tr onclick="renderCustomerDetails('${c.id}')" style="cursor:pointer">
                <td><strong>${c.id}</strong></td>
                <td>${c.name}</td>
                <td>${c.document}</td>
                <td>${c.email}</td>
                <td><span class="badge badge-info">${c.commercialCondition}</span></td>
                <td>${c.defaultDiscount}%</td>
                <td>${window.getStatusBadge(c.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function getSuppliersHtml(suppliers) {
  return `
    <div class="card animate-in">
      <div class="card-header">
        <h3 class="card-title">Fornecedores</h3>
        <button class="btn btn-primary btn-sm" onclick="alert('Formulário em construção')">➕ Novo Fornecedor</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th><th>Nome</th><th>Documento</th><th>Email</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${suppliers.map(s => `
              <tr onclick="renderSupplierDetails('${s.id}')" style="cursor:pointer">
                <td><strong>${s.id}</strong></td>
                <td>${s.name}</td>
                <td>${s.document}</td>
                <td>${s.email}</td>
                <td>${window.getStatusBadge(s.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function getProductsHtml(products) {
  return `
    <div class="card animate-in">
      <div class="card-header">
        <h3 class="card-title">Mestre de Materiais e BOM</h3>
        <button class="btn btn-primary btn-sm" onclick="renderProductForm()">➕ Novo Material</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th><th>SKU</th><th>Nome</th><th>Tipo</th><th>Hierarquia</th><th>Preço Base</th><th>Estrutura (BOM)</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const typeMap = { ROH: 'Matéria-Prima', HALB: 'Componente', FERT: 'Acabado', KIT: 'Kit Comercial' };
              const typeColor = p.type === 'ROH' ? 'var(--text-muted)' : p.type === 'HALB' ? 'var(--primary-color)' : p.type === 'KIT' ? 'var(--accent-color)' : 'var(--success-color)';
              const hasBom = p.bom && p.bom.length > 0;
              return `
                <tr onclick="renderProductDetails('${p.id}')" style="cursor:pointer">
                  <td><strong>${p.id}</strong></td>
                  <td>${p.sku}</td>
                  <td>${p.name}</td>
                  <td><span style="color: ${typeColor}; font-weight: 600;">${p.type} - ${typeMap[p.type]}</span></td>
                  <td>${p.hierarchy}</td>
                  <td>${window.formatCurrency(p.basePrice)}</td>
                  <td>${hasBom ? `<span class="badge badge-success">Sim (${p.bom.length} itens)</span>` : `<span class="badge badge-muted">Não</span>`}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function getHierarchiesHtml(hierarchies) {
  return `
    <div class="card animate-in">
      <div class="card-header">
        <h3 class="card-title">Hierarquia de Produtos e Comissões</h3>
        <button class="btn btn-primary btn-sm" onclick="alert('Em construção')">➕ Nova Hierarquia</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th><th>Nome da Hierarquia</th><th>% Comissão Base</th>
            </tr>
          </thead>
          <tbody>
            ${hierarchies.map(h => `
              <tr onclick="renderHierarchyDetails('${h.id}')" style="cursor:pointer">
                <td><strong>${h.id}</strong></td>
                <td>${h.name}</td>
                <td><strong>${h.commission}%</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================
// FORMS
// ============================================================

window.renderCustomerForm = () => {
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div class="animate-in" style="padding-bottom: 60px;">
      <div class="advanced-form-header" style="position:sticky; top:0; z-index:10; background:var(--bg-base); padding: 15px 20px; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
        <h1 class="module-title" style="margin:0; font-size: 24px;">Cliente ou Fornecedor</h1>
        <div style="display:flex; gap: 10px; align-items:center;">
          <span style="font-size:12px; color:var(--text-danger)">(*) Campos obrigatórios</span>
          <button class="btn btn-ghost" style="border: 1px solid var(--border-color);" onclick="renderMasterData()">Cancelar</button>
          <button class="btn btn-primary" style="background:var(--success-color);" onclick="saveCustomer()" id="btn-save-customer">Salvar</button>
        </div>
      </div>
      
      <div style="padding: 20px; max-width: 1200px; margin: 0 auto; display:flex; flex-direction:column; gap: 30px;">
        
        <!-- DADOS CADASTRAIS -->
        <div class="form-section">
          <h3 style="margin-bottom:15px; color:var(--text-main); font-weight:600; font-size: 16px;">Dados cadastrais</h3>
          
          <div style="display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 15px; margin-bottom:15px;">
            <div class="form-group">
              <label>Nome <span style="color:var(--text-danger)">*</span></label>
              <input type="text" id="cust-name" class="form-control" style="border-color:var(--success-color);" required>
            </div>
            <div class="form-group">
              <label>Fantasia</label>
              <input type="text" id="cust-fantasy" class="form-control">
            </div>
            <div class="form-group">
              <label>Código</label>
              <input type="text" id="cust-code" class="form-control">
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom:15px;">
            <div class="form-group">
              <label>Tipo da Pessoa</label>
              <select class="form-control"><option>Pessoa Jurídica</option><option>Pessoa Física</option></select>
            </div>
            <div class="form-group">
              <label>CNPJ/CPF <span style="color:var(--text-danger)">*</span></label>
              <input type="text" id="cust-doc" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Cliente desde</label>
              <input type="date" class="form-control" value="2026-07-04">
            </div>
            <div class="form-group">
              <label>Contribuinte</label>
              <select class="form-control"><option>9 - Não contribuinte</option><option>1 - Contribuinte ICMS</option></select>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
            <div class="form-group">
              <label>Inscrição Estadual</label>
              <input type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>RG</label>
              <input type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>Órgão Emissor</label>
              <input type="text" class="form-control">
            </div>
          </div>
        </div>

        <!-- ENDERECO -->
        <div class="form-section">
          <h3 style="margin-bottom:10px; color:var(--text-main); font-weight:600; font-size: 16px;">Endereço</h3>
          <div style="display:flex; gap:20px; border-bottom:1px solid var(--border-color); margin-bottom:15px;">
            <div style="padding-bottom:5px; border-bottom: 3px solid var(--success-color); color:var(--text-main); font-weight:600; cursor:pointer;">Geral</div>
            <div style="padding-bottom:5px; color:var(--text-muted); cursor:pointer;">Cobrança</div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 2fr 2fr; gap: 15px; margin-bottom:15px;">
            <div class="form-group">
              <label>CEP</label>
              <input type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>UF</label>
              <select class="form-control"><option>SP</option><option>MG</option><option>RJ</option></select>
            </div>
            <div class="form-group">
              <label>Cidade</label>
              <input type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>Bairro</label>
              <input type="text" class="form-control">
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 3fr 1fr 2fr; gap: 15px;">
            <div class="form-group">
              <label>Endereço</label>
              <input type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>Número</label>
              <input type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>Complemento</label>
              <input type="text" class="form-control">
            </div>
          </div>
        </div>

        <!-- CONTATO -->
        <div class="form-section">
          <h3 style="margin-bottom:15px; color:var(--text-main); font-weight:600; font-size: 16px;">Contato</h3>
          <div class="form-group" style="margin-bottom:15px;">
            <label>Informações do contato</label>
            <input type="text" class="form-control">
          </div>
          <div class="form-group" style="margin-bottom:15px;">
            <label>Pessoas de contato</label>
            <div style="display:flex;">
              <input type="text" class="form-control" style="border-radius: var(--radius-md) 0 0 var(--radius-md);">
              <button class="btn btn-outline" style="border-radius: 0 var(--radius-md) var(--radius-md) 0; color:var(--success-color); border-color:var(--border-color);">+</button>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 2fr; gap: 15px; margin-bottom:15px;">
            <div class="form-group"><label>Fone</label><input type="text" class="form-control"></div>
            <div class="form-group"><label>Fax</label><input type="text" class="form-control"></div>
            <div class="form-group"><label>Celular</label><input type="text" class="form-control"></div>
            <div class="form-group"><label>Operadora</label><select class="form-control"><option>Operadora</option></select></div>
            <div class="form-group"><label>E-Mail</label><input type="email" id="cust-email" class="form-control"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: 2fr 2fr 2fr 1fr; gap: 15px;">
            <div class="form-group"><label>E-Mail para envio da NFe</label><input type="email" class="form-control"></div>
            <div class="form-group"><label>WebSite</label><input type="text" class="form-control"></div>
            <div class="form-group"><label>Skype</label><input type="text" class="form-control"></div>
            <div class="form-group"><label>Próxima visita</label><input type="date" class="form-control"></div>
          </div>
        </div>
        
        <!-- DADOS ADICIONAIS -->
        <div class="form-section">
          <h3 style="margin-bottom:15px; color:var(--success-color); font-weight:600; cursor:pointer; font-size: 16px;">Dados adicionais <span style="font-size:12px;">▼</span></h3>
          
          <div style="display:grid; grid-template-columns: 1fr 120px; gap: 20px;">
            <div>
              <div class="form-group" style="margin-bottom:15px;">
                <label>% carga média (opcional)</label>
                <input type="text" class="form-control">
              </div>
              <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1.5fr; gap: 15px; margin-bottom:15px;">
                <div class="form-group"><label>Estado civil</label><select class="form-control"><option>Selecione</option></select></div>
                <div class="form-group"><label>Profissão</label><input type="text" class="form-control"></div>
                <div class="form-group"><label>Sexo</label><select class="form-control"><option>Selecione</option></select></div>
                <div class="form-group"><label>Data Nascimento</label><input type="date" class="form-control"></div>
                <div class="form-group"><label>Naturalidade</label><input type="text" class="form-control"></div>
              </div>
              <div style="display: grid; grid-template-columns: 2fr 1fr 2fr 1fr; gap: 15px; margin-bottom:15px;">
                <div class="form-group"><label>Nome do Pai</label><input type="text" class="form-control"></div>
                <div class="form-group"><label>CPF do Pai</label><input type="text" class="form-control"></div>
                <div class="form-group"><label>Nome da Mãe</label><input type="text" class="form-control"></div>
                <div class="form-group"><label>CPF da Mãe</label><input type="text" class="form-control"></div>
              </div>
              <div style="display: grid; grid-template-columns: 2fr 1.5fr 2fr; gap: 15px; margin-bottom:15px;">
                <div class="form-group"><label>Tipo de Contato</label><input type="text" class="form-control" placeholder="Adicionar contato"></div>
                <div class="form-group"><label>Situação</label><select class="form-control"><option>Ativo</option><option>Inativo</option></select></div>
                <div class="form-group"><label>Vendedor</label><input type="text" class="form-control"></div>
              </div>
              <div style="display: grid; grid-template-columns: 2fr 2fr; gap: 15px;">
                <div class="form-group"><label>Natureza de Operação Padrão</label><input type="text" class="form-control"></div>
                <div class="form-group"><label>Indicador de Uso e Consumo (NFS-e)</label><select class="form-control"><option>0 - Não (operação B2B)</option></select></div>
              </div>
            </div>
            
            <div>
               <label style="display:block; font-size:12px; color:var(--text-muted); margin-bottom:5px;">Foto</label>
               <div style="width:100px; height:100px; border:2px dashed var(--success-color); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:var(--success-color); font-size:24px; cursor:pointer;">+</div>
            </div>
          </div>
        </div>

        <!-- FINANCEIRO -->
        <div class="form-section">
          <h3 style="margin-bottom:15px; color:var(--text-main); font-weight:600; font-size: 16px;">Financeiro</h3>
          
          <div style="display:flex; align-items:center; gap: 15px; margin-bottom:15px;">
            <label style="font-size:12px; color:var(--text-muted); margin:0;">Limite de crédito</label>
            <div style="display:flex; align-items:center; gap:5px; font-size:14px; color:var(--text-main);">
              <input type="radio" name="credit" checked> Ilimitado
              <input type="radio" name="credit" style="margin-left:10px;"> Limite zero
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group"><label>Condição de pagamento</label><input type="text" class="form-control"></div>
            <div class="form-group"><label>Categoria</label><select class="form-control"><option>Sem categoria</option></select></div>
          </div>
        </div>
        
        <!-- OBSERVACOES -->
        <div class="form-section">
          <h3 style="margin-bottom:15px; color:var(--text-main); font-weight:600; font-size: 16px;">Observações</h3>
          <textarea class="form-control" style="min-height:100px;"></textarea>
        </div>
        
        <!-- ANEXOS -->
        <div class="form-section" style="padding-bottom: 20px;">
          <h3 style="margin-bottom:15px; color:var(--text-main); font-weight:600; cursor:pointer; font-size: 16px;">Anexos <span style="color:var(--success-color)">></span></h3>
        </div>

      </div>
    </div>
  `;
};

window.saveCustomer = async () => {
  const name = document.getElementById('cust-name').value;
  const documentVal = document.getElementById('cust-doc').value;
  const email = document.getElementById('cust-email').value;
  
  if (!name || !documentVal) return alert('Razão Social e Documento são obrigatórios.');
  
  const btn = document.getElementById('btn-save-customer');
  btn.innerHTML = 'Salvando...';
  btn.disabled = true;
  
  await window.API.addCustomer({
    name,
    document: documentVal,
    email: email || '',
    commercialCondition: 'Padrão',
    defaultDiscount: 0
  });
  
  renderMasterData();
};

window.renderProductForm = () => {
  const content = document.getElementById('content');
  
  let hierarchiesOptions = masterDataCache.hierarchies.map(h => `<option value="${h.id}">${h.name} (${h.commission}% Comiss)</option>`).join('');
  let productsOptions = masterDataCache.products.map(p => `<option value="${p.sku}">${p.sku} - ${p.name} (${p.type})</option>`).join('');
  
  content.innerHTML = `
    <div class="animate-in">
      <div class="advanced-form-header">
        <div style="display:flex; align-items:center; gap: 15px;">
          <button class="btn btn-ghost" onclick="renderMasterData()">← Voltar</button>
          <div>
            <h1 class="module-title" style="margin-bottom:2px;">Novo Material</h1>
            <p class="module-subtitle">Cadastro de Produto / Matéria-Prima com Engenharia (BOM)</p>
          </div>
        </div>
        <div style="display:flex; gap: 10px;">
          <button class="btn btn-ghost" onclick="renderMasterData()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveProduct()" id="btn-save-product">💾 Salvar Material</button>
        </div>
      </div>
      
      <div class="advanced-section">
        <h3 class="advanced-section-title">Dados Básicos do Material</h3>
        <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 15px;">
          <div class="form-group">
            <label>SKU (Código Interno)</label>
            <input type="text" id="prod-sku" class="form-control" placeholder="Ex: FERT-123">
          </div>
          <div class="form-group">
            <label>Descrição do Material</label>
            <input type="text" id="prod-name" class="form-control" placeholder="Ex: Bomba d'Água Industrial">
          </div>
          <div class="form-group">
            <label>Preço Base / Custo (R$)</label>
            <input type="number" id="prod-price" class="form-control" placeholder="0.00" value="0">
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
          <div class="form-group">
            <label>Tipo de Material</label>
            <select id="prod-type" class="form-control" onchange="toggleBOMSection()">
              <option value="ROH">Matéria-Prima (ROH)</option>
              <option value="HALB">Componente (HALB)</option>
              <option value="FERT">Produto Acabado Fabricado (FERT)</option>
              <option value="KIT">Kit Comercial (KIT)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Hierarquia / Comissão</label>
            <select id="prod-hierarchy" class="form-control">
              ${hierarchiesOptions}
            </select>
          </div>
          <div class="form-group">
            <label>Unidade de Medida</label>
            <select id="prod-unit" class="form-control">
              <option value="UN">Unidade (UN)</option>
              <option value="KG">Quilograma (KG)</option>
              <option value="M">Metros (M)</option>
              <option value="CX">Caixa (CX)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="advanced-section">
        <h3 class="advanced-section-title">Fornecedores Homologados</h3>
        <div class="form-group" style="max-width: 500px;">
          <label>Selecione os fornecedores para este material (Cotações futuras)</label>
          <select id="prod-suppliers" class="form-control" multiple style="height: 80px;">
            ${masterDataCache.suppliers.map(s => `<option value="${s.id}">${s.name} (${s.document})</option>`).join('')}
          </select>
          <small style="color:var(--text-muted)">Segure CTRL (ou CMD) para selecionar múltiplos.</small>
        </div>
      </div>
      
      <!-- ENGENHARIA DE PRODUTO (BOM) -->
      <div class="advanced-section" id="bom-section" style="display: none; border-left: 4px solid var(--accent-color);">
        <h3 class="advanced-section-title">Engenharia de Produto (BOM) <span style="font-size:12px; font-weight:normal; margin-left: 10px; color: var(--text-muted);">Defina a estrutura/receita de fabricação</span></h3>
        
        <table style="width:100%; border-collapse:collapse; margin-bottom: 10px;" id="bom-table">
          <thead>
            <tr>
              <th style="width:50px">Item</th>
              <th style="width:40%">Componente / Matéria-Prima</th>
              <th>Un. Medida</th>
              <th>Custo Unit. Ref</th>
              <th style="width:15%">Qtd Base</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="bom-items-body">
            <!-- Items will be injected here -->
          </tbody>
        </table>
        
        <button class="btn btn-secondary btn-sm" onclick="addBOMRow()">+ Adicionar Componente</button>
      </div>
    </div>
  `;
};

window.toggleBOMSection = () => {
  const type = document.getElementById('prod-type').value;
  const bomSection = document.getElementById('bom-section');
  if (type === 'FERT' || type === 'HALB' || type === 'KIT') {
    bomSection.style.display = 'block';
    if (document.getElementById('bom-items-body').children.length === 0) {
      addBOMRow(); // Add first row automatically
    }
  } else {
    bomSection.style.display = 'none';
  }
};

let bomRowCount = 0;
window.addBOMRow = () => {
  bomRowCount++;
  const tbody = document.getElementById('bom-items-body');
  const tr = document.createElement('tr');
  tr.id = `bom-row-${bomRowCount}`;
  
  let productsOptions = '<option value="">Selecione...</option>';
  masterDataCache.products.forEach(p => {
    productsOptions += `<option value="${p.sku}" data-unit="${p.unit}" data-price="${p.basePrice}">${p.sku} - ${p.name}</option>`;
  });

  tr.innerHTML = `
    <td style="text-align:center"><strong>${bomRowCount * 10}</strong></td>
    <td>
      <select class="table-input bom-sku-select" style="width:100%" onchange="updateBOMRow(this)">
        ${productsOptions}
      </select>
    </td>
    <td class="bom-unit-display">-</td>
    <td class="bom-price-display">-</td>
    <td><input type="number" class="table-input bom-qty-input" placeholder="0.00" style="width:100%"></td>
    <td><button class="btn btn-ghost" style="color:var(--danger-color); padding: 4px 8px;" onclick="this.closest('tr').remove()">Excluir</button></td>
  `;
  
  tbody.appendChild(tr);
};

window.updateBOMRow = (selectElem) => {
  const option = selectElem.options[selectElem.selectedIndex];
  const tr = selectElem.closest('tr');
  if(option.value) {
    tr.querySelector('.bom-unit-display').textContent = option.getAttribute('data-unit');
    tr.querySelector('.bom-price-display').textContent = window.formatCurrency(Number(option.getAttribute('data-price')));
  } else {
    tr.querySelector('.bom-unit-display').textContent = '-';
    tr.querySelector('.bom-price-display').textContent = '-';
  }
};

window.saveProduct = async () => {
  const sku = document.getElementById('prod-sku').value;
  const name = document.getElementById('prod-name').value;
  const basePrice = document.getElementById('prod-price').value;
  const type = document.getElementById('prod-type').value;
  const hierarchy = document.getElementById('prod-hierarchy').value;
  const unit = document.getElementById('prod-unit').value;
  
  const suppliersSelect = document.getElementById('prod-suppliers');
  const approvedSuppliers = Array.from(suppliersSelect.selectedOptions).map(opt => opt.value);
  
  if (!sku || !name) return alert('SKU e Descrição são obrigatórios.');
  
  const bom = [];
  if (type === 'FERT' || type === 'HALB' || type === 'KIT') {
    const rows = document.querySelectorAll('#bom-items-body tr');
    rows.forEach(tr => {
      const itemSku = tr.querySelector('.bom-sku-select').value;
      const qty = Number(tr.querySelector('.bom-qty-input').value);
      if (itemSku && qty > 0) {
        bom.push({ itemSku, qty });
      }
    });
  }
  
  const btn = document.getElementById('btn-save-product');
  btn.innerHTML = 'Salvando...';
  btn.disabled = true;
  
  await window.API.addProduct({
    sku,
    name,
    basePrice: Number(basePrice),
    type,
    hierarchy,
    unit,
    suppliers: approvedSuppliers,
    bom: bom.length > 0 ? bom : null
  });
  
  renderMasterData();
};

window.renderProductDetails = (id) => {
  const product = masterDataCache.products.find(p => p.id === id);
  if (!product) return alert('Produto não encontrado');
  
  const content = document.getElementById('content');
  const typeMap = { ROH: 'Matéria-Prima', HALB: 'Componente', FERT: 'Acabado', KIT: 'Kit Comercial' };
  
  let suppliersHtml = '<p style="color:var(--text-muted)">Nenhum fornecedor homologado.</p>';
  if (product.suppliers && product.suppliers.length > 0) {
    const suppliers = product.suppliers.map(sid => masterDataCache.suppliers.find(s => s.id === sid)).filter(Boolean);
    suppliersHtml = `
      <table style="width:100%; border-collapse:collapse;">
        <thead><tr><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Fornecedor</th><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Documento</th></tr></thead>
        <tbody>
          ${suppliers.map(s => `<tr><td style="padding:8px; border-bottom:1px solid var(--border-color);">${s.name}</td><td style="padding:8px; border-bottom:1px solid var(--border-color);">${s.document}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }
  
  let bomHtml = '';
  if (product.bom && product.bom.length > 0) {
    bomHtml = `
      <div class="advanced-section">
        <h3 class="advanced-section-title">Estrutura do Produto (BOM)</h3>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left; padding:8px; border-bottom:1px solid var(--border-color);">SKU</th>
              <th style="text-align:left; padding:8px; border-bottom:1px solid var(--border-color);">Componente</th>
              <th style="text-align:right; padding:8px; border-bottom:1px solid var(--border-color);">Qtd Base</th>
            </tr>
          </thead>
          <tbody>
            ${product.bom.map(b => {
              const bItem = masterDataCache.products.find(p => p.sku === b.itemSku) || { name: 'Desconhecido' };
              return `<tr>
                <td style="padding:8px; border-bottom:1px solid var(--border-color);">${b.itemSku}</td>
                <td style="padding:8px; border-bottom:1px solid var(--border-color);">${bItem.name}</td>
                <td style="text-align:right; padding:8px; border-bottom:1px solid var(--border-color);">${b.qty}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="animate-in">
      <div class="advanced-form-header">
        <div style="display:flex; align-items:center; gap: 15px;">
          <button class="btn btn-ghost" onclick="renderMasterData()">← Voltar</button>
          <div>
            <h1 class="module-title" style="margin-bottom:2px;">Detalhes do Material</h1>
            <p class="module-subtitle">${product.sku} - ${product.name}</p>
          </div>
        </div>
        <div style="display:flex; gap: 10px;">
          <button class="btn btn-secondary" onclick="printProductDatasheet('${product.id}')">🖨️ Imprimir Ficha</button>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 20px;">
        <div>
          <div class="card" style="margin-bottom:20px; padding:20px;">
            <h3 class="advanced-section-title" style="margin-top:0;">Dados Principais</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div><strong style="color:var(--text-muted);font-size:12px;">Código do Sistema</strong><br>${product.id}</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">SKU</strong><br>${product.sku}</div>
              <div style="grid-column: 1 / -1"><strong style="color:var(--text-muted);font-size:12px;">Descrição</strong><br>${product.name}</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">Tipo de Material</strong><br>${product.type} - ${typeMap[product.type] || product.type}</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">Preço Base</strong><br>${window.formatCurrency(product.basePrice)}</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">Hierarquia</strong><br>${product.hierarchy}</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">Unidade</strong><br>${product.unit}</div>
            </div>
          </div>
          ${bomHtml}
        </div>
        <div>
          <div class="card" style="padding:20px;">
            <h3 class="advanced-section-title" style="margin-top:0;">Fornecedores Homologados</h3>
            ${suppliersHtml}
          </div>
        </div>
      </div>
    </div>
  `;
};

window.printProductDatasheet = (id) => {
  const product = masterDataCache.products.find(p => p.id === id);
  if (!product) return;
  const typeMap = { ROH: 'Matéria-Prima', HALB: 'Componente', FERT: 'Acabado', KIT: 'Kit Comercial' };

  let suppliersHtml = 'Nenhum fornecedor homologado.';
  if (product.suppliers && product.suppliers.length > 0) {
    const suppliers = product.suppliers.map(sid => masterDataCache.suppliers.find(s => s.id === sid)).filter(Boolean);
    suppliersHtml = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
        <thead><tr style="background-color: #f0f0f0;"><th style="padding:4px; border:1px solid #000; text-align:left; font-size:11px;">Fornecedor</th><th style="padding:4px; border:1px solid #000; text-align:left; font-size:11px;">Documento</th></tr></thead>
        <tbody>
          ${suppliers.map(s => `<tr><td style="padding:4px; border:1px solid #000; font-size:11px;">${s.name}</td><td style="padding:4px; border:1px solid #000; font-size:11px;">${s.document}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }
  
  let bomHtml = '';
  if (product.bom && product.bom.length > 0) {
    bomHtml = `
      <br>
      <strong style="font-size: 14px;">Estrutura do Produto (BOM)</strong>
      <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
        <thead><tr style="background-color: #f0f0f0;"><th style="padding:4px; border:1px solid #000; text-align:left; font-size:11px;">SKU</th><th style="padding:4px; border:1px solid #000; text-align:left; font-size:11px;">Componente</th><th style="padding:4px; border:1px solid #000; text-align:right; font-size:11px;">Qtd Base</th></tr></thead>
        <tbody>
          ${product.bom.map(b => {
            const bItem = masterDataCache.products.find(p => p.sku === b.itemSku) || { name: 'Desconhecido' };
            return `<tr><td style="padding:4px; border:1px solid #000; font-size:11px;">${b.itemSku}</td><td style="padding:4px; border:1px solid #000; font-size:11px;">${bItem.name}</td><td style="padding:4px; border:1px solid #000; font-size:11px; text-align:right;">${b.qty}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  const printHtml = `
    <div style="font-family: Arial, sans-serif; color: #000; width: 100%; max-width: 800px; margin: 0 auto;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="width: 30%;">
            <div style="font-size: 24px; font-weight: bold; font-family: sans-serif; letter-spacing: -1px;">
              <span style="color:#000;">OminiSis</span> <span style="color: #666; font-size: 14px;">ERP</span>
            </div>
          </td>
          <td style="text-align: right; font-size: 10px; line-height: 1.4;">
            <strong>OminiSis Tecnologia da Informação LTDA</strong><br>
            Ficha Técnica de Material
          </td>
        </tr>
      </table>

      <h2 style="text-align: center; margin-bottom: 20px;">Ficha do Material: ${product.sku}</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1px solid #000;">
        <tr>
          <td style="padding: 5px; border: 1px solid #000; vertical-align: top;">
            <strong style="font-size:12px;">Descrição:</strong> <span style="font-size:12px;">${product.name}</span><br>
            <strong style="font-size:12px;">Tipo:</strong> <span style="font-size:12px;">${product.type} - ${typeMap[product.type]}</span><br>
            <strong style="font-size:12px;">Unidade:</strong> <span style="font-size:12px;">${product.unit}</span>
          </td>
          <td style="padding: 5px; border: 1px solid #000; vertical-align: top;">
            <strong style="font-size:12px;">Preço Base:</strong> <span style="font-size:12px;">${window.formatCurrency(product.basePrice)}</span><br>
            <strong style="font-size:12px;">Hierarquia:</strong> <span style="font-size:12px;">${product.hierarchy}</span><br>
            <strong style="font-size:12px;">Código Sis:</strong> <span style="font-size:12px;">${product.id}</span>
          </td>
        </tr>
      </table>

      <strong style="font-size: 14px;">Fornecedores Homologados</strong>
      ${suppliersHtml}
      
      ${bomHtml}
    </div>
  `;

  document.getElementById('print-area').innerHTML = printHtml;
  setTimeout(() => window.print(), 100);
};

window.openOrderFromExternal = (orderId) => {
  // Update nav active state to 'Vendas'
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const navItem = document.getElementById('nav-sales');
  if (navItem) navItem.classList.add('active');
  document.getElementById('breadcrumb-current').textContent = 'Vendas';
  currentModule = 'sales';
  
  // Call renderAdvancedForm from sales.js
  if (window.renderAdvancedForm) {
    window.renderAdvancedForm('order', orderId);
  } else {
    alert('O módulo de Vendas não foi carregado corretamente.');
  }
};

window.renderCustomerDetails = async (id) => {
  const customer = masterDataCache.customers.find(c => c.id === id);
  if (!customer) return alert('Cliente não encontrado');
  
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div class="animate-in" style="display:flex;flex-direction:column;gap:20px;opacity:0.6">
      <div style="height:80px;background:var(--bg-elevated);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
      <div style="height:400px;background:var(--bg-card);border-radius:var(--radius-lg);animation:pulse 1.5s infinite"></div>
    </div>
  `;

  // Fetch sales data to find customer orders
  const salesData = await window.API.getSalesData();
  const customerOrders = salesData.orders.filter(o => o.client === customer.name);
  
  // Generate some mock open titles based on customer ID (deterministic)
  const idNum = parseInt(id.replace(/\\D/g, '')) || 1;
  const mockTitles = [
    { id: `FAT-${idNum}01`, value: 1500 * idNum, dueDate: '2026-07-15', status: 'open' },
    { id: `FAT-${idNum}02`, value: 850 * idNum, dueDate: '2026-06-30', status: 'overdue' }
  ];

  let ordersHtml = '<p style="color:var(--text-muted)">Nenhum pedido recente.</p>';
  if (customerOrders.length > 0) {
    ordersHtml = `
      <table style="width:100%; border-collapse:collapse;">
        <thead><tr><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Pedido</th><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Data</th><th style="text-align:right; border-bottom:1px solid var(--border-color); padding:8px;">Valor</th><th style="text-align:center; border-bottom:1px solid var(--border-color); padding:8px;">Status</th></tr></thead>
        <tbody>
          ${customerOrders.slice(0, 5).map(o => `<tr onclick="window.openOrderFromExternal('${o.id}')" style="cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='var(--bg-elevated)'" onmouseout="this.style.background='transparent'"><td style="padding:8px; border-bottom:1px solid var(--border-color); color:var(--success-color);"><strong>${o.id}</strong></td><td style="padding:8px; border-bottom:1px solid var(--border-color);">${o.date}</td><td style="text-align:right; padding:8px; border-bottom:1px solid var(--border-color);">${window.formatCurrency(o.value)}</td><td style="text-align:center; padding:8px; border-bottom:1px solid var(--border-color);">${window.getStatusBadge(o.status)}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  content.innerHTML = `
    <div class="animate-in">
      <div class="advanced-form-header">
        <div style="display:flex; align-items:center; gap: 15px;">
          <button class="btn btn-ghost" onclick="renderMasterData()">← Voltar</button>
          <div>
            <h1 class="module-title" style="margin-bottom:2px;">Detalhes do Cliente</h1>
            <p class="module-subtitle">${customer.id} - ${customer.name}</p>
          </div>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <div class="card" style="margin-bottom:20px; padding:20px;">
            <h3 class="advanced-section-title" style="margin-top:0;">Dados Cadastrais</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div><strong style="color:var(--text-muted);font-size:12px;">CNPJ/CPF</strong><br>${customer.document}</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">Email</strong><br>${customer.email}</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">Condição Comercial</strong><br>${customer.commercialCondition}</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">Desconto Padrão</strong><br>${customer.defaultDiscount}%</div>
              <div><strong style="color:var(--text-muted);font-size:12px;">Status</strong><br>${window.getStatusBadge(customer.status)}</div>
            </div>
          </div>
          <div class="card" style="padding:20px;">
            <h3 class="advanced-section-title" style="margin-top:0;">Últimos Pedidos de Venda</h3>
            ${ordersHtml}
          </div>
        </div>
        <div>
          <div class="card" style="margin-bottom:20px; padding:20px;">
            <h3 class="advanced-section-title" style="margin-top:0;">Posição Financeira (Títulos)</h3>
            <table style="width:100%; border-collapse:collapse;">
              <thead><tr><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Fatura</th><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Vencimento</th><th style="text-align:right; border-bottom:1px solid var(--border-color); padding:8px;">Valor</th><th style="text-align:center; border-bottom:1px solid var(--border-color); padding:8px;">Status</th></tr></thead>
              <tbody>
                ${mockTitles.map(t => `<tr><td style="padding:8px; border-bottom:1px solid var(--border-color);"><strong>${t.id}</strong></td><td style="padding:8px; border-bottom:1px solid var(--border-color);">${t.dueDate}</td><td style="text-align:right; padding:8px; border-bottom:1px solid var(--border-color);">${window.formatCurrency(t.value)}</td><td style="text-align:center; padding:8px; border-bottom:1px solid var(--border-color);">${window.getStatusBadge(t.status)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.renderSupplierDetails = (id) => {
  const supplier = masterDataCache.suppliers.find(s => s.id === id);
  if (!supplier) return alert('Fornecedor não encontrado');
  
  const content = document.getElementById('content');
  
  // Find products supplied by this supplier
  const suppliedProducts = masterDataCache.products.filter(p => p.suppliers && p.suppliers.includes(id));
  
  let productsHtml = '<p style="color:var(--text-muted)">Este fornecedor não fornece nenhum material cadastrado.</p>';
  if (suppliedProducts.length > 0) {
    productsHtml = `
      <table style="width:100%; border-collapse:collapse;">
        <thead><tr><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">SKU</th><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Material</th><th style="text-align:right; border-bottom:1px solid var(--border-color); padding:8px;">Preço Base</th></tr></thead>
        <tbody>
          ${suppliedProducts.map(p => `<tr><td style="padding:8px; border-bottom:1px solid var(--border-color);">${p.sku}</td><td style="padding:8px; border-bottom:1px solid var(--border-color);">${p.name}</td><td style="text-align:right; padding:8px; border-bottom:1px solid var(--border-color);">${window.formatCurrency(p.basePrice)}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  content.innerHTML = `
    <div class="animate-in">
      <div class="advanced-form-header">
        <div style="display:flex; align-items:center; gap: 15px;">
          <button class="btn btn-ghost" onclick="renderMasterData()">← Voltar</button>
          <div>
            <h1 class="module-title" style="margin-bottom:2px;">Detalhes do Fornecedor</h1>
            <p class="module-subtitle">${supplier.id} - ${supplier.name}</p>
          </div>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="card" style="padding:20px;">
          <h3 class="advanced-section-title" style="margin-top:0;">Dados Cadastrais</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div><strong style="color:var(--text-muted);font-size:12px;">CNPJ/CPF</strong><br>${supplier.document}</div>
            <div><strong style="color:var(--text-muted);font-size:12px;">Email</strong><br>${supplier.email}</div>
            <div><strong style="color:var(--text-muted);font-size:12px;">Status</strong><br>${window.getStatusBadge(supplier.status)}</div>
          </div>
        </div>
        <div class="card" style="padding:20px;">
          <h3 class="advanced-section-title" style="margin-top:0;">Materiais Fornecidos</h3>
          ${productsHtml}
        </div>
      </div>
    </div>
  `;
};

window.renderHierarchyDetails = (id) => {
  const hierarchy = masterDataCache.hierarchies.find(h => h.id === id);
  if (!hierarchy) return alert('Hierarquia não encontrada');
  
  const content = document.getElementById('content');
  
  // Find products in this hierarchy
  const hierarchyProducts = masterDataCache.products.filter(p => p.hierarchy === id);
  
  let productsHtml = '<p style="color:var(--text-muted)">Nenhum material associado a esta hierarquia.</p>';
  if (hierarchyProducts.length > 0) {
    productsHtml = `
      <table style="width:100%; border-collapse:collapse;">
        <thead><tr><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">SKU</th><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Material</th><th style="text-align:left; border-bottom:1px solid var(--border-color); padding:8px;">Tipo</th></tr></thead>
        <tbody>
          ${hierarchyProducts.map(p => `<tr><td style="padding:8px; border-bottom:1px solid var(--border-color);">${p.sku}</td><td style="padding:8px; border-bottom:1px solid var(--border-color);">${p.name}</td><td style="padding:8px; border-bottom:1px solid var(--border-color);">${p.type}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  content.innerHTML = `
    <div class="animate-in">
      <div class="advanced-form-header">
        <div style="display:flex; align-items:center; gap: 15px;">
          <button class="btn btn-ghost" onclick="renderMasterData()">← Voltar</button>
          <div>
            <h1 class="module-title" style="margin-bottom:2px;">Detalhes da Hierarquia</h1>
            <p class="module-subtitle">${hierarchy.id} - ${hierarchy.name}</p>
          </div>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns: 1fr 2fr; gap: 20px;">
        <div class="card" style="padding:20px;">
          <h3 class="advanced-section-title" style="margin-top:0;">Configurações</h3>
          <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
            <div><strong style="color:var(--text-muted);font-size:12px;">Comissão Padrão</strong><br><span class="badge badge-success" style="font-size:16px;">${hierarchy.commission}%</span></div>
            <div><strong style="color:var(--text-muted);font-size:12px;">Status</strong><br>${window.getStatusBadge('active')}</div>
          </div>
        </div>
        <div class="card" style="padding:20px;">
          <h3 class="advanced-section-title" style="margin-top:0;">Materiais Associados</h3>
          ${productsHtml}
        </div>
      </div>
    </div>
  `;
};
