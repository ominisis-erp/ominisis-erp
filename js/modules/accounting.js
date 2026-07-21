// ============================================================
// ACCOUNTING MODULE — OminiSis Enterprise ERP
// ============================================================

function renderAccounting() {
  const accounts = DATA.accounts || [];

  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">📒 Escrituração Contábil</h1>
          <p class="module-subtitle">Plano de contas integrado, diário de lançamentos e demonstrativos fiscais</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-secondary btn-sm" onclick="alert('DRE Detalhado')">DRE Completo</button>
          <button class="btn btn-primary btn-sm" onclick="alert('Gerar Balancete')">📊 Balancete</button>
        </div>
      </div>

      <div class="grid-2-1" style="margin-bottom: 24px">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Plano de Contas Simplificado</h3></div>
          <div class="table-container" style="max-height: 350px">
            <table>
              <thead>
                <tr><th>Código</th><th>Conta Contábil</th><th>Tipo</th><th>Saldo</th><th>Nat</th></tr>
              </thead>
              <tbody>
                ${accounts.map(a => `
                  <tr>
                    <td class="font-mono"><strong>${a.code}</strong></td>
                    <td>${a.name}</td>
                    <td>${a.type}</td>
                    <td><strong>${formatCurrencyFull(a.balance)}</strong></td>
                    <td><span class="badge ${a.nature === 'D' ? 'badge-primary' : 'badge-success'}">${a.nature}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h3 class="card-title">Demonstrativo do Resultado (DRE)</h3></div>
          <div style="display:flex; flex-direction:column; gap:12px; font-size:13px; padding-top:8px">
            <div style="display:flex; justify-content:space-between">
              <span>(+) Receita Bruta de Vendas</span>
              <strong>R$ 4.820.000,00</strong>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--brand-danger)">
              <span>(-) Custo dos Mercadorias Vendidas (CMV)</span>
              <strong>- R$ 3.142.000,00</strong>
            </div>
            <hr style="border-color:var(--border-subtle)"/>
            <div style="display:flex; justify-content:space-between; font-weight:700">
              <span>(=) Resultado Bruto (Margem)</span>
              <span style="color:var(--brand-success)">R$ 1.678.000,00</span>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--brand-danger)">
              <span>(-) Despesas Operacionais (SG&A)</span>
              <strong>- R$ 820.000,00</strong>
            </div>
            <hr style="border-color:var(--border-subtle)"/>
            <div style="display:flex; justify-content:space-between; font-weight:800; font-size:15px">
              <span>(=) Lucro Líquido Operacional (LAJIDA)</span>
              <span style="color:var(--brand-success)">R$ 858.000,00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
