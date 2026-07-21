// ============================================================
// AI COPILOT MODULE — OminiSis Enterprise ERP
// Chat interface, insights, quick actions
// ============================================================

function renderAiCopilot() {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="ai-copilot-container">
        
        <!-- Main Chat Area -->
        <div class="ai-chat-area">
          <div class="ai-chat-header">
            <div class="ai-avatar">✨</div>
            <div>
              <strong style="color:var(--text-brand)">OminiSis AI Copilot</strong>
              <div style="font-size:11px;color:var(--text-muted)">Assistente virtual inteligente integrado ao seu banco de dados ERP</div>
            </div>
          </div>
          
          <div class="ai-chat-messages" id="ai-chat-box">
            <div class="chat-message ai">
              <div class="chat-msg-avatar" style="background:var(--grad-ai)">🤖</div>
              <div class="chat-bubble">
                Olá, João! Eu sou o <strong>OminiSis Copilot</strong>. Analisei as bases financeiras, de estoque e de vendas de hoje.<br/><br/>
                Aqui estão algumas coisas que posso fazer por você:<br/>
                1. 📊 <em>"Qual é a nossa projeção de fluxo de caixa para os próximos 3 meses?"</em><br/>
                2. ⚠️ <em>"Quais são os itens de estoque com maior risco de desabastecimento?"</em><br/>
                3. 📉 <em>"Analise a taxa de inadimplência da carteira de clientes B2B."</em>
              </div>
            </div>
          </div>

          <div class="ai-input-area">
            <input type="text" id="ai-message-input" class="ai-input" placeholder="Pergunte sobre faturamento, estoque, vendas ou peça uma análise de projeção..." onkeydown="handleAiInput(event)" />
            <button class="ai-send-btn" onclick="sendAiMessage()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        <!-- Sidebar / AI Insights -->
        <div class="ai-sidebar-panel">
          <div class="card" style="border-color: rgba(168, 85, 247, 0.3)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
              <span style="font-size:18px">🔮</span>
              <strong style="font-size:13px;color:var(--text-primary)">Insights Proativos da IA</strong>
            </div>
            
            <div style="display:flex;flex-direction:column;gap:10px">
              <div class="ai-insight-card" onclick="askCopilot('Estoque Crítico')">
                <span class="badge badge-danger" style="margin-bottom:6px">Risco de Estoque</span>
                <p style="font-size:12px;color:var(--text-primary)"><strong>Chapa Aço 2mm</strong> esgotará em 3 dias com base na demanda média da OP-2847.</p>
              </div>
              
              <div class="ai-insight-card" onclick="askCopilot('Previsão de Receita')">
                <span class="badge badge-success" style="margin-bottom:6px">Previsão Financeira</span>
                <p style="font-size:12px;color:var(--text-primary)">Expectativa de faturamento de <strong>R$ 5,2M</strong> para Julho/26 (+8% vs Junho).</p>
              </div>

              <div class="ai-insight-card" onclick="askCopilot('Inadimplência B2B')">
                <span class="badge badge-warning" style="margin-bottom:6px">Cobrança</span>
                <p style="font-size:12px;color:var(--text-primary)"><strong>Gamma Tech SA</strong> ultrapassou o prazo médio de pagamento histórico em 4 dias.</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px">Comandos Rápidos</div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <button class="ai-quick-action" onclick="askCopilot('Resumo de Vendas')">📊 Resumo de Vendas do Mês</button>
              <button class="ai-quick-action" onclick="askCopilot('Status de Produção')">⚙️ Status do Chão de Fábrica</button>
              <button class="ai-quick-action" onclick="askCopilot('DRE Simplificado')">🧾 DRE Simplificado do Trimestre</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  window.handleAiInput = (event) => {
    if (event.key === 'Enter') sendAiMessage();
  };

  window.sendAiMessage = () => {
    const input = document.getElementById('ai-message-input');
    const txt = input.value.trim();
    if (!txt) return;

    appendMessage('user', txt);
    input.value = '';

    // Simulate AI response
    setTimeout(() => {
      let reply = '';
      const q = txt.toLowerCase();

      if (q.includes('estoque') || q.includes('crítico')) {
        reply = `<strong>Análise de Inventário Crítico:</strong><br/>
          Identifiquei 2 itens operando abaixo do nível mínimo de segurança:<br/>
          <ul>
            <li><strong>Chapa Aço 2mm</strong> (Estoque: 8 PC / Mínimo: 50 PC). <em>Recomendação: Abrir cotação imediata de compra com o fornecedor 'Steel & Iron Ltda'.</em></li>
            <li><strong>Válvula Solenóide 1/2"</strong> (Estoque: 22 UN / Mínimo: 30 UN).</li>
          </ul>
          Deseja que eu crie um rascunho de Solicitação de Compra para esses itens?`;
      } else if (q.includes('faturamento') || q.includes('previsão') || q.includes('receita')) {
        reply = `<strong>Forecast de Faturamento (Julho/2026):</strong><br/>
          Com base no pipeline de vendas atualizado no CRM (R$ 2,4M em negócios qualificados) e na recorrência mensal (R$ 330K), nossa projeção estatística é de:<br/>
          <ul>
            <li><strong>Cenário Conservador:</strong> R$ 4,95M</li>
            <li><strong>Cenário Provável (Base):</strong> R$ 5,20M</li>
            <li><strong>Cenário Otimista:</strong> R$ 5,68M</li>
          </ul>
          A margem bruta estimada se manterá estável em <strong>34,5%</strong>.`;
      } else if (q.includes('produção') || q.includes('chão de fábrica') || q.includes('máquina')) {
        reply = `<strong>Status do Chão de Fábrica (PCP):</strong><br/>
          Atualmente temos 4 máquinas em operação e 1 em manutenção preventiva.<br/>
          <ul>
            <li><strong>OEE Global:</strong> 87.4% (Meta: 92%)</li>
            <li><strong>Gargalo atual:</strong> CNC Okuma MU-6300 em manutenção corretiva (previsão de retorno: 19:30).</li>
          </ul>
          A ordem de produção <strong>OP-2841</strong> (parafusos especiais) está rodando no CNC-01 com rendimento de 98% da capacidade programada.`;
      } else if (q.includes('inadimplência') || q.includes('vencido') || q.includes('finance')) {
        reply = `<strong>Análise de Inadimplência & Contas a Receber:</strong><br/>
          Temos <strong>R$ 185.000,00</strong> em títulos vencidos. O maior deles é da <strong>Gamma Tech SA</strong> (NF-12820 - R$ 291.000,00, vencido há 1 dia).<br/>
          Historicamente, este cliente paga com atraso médio de 3.2 dias. Posso preparar um e-mail formal de aviso ou enviar um alerta via WhatsApp Business integrado.`;
      } else {
        reply = `Compreendi a sua pergunta sobre "${txt}". Estou cruzando as tabelas de dados do Core e módulos para gerar um relatório em PDF ou uma ação direta no Workflow do ERP. Como prefere prosseguir?`;
      }

      appendMessage('ai', reply);
    }, 1000);
  };

  window.askCopilot = (topic) => {
    document.getElementById('ai-message-input').value = topic;
    sendAiMessage();
  };

  function appendMessage(sender, text) {
    const box = document.getElementById('ai-chat-box');
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = sender === 'user' 
      ? `<div class="chat-msg-avatar" style="background:var(--grad-brand)">JD</div><div class="chat-bubble">${text}</div>`
      : `<div class="chat-msg-avatar" style="background:var(--grad-ai)">🤖</div><div class="chat-bubble">${text}</div>`;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
  }
}
