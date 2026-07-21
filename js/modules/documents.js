// ============================================================
// DOCUMENTS / ECM MODULE — OminiSis Enterprise ERP
// ============================================================

function renderDocuments() {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div>
          <h1 class="module-title">📁 Gestão de Documentos (ECM / GED)</h1>
          <p class="module-subtitle">Armazenamento em nuvem isolado por tenant (MinIO S3), versionamento de arquivos e OCR de notas</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary btn-sm" onclick="alert('Upload de arquivos')">📤 Upload de Arquivo</button>
        </div>
      </div>

      <div class="doc-grid">
        <div class="doc-card" onclick="alert('Ver Contrato Acme-Steel.pdf')">
          <div class="doc-icon" style="background:rgba(239,68,68,0.1);color:var(--brand-danger)">📄</div>
          <div class="doc-name">Contrato Fornecedor Steel.pdf</div>
          <div class="doc-meta">v3.2 · 2.4 MB · 25/06/2026</div>
        </div>

        <div class="doc-card" onclick="alert('Ver NF-12820.xml')">
          <div class="doc-icon" style="background:rgba(16,185,129,0.1);color:var(--brand-success)">🧾</div>
          <div class="doc-name">XML Nota Fiscal NF-12820.xml</div>
          <div class="doc-meta">v1.0 · 34 KB · 26/06/2026</div>
        </div>

        <div class="doc-card" onclick="alert('Ver Manual Calibração CNC.pdf')">
          <div class="doc-icon" style="background:rgba(99,102,241,0.1);color:var(--brand-primary)">📕</div>
          <div class="doc-name">Manual Calibração CNC-03.pdf</div>
          <div class="doc-meta">v2.1 · 15.8 MB · 20/06/2026</div>
        </div>
      </div>
    </div>
  `;
}
