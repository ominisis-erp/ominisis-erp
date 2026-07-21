// ============================================================
// WORKFLOW DESIGNER MODULE — OminiSis Enterprise ERP
// ============================================================

function renderWorkflow() {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">⚡ Designer de Workflows & Automação</h1>
          <p class="module-subtitle">Criação visual de fluxos de aprovação, gatilhos de eventos de sistema e regras de negócio BPMN</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary btn-sm" onclick="alert('Salvar alterações de fluxo')">💾 Salvar Fluxo</button>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <h3 class="card-title">Fluxo de Aprovação de Limite de Crédito de Venda</h3>
          <select class="btn btn-ghost btn-sm" style="cursor:pointer">
            <option>Aprovação de Crédito (WF-001)</option>
            <option>Requisição de Compras (WF-002)</option>
          </select>
        </div>
        
        <div class="workflow-canvas">
          <div class="workflow-nodes">
            
            <div class="workflow-node node-start">
              <div class="node-icon">🟢</div>
              <div class="node-title">Início</div>
              <div class="node-subtitle">Pedido Fechado</div>
            </div>

            <div class="workflow-arrow"></div>

            <div class="workflow-node node-approval">
              <div class="node-icon">⚖️</div>
              <div class="node-title">Análise de Crédito</div>
              <div class="node-subtitle">Valor > R$ 100K</div>
            </div>

            <div class="workflow-arrow"></div>

            <div class="workflow-node node-action">
              <div class="node-icon">✉️</div>
              <div class="node-title">Notificar Gerente</div>
              <div class="node-subtitle">Aviso por E-mail</div>
            </div>

            <div class="workflow-arrow"></div>

            <div class="workflow-node node-end">
              <div class="node-icon">🔴</div>
              <div class="node-title">Fim</div>
              <div class="node-subtitle">Ordem Liberada</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
}
