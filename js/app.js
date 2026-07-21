// ============================================================
// OminiSis Enterprise — Main App Controller
// ============================================================

const MODULES = {
  'dashboard':    { fn: 'renderDashboard',   label: 'Dashboard',         emoji: '🏠' },
  'ai-copilot':  { fn: 'renderAiCopilot',   label: 'IA Copilot',        emoji: '🤖' },
  'masterdata':  { fn: 'renderMasterData',  label: 'Cadastros Base',    emoji: '🗂️' },
  'crm':         { fn: 'renderCrm',          label: 'CRM',               emoji: '👥' },
  'sales':       { fn: 'renderSales',        label: 'Vendas',            emoji: '🛒' },
  'purchase':    { fn: 'renderPurchase',     label: 'Compras',           emoji: '📋' },
  'inventory':   { fn: 'renderInventory',    label: 'Estoque',           emoji: '📦' },
  'production':  { fn: 'renderProduction',   label: 'Produção',          emoji: '⚙️' },
  'quality':     { fn: 'renderQuality',      label: 'Qualidade',         emoji: '✅' },
  'maintenance': { fn: 'renderMaintenance',  label: 'Manutenção',        emoji: '🔧' },
  'finance':     { fn: 'renderFinance',      label: 'Financeiro',        emoji: '💰' },
  'accounting':  { fn: 'renderAccounting',   label: 'Contabilidade',     emoji: '📒' },
  'treasury':    { fn: 'renderTreasury',     label: 'Tesouraria',        emoji: '🏦' },
  'hr':          { fn: 'renderHr',           label: 'RH & Folha',        emoji: '👤' },
  'projects':    { fn: 'renderProjects',     label: 'Projetos',          emoji: '📅' },
  'bi':          { fn: 'renderBi',           label: 'BI & Analytics',    emoji: '📊' },
  'strategy':    { fn: 'renderStrategy',     label: 'Estratégia & OKRs', emoji: '🎯' },
  'workflow':    { fn: 'renderWorkflow',     label: 'Workflow',          emoji: '⚡' },
  'documents':   { fn: 'renderDocuments',    label: 'ECM / GED',         emoji: '📁' },
  'integrations':{ fn: 'renderIntegrations', label: 'Integrações',       emoji: '🔗' },
  'settings':    { fn: 'renderSettings',     label: 'Configurações',     emoji: '⚙' },
  'admin':       { fn: 'renderAdmin',        label: 'Admin Console',     emoji: '🛡' },
};

let currentModule = 'dashboard';

// ============================================================
// Navigate to module
// ============================================================
function navigateTo(module) {
  if (!MODULES[module]) return;

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const navItem = document.getElementById(`nav-${module}`);
  if (navItem) navItem.classList.add('active');

  // Update breadcrumb
  const info = MODULES[module];
  document.getElementById('breadcrumb-current').textContent = info.label;

  // Update current
  currentModule = module;

  // Scroll content to top
  document.getElementById('content').scrollTop = 0;

  // Render module
  const fn = window[info.fn];
  if (typeof fn === 'function') {
    fn();
  } else {
    renderPlaceholder(info.label, info.emoji);
  }
}

function renderPlaceholder(label, emoji) {
  document.getElementById('content').innerHTML = `
    <div class="animate-in">
      <div class="module-header">
        <div class="module-title-area">
          <h1 class="module-title">${emoji} ${label}</h1>
          <p class="module-subtitle">Módulo em desenvolvimento</p>
        </div>
      </div>
      <div class="empty-state">
        <div class="empty-icon" style="font-size:32px;background:var(--bg-elevated);width:72px;height:72px">${emoji}</div>
        <div class="empty-title">${label}</div>
        <p class="empty-desc">Este módulo está disponível no plano Enterprise. Contate o administrador para habilitá-lo.</p>
        <button class="btn btn-primary" onclick="navigateTo('dashboard')">Voltar ao Dashboard</button>
      </div>
    </div>`;
}

// ============================================================
// Sidebar behavior
// ============================================================
function initSidebar() {
  // Nav items click
  document.querySelectorAll('.nav-item[data-module]').forEach(item => {
    item.addEventListener('click', () => {
      const module = item.getAttribute('data-module');
      navigateTo(module);
    });
  });

  // Collapse/Expand
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  const app = document.getElementById('app');
  collapseBtn?.addEventListener('click', () => {
    app.classList.toggle('sidebar-collapsed');
    localStorage.setItem('ominisis-sidebar-collapsed', app.classList.contains('sidebar-collapsed'));
  });

  // Restore sidebar state
  if (localStorage.getItem('ominisis-sidebar-collapsed') === 'true') {
    app.classList.add('sidebar-collapsed');
  }

  // Mobile menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  mobileBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
  });

  // Search
  const searchInput = document.getElementById('sidebar-search-input');
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.nav-item[data-module]').forEach(item => {
      const label = item.querySelector('.nav-label')?.textContent?.toLowerCase() || '';
      item.style.display = !query || label.includes(query) ? '' : 'none';
    });
    document.querySelectorAll('.nav-section-label').forEach(sec => {
      sec.style.display = query ? 'none' : '';
    });
  });

  // Keyboard shortcut ⌘K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput?.focus();
    }
    if (e.key === 'Escape') {
      if (searchInput === document.activeElement) {
        searchInput.blur();
        searchInput.value = '';
        document.querySelectorAll('.nav-item').forEach(item => item.style.display = '');
        document.querySelectorAll('.nav-section-label').forEach(sec => sec.style.display = '');
      }
    }
  });
}

// ============================================================
// Notifications panel
// ============================================================
function initNotifications() {
  const btn = document.getElementById('notifications-btn');
  const panel = document.getElementById('notification-panel');
  const close = document.getElementById('notif-close');

  btn?.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  close?.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== btn && !btn?.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

// ============================================================
// Splash Screen
// ============================================================
function initSplash() {
  const splash = document.getElementById('splash-screen');
  const app = document.getElementById('app');
  const fill = document.getElementById('splash-bar-fill');
  const status = document.getElementById('splash-status');

  const steps = [
    [10, 'Inicializando núcleo...'],
    [25, 'Carregando módulos ERP...'],
    [45, 'Conectando ao banco de dados...'],
    [65, 'Autenticando usuário...'],
    [80, 'Carregando IA Copilot...'],
    [92, 'Sincronizando dados...'],
    [100, 'Pronto!'],
  ];

  let i = 0;
  function nextStep() {
    if (i >= steps.length) {
      // Launch app
      setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
          splash.style.display = 'none';
          app.classList.remove('hidden');
          navigateTo('dashboard');
          initSidebar();
          initNotifications();
        }, 500);
      }, 300);
      return;
    }
    const [pct, msg] = steps[i++];
    fill.style.width = pct + '%';
    status.textContent = msg;
    setTimeout(nextStep, 280);
  }

  setTimeout(nextStep, 400);
}

// ============================================================
// Window resize — redraw charts
// ============================================================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const fn = window[MODULES[currentModule]?.fn];
    if (typeof fn === 'function') fn();
  }, 250);
});

// ============================================================
// Global tab switcher helper
// ============================================================
function initTabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      container.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
      const tc = document.getElementById(target);
      if (tc) tc.classList.remove('hidden');
    });
  });
}

// ============================================================
// Theme Toggle
// ============================================================
function initTheme() {
  const btn = document.getElementById('theme-toggle-btn');
  const moon = document.getElementById('theme-icon-moon');
  const sun = document.getElementById('theme-icon-sun');
  if (!btn) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('theme-light');
    moon.style.display = 'none';
    sun.style.display = 'block';
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('theme-light');
    const isLight = document.body.classList.contains('theme-light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    moon.style.display = isLight ? 'none' : 'block';
    sun.style.display = isLight ? 'block' : 'none';
    
    // Trigger resize to redraw charts
    setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
  });
}

// ============================================================
// Global Table Filter
// ============================================================
function initGlobalTableFilter() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const tableContainers = document.querySelectorAll('.table-container:not(.has-filter)');
        tableContainers.forEach(container => {
          // Avoid injecting filter if the container is inside a small modal or something specific
          // but usually it's fine.
          container.classList.add('has-filter');
          
          const filterInput = document.createElement('input');
          filterInput.type = 'text';
          filterInput.placeholder = '🔍 Filtrar registros...';
          filterInput.className = 'form-control table-filter-input';
          filterInput.style.marginBottom = '15px';
          filterInput.style.width = '100%';
          filterInput.style.maxWidth = '300px';
          
          filterInput.addEventListener('keyup', function(e) {
            const term = e.target.value.toLowerCase();
            const table = container.querySelector('table');
            if(!table) return;
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
              const text = row.innerText.toLowerCase();
              row.style.display = text.includes(term) ? '' : 'none';
            });
          });
          
          container.parentNode.insertBefore(filterInput, container);
        });
      }
    });
  });
  
  const contentNode = document.getElementById('content');
  const modalNode = document.getElementById('modal-overlay');
  if(contentNode) observer.observe(contentNode, { childList: true, subtree: true });
  if(modalNode) observer.observe(modalNode, { childList: true, subtree: true });
}

// ============================================================
// Boot
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initTheme();
  initGlobalTableFilter();
});

// ==========================================
// Modal Control
// ==========================================
window.showAppModal = function(htmlContent, sizeClass = '') {
  // Remove existing modal if any
  window.hideAppModal();

  const overlay = document.createElement('div');
  overlay.id = 'dynamic-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.left = '0';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  overlay.style.backdropFilter = 'blur(5px)';
  overlay.style.zIndex = '2147483647'; // Maximum possible z-index
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  // Click outside to close
  overlay.onclick = function(e) {
    if (e.target === overlay) {
      window.hideAppModal();
    }
  };

  const box = document.createElement('div');
  box.className = 'modal-box ' + sizeClass;
  // Use CSS vars instead of hardcoded hex colors
  box.style.background = 'var(--bg-elevated)';
  box.style.border = '1px solid var(--border-default)';
  box.style.borderRadius = '16px';
  box.style.width = '100%';
  if (sizeClass === 'modal-box-xl') {
    box.style.maxWidth = '1400px';
    box.style.height = '95vh';
  } else {
    box.style.maxWidth = '500px';
  }
  box.style.overflow = 'hidden';
  box.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
  box.style.zIndex = '2147483647';
  
  box.innerHTML = htmlContent;
  
  overlay.appendChild(box);
  document.body.appendChild(overlay);
};

window.hideAppModal = function() {
  const overlay = document.getElementById('dynamic-modal-overlay');
  if (overlay) {
    overlay.remove();
  }
};
