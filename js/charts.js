// ============================================================
// OminiSis Enterprise — Charts (Pure SVG/Canvas)
// ============================================================

const Charts = {
  colors: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#3b82f6','#a855f7'],

  // Draw a simple line/area chart with SVG
  drawLineChart(containerId, data, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const W = container.clientWidth || 600;
    const H = opts.height || 200;
    const pad = { top: 20, right: 16, bottom: 28, left: 48 };
    const innerW = W - pad.left - pad.right;
    const innerH = H - pad.top - pad.bottom;

    const series = Array.isArray(data[0]) ? data : [data];
    const allVals = series.flat();
    const minVal = opts.minZero ? 0 : Math.min(...allVals) * 0.9;
    const maxVal = Math.max(...allVals) * 1.05;
    const range = maxVal - minVal || 1;

    const scaleX = i => pad.left + (i / (series[0].length - 1)) * innerW;
    const scaleY = v => pad.top + innerH - ((v - minVal) / range) * innerH;

    let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;

    // Grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = pad.top + (innerH / gridLines) * i;
      const val = maxVal - (range / gridLines) * i;
      const label = opts.formatY ? opts.formatY(val) : Math.round(val).toLocaleString('pt-BR');
      svg += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`;
      svg += `<text x="${pad.left - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="#5a5a72">${label}</text>`;
    }

    // X labels
    const xLabels = opts.labels || [];
    const step = Math.ceil(xLabels.length / 8);
    xLabels.forEach((label, i) => {
      if (i % step !== 0 && i !== xLabels.length - 1) return;
      svg += `<text x="${scaleX(i)}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#5a5a72">${label}</text>`;
    });

    // Series
    const seriesColors = opts.colors || this.colors;
    series.forEach((s, si) => {
      const color = seriesColors[si] || this.colors[si];
      const points = s.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ');
      const firstX = scaleX(0), lastX = scaleX(s.length - 1);
      const bottomY = pad.top + innerH;

      // Area fill
      if (opts.fill !== false) {
        const areaPath = `M${firstX},${bottomY} L${points.split(' ').map(p => p).join(' L')} L${lastX},${bottomY} Z`;
        svg += `<defs><linearGradient id="areaGrad${containerId}${si}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.25"/><stop offset="100%" stop-color="${color}" stop-opacity="0.01"/></linearGradient></defs>`;
        svg += `<path d="${areaPath}" fill="url(#areaGrad${containerId}${si})"/>`;
      }

      // Line
      svg += `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;

      // Dots (last point)
      const lastV = s[s.length - 1];
      svg += `<circle cx="${lastX}" cy="${scaleY(lastV)}" r="5" fill="${color}" stroke="var(--bg-card)" stroke-width="2"/>`;
    });

    svg += '</svg>';
    container.innerHTML = svg;
  },

  // Bar chart
  drawBarChart(containerId, labels, datasets, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const W = container.clientWidth || 600;
    const H = opts.height || 220;
    const pad = { top: 20, right: 16, bottom: 32, left: 52 };
    const innerW = W - pad.left - pad.right;
    const innerH = H - pad.top - pad.bottom;
    const n = labels.length;
    const numSeries = datasets.length;
    const groupW = innerW / n;
    const barW = Math.min(groupW / numSeries - 4, 40);
    const allVals = datasets.flatMap(d => d.data);
    const maxVal = Math.max(...allVals) * 1.1;

    let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (innerH / 4) * i;
      const val = maxVal - (maxVal / 4) * i;
      const label = opts.formatY ? opts.formatY(val) : Math.round(val).toLocaleString('pt-BR');
      svg += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`;
      svg += `<text x="${pad.left - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="#5a5a72">${label}</text>`;
    }

    // Bars
    datasets.forEach((ds, si) => {
      ds.data.forEach((val, gi) => {
        const bH = (val / maxVal) * innerH;
        const x = pad.left + groupW * gi + (groupW - barW * numSeries) / 2 + si * barW;
        const y = pad.top + innerH - bH;
        svg += `<rect x="${x}" y="${y}" width="${barW - 2}" height="${bH}" rx="3" fill="${ds.color || this.colors[si]}" opacity="0.85"/>`;
      });
    });

    // X Labels
    labels.forEach((label, i) => {
      const x = pad.left + groupW * i + groupW / 2;
      svg += `<text x="${x}" y="${H - 8}" text-anchor="middle" font-size="10" fill="#5a5a72">${label}</text>`;
    });

    svg += '</svg>';
    container.innerHTML = svg;
  },

  // Donut chart
  drawDonut(containerId, segments, opts = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const size = opts.size || 140;
    const strokeW = opts.strokeW || 24;
    const r = (size / 2) - strokeW / 2;
    const cx = size / 2, cy = size / 2;
    const total = segments.reduce((s, d) => s + d.value, 0);
    let angle = -90;

    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="${strokeW}"/>`;

    segments.forEach(seg => {
      const pct = seg.value / total;
      const sweep = pct * 360;
      const startRad = angle * Math.PI / 180;
      const endRad = (angle + sweep) * Math.PI / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = sweep > 180 ? 1 : 0;
      const circ = 2 * Math.PI * r;
      const dashLen = pct * circ;
      const startOffset = (angle + 90) / 360 * circ;
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${strokeW - 2}" stroke-dasharray="${dashLen - 2} ${circ}" stroke-dashoffset="${-startOffset}" stroke-linecap="round"/>`;
      angle += sweep;
    });

    // Center
    const centerLabel = opts.centerLabel || '';
    const centerValue = opts.centerValue || '';
    if (centerValue) {
      svg += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f1f5">${centerValue}</text>`;
      svg += `<text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="10" fill="#5a5a72">${centerLabel}</text>`;
    }

    svg += '</svg>';
    el.innerHTML = svg;
  },

  // Sparkline (tiny line)
  drawSparkline(containerId, data, color = '#6366f1') {
    const el = document.getElementById(containerId);
    if (!el) return;
    const W = el.clientWidth || 120;
    const H = 40;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const scaleX = i => (i / (data.length - 1)) * W;
    const scaleY = v => H - ((v - min) / range) * H * 0.8 - H * 0.1;
    const points = data.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ');
    el.innerHTML = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
        <defs>
          <linearGradient id="sg${containerId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="M${scaleX(0)},${H} ${data.map((v,i)=>`L${scaleX(i)},${scaleY(v)}`).join(' ')} L${scaleX(data.length-1)},${H} Z" fill="url(#sg${containerId})"/>
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  },

  // Gauge arc
  drawGauge(containerId, value, max = 100, color = '#6366f1') {
    const el = document.getElementById(containerId);
    if (!el) return;
    const S = 140; const cx = S/2, cy = S/2; const r = 54; const sw = 14;
    const pct = value / max;
    const startAngle = 135; const endAngle = 405;
    const totalArc = (endAngle - startAngle) * Math.PI / 180;
    const arcLen = pct * totalArc;
    const circ = 2 * Math.PI * r;
    const dashPct = arcLen / (2 * Math.PI * r);

    const startRad = startAngle * Math.PI / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    el.innerHTML = `
      <svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="${sw}" stroke-dasharray="${totalArc * r} ${circ}" stroke-dashoffset="${-startAngle/360*circ}" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-dasharray="${arcLen * r} ${circ}" stroke-dashoffset="${-startAngle/360*circ}" stroke-linecap="round"/>
        <text x="${cx}" y="${cy+2}" text-anchor="middle" dominant-baseline="middle" font-size="22" font-weight="800" fill="#f1f1f5">${value}%</text>
        <text x="${cx}" y="${cy+20}" text-anchor="middle" font-size="10" fill="#5a5a72">OEE</text>
      </svg>`;
  },
};
