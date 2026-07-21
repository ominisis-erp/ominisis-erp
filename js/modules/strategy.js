// ============================================================
// STRATEGY & OKRs MODULE — OminiSis Enterprise ERP
// ============================================================

function renderStrategy() {
  const okrs = DATA.okrs || [];

  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">🎯 Planejamento Estratégico & OKRs</h1>
          <p class="module-subtitle">Alinhamento de objetivos globais corporativos, metas departamentais e Balanced Scorecard (BSC)</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary btn-sm" onclick="alert('Criar novo objetivo estratégico')">➕ Novo Objetivo</button>
        </div>
      </div>

      <div class="okr-list">
        ${okrs.map(o => {
          const statusColor = o.status === 'on_track' ? 'var(--brand-success)' : 'var(--brand-warning)';
          return `
            <div class="okr-card" onclick="alert('Gerenciar objetivo: ${o.objective}')">
              <div class="okr-header">
                <div>
                  <div class="okr-objective">${o.objective}</div>
                  <div class="okr-owner">Dono: ${o.owner} · <strong>${o.quarter}</strong></div>
                </div>
                <div>${getStatusBadge(o.status)}</div>
              </div>

              <div style="margin-bottom:20px">
                <div class="okr-progress-label">
                  <span>Progresso Geral</span>
                  <strong class="okr-pct">${o.progress}%</strong>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill progress-fill-primary" style="width:${o.progress}%"></div>
                </div>
              </div>

              <div class="okr-key-results">
                <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px">Resultados-Chave (Key Results)</div>
                ${o.krs.map(kr => {
                  const valText = kr.inverted ? `Atual: ${kr.current}${kr.unit} / Limite: ${kr.target}${kr.unit}` : `Atual: ${kr.current}${kr.unit} / Alvo: ${kr.target}${kr.unit}`;
                  return `
                    <div class="kr-item">
                      <span style="font-size:12px;width:14px">⊙</span>
                      <div class="kr-label">${kr.label}</div>
                      <div class="kr-value">${valText}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
