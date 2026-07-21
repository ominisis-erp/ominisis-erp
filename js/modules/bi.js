// ============================================================
// BI & ANALYTICS MODULE — OminiSis Enterprise ERP
// ============================================================

function renderBi() {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">📊 Business Intelligence & Analytics</h1>
          <p class="module-subtitle">Dashboard builder, análise preditiva por inteligência artificial e cubos OLAP de dados</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary btn-sm" onclick="alert('Criar novo gráfico/widget')">➕ Novo Gráfico</button>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:20px">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Faturamento Acumulado Anual</h3></div>
          <div id="bi-revenue-chart" style="height:220px"></div>
        </div>

        <div class="card">
          <div class="card-header"><h3 class="card-title">Análise de Margem por Posto de Venda</h3></div>
          <div id="bi-margin-chart" style="height:220px"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="card-title">AI Predictive Forecast (Machine Learning)</h3></div>
        <div style="padding:16px; border:1px solid var(--border-brand); background:rgba(168, 85, 247, 0.05); border-radius:8px; font-size:13px">
          💡 <strong>Projeção de Algoritmo XGBoost:</strong> Nossa análise de regressão linear e sazonalidade prevê um crescimento médio de <strong>4.8%</strong> no terceiro trimestre de 2026, impulsionado pelas vendas recorrentes ativas.
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    Charts.drawLineChart('bi-revenue-chart', [3.2, 3.8, 3.6, 4.1, 4.3, 4.82], {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      colors: ['#8b5cf6'],
      height: 200,
      fill: true,
      minZero: true
    });

    Charts.drawBarChart('bi-margin-chart', ['B2B', 'B2C', 'Serviços', 'Recorrência'], [
      { data: [34, 42, 28, 62], color: '#06b6d4' }
    ], { height: 200 });
  });
}
