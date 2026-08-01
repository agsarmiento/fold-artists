import * as d3 from 'd3';
import { defendants, industries, statusData, caseLinks, LOGO_DOMAINS, TOTAL_CASES, TOTAL_EXPOSURE } from './data.js';

// ─── Palette tokens ────────────────────────────────────────────────────────
const PALETTES = {
  dark: {
    SURFACE_1: '#1a1a19', TEXT_PRI: '#ffffff', TEXT_MUT: '#898781',
    GRID_COL: '#2c2c2a', BASELINE: '#383835',
    SERIES_1: '#3987e5', SERIES_2: '#d95926',
  },
  light: {
    SURFACE_1: '#ffffff', TEXT_PRI: '#14140f', TEXT_MUT: '#767672',
    GRID_COL: '#d8d8d5', BASELINE: '#c8c8c4',
    SERIES_1: '#1c5cb8', SERIES_2: '#b84200',
  },
};

let SURFACE_1 = PALETTES.dark.SURFACE_1;
let TEXT_PRI  = PALETTES.dark.TEXT_PRI;
let TEXT_MUT  = PALETTES.dark.TEXT_MUT;
let GRID_COL  = PALETTES.dark.GRID_COL;
let BASELINE  = PALETTES.dark.BASELINE;
let SERIES_1  = PALETTES.dark.SERIES_1;
let SERIES_2  = PALETTES.dark.SERIES_2;

// ─── Tooltip ───────────────────────────────────────────────────────────────
const tooltipEl = document.getElementById('tooltip');

function showTooltip(html, event) {
  tooltipEl.innerHTML = html;
  tooltipEl.classList.add('visible');
  tooltipEl.setAttribute('aria-hidden', 'false');
  positionTooltip(event);
}

function hideTooltip() {
  tooltipEl.classList.remove('visible');
  tooltipEl.setAttribute('aria-hidden', 'true');
}

function positionTooltip(event) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tw = tooltipEl.offsetWidth;
  const th = tooltipEl.offsetHeight;
  let x = event.clientX + 16;
  let y = event.clientY - 10;
  if (x + tw > vw - 8) x = event.clientX - tw - 16;
  if (y + th > vh - 8) y = vh - th - 8;
  tooltipEl.style.left = `${x}px`;
  tooltipEl.style.top  = `${y}px`;
}

document.addEventListener('mousemove', (e) => {
  if (tooltipEl.classList.contains('visible')) positionTooltip(e);
});

// ─── Formatters ────────────────────────────────────────────────────────────
function fmtExposure(b) {
  if (b >= 1)    return `$${b % 1 === 0 ? b : b.toFixed(1)}B`;
  if (b >= 0.1)  return `$${Math.round(b * 1000)}M`;
  return `$${Math.round(b * 1000)}M`;
}

function fmtAxis(b) {
  if (b === 0)   return '$0';
  if (b >= 1)    return `$${b}B`;
  return `$${Math.round(b * 1000)}M`;
}

// ─── KPI counter animation ──────────────────────────────────────────────────
function animateKPIs() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const prefix  = el.dataset.prefix  || '';
    const suffix  = el.dataset.suffix  || '';
    const isFloat = el.dataset.target.includes('.');
    const dur     = 1400;
    const start   = performance.now();

    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = target * e;
      el.textContent = prefix + (isFloat ? v.toFixed(1) : Math.round(v)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ─── Exposure chart ─────────────────────────────────────────────────────────
function drawExposureChart() {
  const container = document.getElementById('chart-exposure');
  const data = [...defendants].sort((a, b) => b.exposureB - a.exposureB);

  const BAR_H   = 22;
  const BAR_GAP = 10;
  const M = { top: 12, right: 88, bottom: 36, left: 148 };

  function render() {
    container.innerHTML = '';
    const W = container.clientWidth - 48; // subtract card padding
    const H = data.length * (BAR_H + BAR_GAP) + M.top + M.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width',  W)
      .attr('height', H)
      .attr('aria-hidden', 'true');

    const plotW = W - M.left - M.right;
    const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);

    // Scales
    const maxExp = d3.max(data, d => d.exposureB);
    const xScale = d3.scaleLinear().domain([0, maxExp * 1.05]).range([0, plotW]);
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, H - M.top - M.bottom])
      .paddingInner(BAR_GAP / (BAR_H + BAR_GAP))
      .paddingOuter(0);

    // Grid lines
    const ticks = xScale.ticks(6);
    g.append('g').attr('class', 'grid')
      .selectAll('line')
      .data(ticks)
      .join('line')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', H - M.top - M.bottom)
        .attr('stroke', GRID_COL)
        .attr('stroke-width', 1);

    // Baseline
    g.append('line')
      .attr('x1', 0).attr('x2', 0)
      .attr('y1', 0).attr('y2', H - M.top - M.bottom)
      .attr('stroke', BASELINE)
      .attr('stroke-width', 1);

    // Bars
    const barGroups = g.selectAll('.bar-group')
      .data(data)
      .join('g')
        .attr('class', 'bar-group')
        .attr('transform', d => `translate(0, ${yScale(d.name) + (yScale.bandwidth() - BAR_H) / 2})`);

    // Background track (faint, shows full scale)
    barGroups.append('rect')
      .attr('x', 0)
      .attr('width', plotW)
      .attr('height', BAR_H)
      .attr('fill', GRID_COL)
      .attr('rx', 4);

    // Value bars (animated)
    const bars = barGroups.append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('height', BAR_H)
      .attr('rx', 4)
      .attr('fill', SERIES_1)
      .attr('width', 0); // start at 0 for animation

    bars.transition()
      .duration(900)
      .delay((_, i) => i * 35)
      .ease(d3.easeCubicOut)
      .attr('width', d => Math.max(xScale(d.exposureB), 4));

    // Value labels (outside bar end)
    barGroups.append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.exposureB) + 8)
      .attr('y', BAR_H / 2)
      .attr('dy', '0.35em')
      .attr('fill', TEXT_PRI)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('font-family', 'inherit')
      .style('opacity', 0)
      .text(d => fmtExposure(d.exposureB))
      .transition()
        .delay((_, i) => i * 35 + 500)
        .duration(200)
        .style('opacity', 1);

    // Company name labels (left axis)
    g.selectAll('.company-label')
      .data(data)
      .join('text')
        .attr('class', 'company-label')
        .attr('x', -10)
        .attr('y', d => yScale(d.name) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('fill', TEXT_PRI)
        .style('font-size', '12px')
        .style('font-family', 'inherit')
        .style('font-weight', '500')
        .text(d => d.name);

    // X-axis ticks
    g.append('g')
      .attr('transform', `translate(0, ${H - M.top - M.bottom + 8})`)
      .call(
        d3.axisBottom(xScale)
          .tickValues(ticks)
          .tickFormat(fmtAxis)
          .tickSize(0)
      )
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('text')
        .attr('fill', TEXT_MUT)
        .style('font-size', '11px')
        .style('font-family', 'inherit')
      );

    // Hover interaction
    barGroups
      .on('mouseenter', function(event, d) {
        d3.select(this).select('.bar').attr('fill', '#4fa0ff');
        const statusStr = Object.entries(d.status)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `${v} ${k}`)
          .join(' · ');
        const html = `
          <div class="tooltip-title">${d.name}</div>
          <div class="tooltip-row"><span>Est. exposure</span><strong>${fmtExposure(d.exposureB)}</strong></div>
          <div class="tooltip-row"><span>Total cases</span><strong>${d.cases}</strong></div>
          <div class="tooltip-row"><span>Status</span><strong>${statusStr}</strong></div>
          <div class="tooltip-row"><span>Industries</span><strong>${d.industries.join(', ')}</strong></div>
          <div class="tooltip-section">
            <div style="font-size:0.7rem;color:#898781;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Notable plaintiffs</div>
            <div class="tooltip-plaintiffs">${d.notable.slice(0, 6).join(', ')}${d.notable.length > 6 ? ` +${d.notable.length - 6} more` : ''}</div>
          </div>`;
        showTooltip(html, event);
      })
      .on('mouseleave', function() {
        d3.select(this).select('.bar').attr('fill', SERIES_1);
        hideTooltip();
      });
  }

  render();

  const ro = new ResizeObserver(() => render());
  ro.observe(container);
}

// ─── Industry chart ──────────────────────────────────────────────────────────
function drawIndustryChart() {
  const container = document.getElementById('chart-industry');
  const data = [...industries].sort((a, b) => b.cases - a.cases);

  const BAR_H   = 22;
  const BAR_GAP = 10;
  const M = { top: 8, right: 44, bottom: 32, left: 120 };

  function render() {
    container.innerHTML = '';
    const W = container.clientWidth - 48;
    const H = data.length * (BAR_H + BAR_GAP) + M.top + M.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width',  W)
      .attr('height', H)
      .attr('aria-hidden', 'true');

    const plotW = W - M.left - M.right;
    const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);

    const maxCases = d3.max(data, d => d.cases);
    const xScale = d3.scaleLinear().domain([0, maxCases * 1.1]).range([0, plotW]);
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, H - M.top - M.bottom])
      .paddingInner(BAR_GAP / (BAR_H + BAR_GAP))
      .paddingOuter(0);

    // Grid
    g.append('g').attr('class', 'grid')
      .selectAll('line')
      .data(xScale.ticks(5))
      .join('line')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', H - M.top - M.bottom)
        .attr('stroke', GRID_COL)
        .attr('stroke-width', 1);

    // Baseline
    g.append('line')
      .attr('x1', 0).attr('x2', 0)
      .attr('y1', 0).attr('y2', H - M.top - M.bottom)
      .attr('stroke', BASELINE)
      .attr('stroke-width', 1);

    const barGroups = g.selectAll('.ind-group')
      .data(data)
      .join('g')
        .attr('class', 'ind-group')
        .attr('transform', d => `translate(0, ${yScale(d.name) + (yScale.bandwidth() - BAR_H) / 2})`);

    // Track
    barGroups.append('rect')
      .attr('x', 0).attr('width', plotW)
      .attr('height', BAR_H).attr('rx', 4)
      .attr('fill', GRID_COL);

    // Single series → single color (slot 2 orange, slot 1 used in exposure chart)
    const bars = barGroups.append('rect')
      .attr('class', 'ind-bar')
      .attr('x', 0).attr('height', BAR_H).attr('rx', 4)
      .attr('fill', SERIES_2)
      .attr('width', 0);

    bars.transition()
      .duration(800)
      .delay((_, i) => i * 50 + 200)
      .ease(d3.easeCubicOut)
      .attr('width', d => Math.max(xScale(d.cases), 4));

    // Labels
    barGroups.append('text')
      .attr('x', d => xScale(d.cases) + 8)
      .attr('y', BAR_H / 2)
      .attr('dy', '0.35em')
      .attr('fill', TEXT_PRI)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('font-family', 'inherit')
      .style('opacity', 0)
      .text(d => d.cases)
      .transition()
        .delay((_, i) => i * 50 + 600)
        .duration(200)
        .style('opacity', 1);

    // Industry name labels
    g.selectAll('.ind-label')
      .data(data)
      .join('text')
        .attr('class', 'ind-label')
        .attr('x', -10)
        .attr('y', d => yScale(d.name) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('fill', TEXT_PRI)
        .style('font-size', '12px')
        .style('font-family', 'inherit')
        .style('font-weight', '500')
        .text(d => d.name);

    // X-axis
    g.append('g')
      .attr('transform', `translate(0, ${H - M.top - M.bottom + 8})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(5)
          .tickFormat(d => `${d}`)
          .tickSize(0)
      )
      .call(ax => ax.select('.domain').remove())
      .call(ax => ax.selectAll('text')
        .attr('fill', TEXT_MUT)
        .style('font-size', '11px')
        .style('font-family', 'inherit')
      );

    // Hover
    barGroups
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this).select('.ind-bar').attr('opacity', 0.8);
        const html = `
          <div class="tooltip-title">${d.name}</div>
          <div class="tooltip-row"><span>Cases filed</span><strong>${d.cases}</strong></div>
          <div class="tooltip-row"><span>Share of total</span><strong>${Math.round(d.cases / TOTAL_CASES * 100)}%</strong></div>`;
        showTooltip(html, event);
      })
      .on('mouseleave', function() {
        d3.select(this).select('.ind-bar').attr('opacity', 1);
        hideTooltip();
      });
  }

  render();
  const ro = new ResizeObserver(() => render());
  ro.observe(container);
}

// ─── Status section ──────────────────────────────────────────────────────────
function drawStatusSection() {
  const container = document.getElementById('chart-status');

  // Stat grid
  const grid = document.createElement('div');
  grid.className = 'status-grid';

  statusData.forEach(d => {
    const tile = document.createElement('div');
    tile.className = 'status-tile';
    tile.innerHTML = `
      <span class="status-dot" style="background:${d.color}"></span>
      <div class="status-info">
        <span class="status-count">${d.count}</span>
        <span class="status-name">${d.status}</span>
      </div>
      <span class="status-pct">${d.pct}%</span>`;
    grid.appendChild(tile);
  });

  container.appendChild(grid);

  // Proportional bar
  const track = document.createElement('div');
  track.className = 'status-bar-track';
  track.setAttribute('role', 'img');
  track.setAttribute('aria-label', 'Status distribution bar');

  statusData.forEach(d => {
    const seg = document.createElement('div');
    seg.className = 'status-bar-segment';
    seg.style.background = d.color;
    seg.style.width = `${d.pct}%`;
    seg.style.minWidth = '4px';
    seg.title = `${d.status}: ${d.count} (${d.pct}%)`;
    track.appendChild(seg);
  });

  // Animate the track in
  track.style.opacity = '0';
  container.appendChild(track);
  setTimeout(() => {
    track.style.transition = 'opacity 0.4s ease';
    track.style.opacity = '1';
  }, 600);
}

// ─── Node graph ─────────────────────────────────────────────────────────────
const INDUSTRY_COLOR = {
  'Music':          '#199e70',   // aqua (s3)
  'Media':          '#d95926',   // orange (s2)
  'Authors':        '#d55181',   // magenta (s5)
  'Publishing':     '#c98500',   // yellow (s4)
  'Platform':       '#9085e9',   // violet (s7)
  'Motion Picture': '#e66767',   // red (s8)
  'Visual Art':     '#008300',   // green (s6)
};

const STATUS_LINK_COLOR = {
  'Ongoing':  'rgba(57,135,229,0.28)',
  'Settled':  'rgba(201,133,0,0.75)',
  'Won':      'rgba(25,158,112,0.9)',
  'Lost':     'rgba(230,103,103,0.9)',
};

const STATUS_LINK_WIDTH = { Ongoing: 1.5, Settled: 2, Won: 2.5, Lost: 2.5 };

function drawNodeGraph() {
  const container = document.getElementById('chart-nodes');
  if (!container) return;

  // ── Build nodes & links ──────────────────────────────────────────────────
  const nodeMap = new Map();

  // Seed all defendants first (they are the anchors)
  defendants.forEach(d => {
    nodeMap.set(d.name, {
      id:       d.name,
      role:     'defendant',
      cases:    d.cases,
      exposure: d.exposureB,
    });
  });

  // Walk case links — add plaintiff nodes, mark dual-role companies
  const links = caseLinks.map(c => {
    if (!nodeMap.has(c.source)) {
      nodeMap.set(c.source, {
        id:       c.source,
        role:     'plaintiff',
        industry: c.industry,
        filedCount: 0,
      });
    } else {
      // Already exists as a defendant — mark as both
      nodeMap.get(c.source).role = 'both';
    }
    nodeMap.get(c.source).filedCount = (nodeMap.get(c.source).filedCount || 0) + 1;
    return { source: c.source, target: c.target, status: c.status, industry: c.industry };
  });

  const nodes = Array.from(nodeMap.values());

  // Radius: defendants scaled by exposure ($B); plaintiffs by filedCount
  const maxExp = Math.max(...defendants.map(d => d.exposureB));
  nodes.forEach(n => {
    if (n.role === 'defendant') {
      n.r = 11 + (n.exposure / maxExp) * 28;   // 11–39 px
    } else if (n.role === 'both') {
      n.r = 13;
    } else {
      n.r = 5 + Math.min(n.filedCount - 1, 3) * 2;  // 5–11 px
    }
  });

  // ── Cluster pre-positioning ───────────────────────────────────────────────
  // Place defendants in a circle, plaintiffs orbiting their primary defendant.
  // This gives the force simulation clean starting positions so collision
  // resolution is trivial rather than fighting a tangled hairball.
  {
    const PW = 1200, PH = 900; // logical pre-position space (scaled to canvas later)
    const pcx = PW / 2, pcy = PH / 2;

    // Primary defendant for each plaintiff = the defendant it sues most
    const primaryDef = new Map();
    const sueCounts  = new Map(); // `${plaintiff}|${defendant}` → count
    caseLinks.forEach(c => {
      const key = `${c.source}|${c.target}`;
      sueCounts.set(key, (sueCounts.get(key) || 0) + 1);
    });
    nodes.filter(n => n.role === 'plaintiff').forEach(n => {
      let best = null, bestCount = 0;
      caseLinks.filter(c => c.source === n.id).forEach(c => {
        const cnt = sueCounts.get(`${c.source}|${c.target}`) || 0;
        if (cnt > bestCount) { bestCount = cnt; best = c.target; }
      });
      if (best) primaryDef.set(n.id, best);
    });

    // Group plaintiffs by their primary defendant
    const groups = new Map();
    nodes.filter(n => n.role === 'defendant' || n.role === 'both').forEach(n => groups.set(n.id, []));
    nodes.filter(n => n.role === 'plaintiff').forEach(n => {
      const def = primaryDef.get(n.id);
      if (def && groups.has(def)) groups.get(def).push(n);
    });

    // Sort defendants by group size descending — busiest goes to center
    const defNodes = nodes.filter(n => n.role === 'defendant' || n.role === 'both')
      .sort((a, b) => (groups.get(b.id)?.length || 0) - (groups.get(a.id)?.length || 0));

    // Ring layout: #1 at center, rings of ~6 outward
    const RING_SIZE = 6;
    const ringRadii = [0, 0.22, 0.42].map(r => Math.min(PW, PH) * r);

    defNodes.forEach((dn, i) => {
      if (i === 0) {
        // Most connected → dead center
        dn.x = pcx;
        dn.y = pcy;
      } else {
        const ringIdx  = Math.min(Math.ceil(i / RING_SIZE), ringRadii.length - 1);
        const ringR    = ringRadii[ringIdx] || Math.min(PW, PH) * (0.22 + ringIdx * 0.18);
        const posInRing = i - (ringIdx - 1) * RING_SIZE - 1;
        const countInRing = Math.min(RING_SIZE, defNodes.length - (ringIdx - 1) * RING_SIZE - 1);
        const angle    = (posInRing / countInRing) * 2 * Math.PI - Math.PI / 2;
        dn.x = pcx + ringR * Math.cos(angle);
        dn.y = pcy + ringR * Math.sin(angle);
      }

      // Orbit plaintiffs around this defendant
      const group = groups.get(dn.id) || [];
      const n     = group.length;
      if (n === 0) return;
      const outwardAngle = i === 0 ? 0 : Math.atan2(dn.y - pcy, dn.x - pcx);
      const nodeGap  = 16;
      const minOrbit = (n * (2 * 8 + nodeGap)) / (2 * Math.PI);
      const orbitR   = Math.max(dn.r + 72, minOrbit);
      group.forEach((pn, j) => {
        const a = (j / n) * 2 * Math.PI + outwardAngle;
        pn.x = dn.x + orbitR * Math.cos(a);
        pn.y = dn.y + orbitR * Math.sin(a);
      });
    });

    // Normalise to [0,1] — scaled to canvas pixels after W/H are known
    nodes.forEach(n => { n.x = n.x / PW; n.y = n.y / PH; });
  }

  // ── Legend ───────────────────────────────────────────────────────────────
  const legendEl = document.getElementById('graph-legend');
  if (legendEl) {
    const nodeItems = [
      { label: 'AI company (defendant)', color: SERIES_1, type: 'dot' },
      { label: 'Creative co. (plaintiff)', color: '#c3c2b7', type: 'dot' },
      { label: 'Both roles', color: '#c98500', type: 'dot' },
    ];
    const linkItems = [
      { label: 'Ongoing',  color: 'rgba(57,135,229,0.6)',  type: 'line' },
      { label: 'Settled',  color: 'rgba(201,133,0,0.85)', type: 'line' },
      { label: 'Won',      color: 'rgba(25,158,112,0.9)',  type: 'line' },
      { label: 'Lost',     color: 'rgba(230,103,103,0.9)', type: 'line' },
    ];
    [...nodeItems, ...linkItems].forEach(item => {
      const div = document.createElement('div');
      div.className = 'legend-item';
      const mark = document.createElement('div');
      mark.className = item.type === 'dot' ? 'legend-dot' : 'legend-line';
      mark.style.background = item.color;
      if (item.type === 'dot' && item.label.includes('Both')) {
        mark.style.outline = '2px solid #c98500';
        mark.style.outlineOffset = '1px';
        mark.style.background = SERIES_1;
      }
      div.appendChild(mark);
      div.appendChild(document.createTextNode(item.label));
      legendEl.appendChild(div);
    });

    const sizeDiv = document.createElement('div');
    sizeDiv.className = 'legend-item';
    sizeDiv.style.marginLeft = '8px';
    const sizeKey = document.createElement('svg');
    sizeKey.setAttribute('width', '52');
    sizeKey.setAttribute('height', '18');
    sizeKey.style.overflow = 'visible';
    sizeKey.innerHTML = `
      <circle cx="6"  cy="9" r="5"  fill="none" stroke="#898781" stroke-width="1.2"/>
      <circle cx="21" cy="9" r="8"  fill="none" stroke="#898781" stroke-width="1.2"/>
      <circle cx="40" cy="9" r="11" fill="none" stroke="#898781" stroke-width="1.2"/>
    `;
    sizeDiv.appendChild(sizeKey);
    sizeDiv.appendChild(document.createTextNode('Node size = exposure ($B)'));
    legendEl.appendChild(sizeDiv);
  }

  // ── Toolbar ───────────────────────────────────────────────────────────────
  container.innerHTML = '';
  let tooltipEnabled = true;

  const toolbar = document.createElement('div');
  toolbar.className = 'graph-toolbar';
  container.appendChild(toolbar);

  const resetBtn = document.createElement('button');
  resetBtn.className = 'graph-btn';
  resetBtn.textContent = 'Reset zoom';
  toolbar.appendChild(resetBtn);

  const tooltipBtn = document.createElement('button');
  tooltipBtn.className = 'graph-btn graph-btn--active';
  tooltipBtn.textContent = 'Tooltip on';
  tooltipBtn.addEventListener('click', () => {
    tooltipEnabled = !tooltipEnabled;
    tooltipBtn.classList.toggle('graph-btn--active', tooltipEnabled);
    tooltipBtn.textContent = tooltipEnabled ? 'Tooltip on' : 'Tooltip off';
    if (!tooltipEnabled) hideTooltip();
  });
  toolbar.appendChild(tooltipBtn);

  // ── SVG canvas ───────────────────────────────────────────────────────────
  const W = container.clientWidth;
  const H = container.clientHeight - 40; // subtract toolbar height

  const svg = d3.select(container)
    .append('svg')
    .attr('width', W)
    .attr('height', H);

  const zoomG = svg.append('g');

  const zoomBehavior = d3.zoom().scaleExtent([0.25, 5])
    .on('zoom', e => zoomG.attr('transform', e.transform));

  svg.call(zoomBehavior);

  resetBtn.addEventListener('click', () => {
    svg.transition().duration(500).call(zoomBehavior.transform, d3.zoomIdentity);
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const slug    = s  => s.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  // Local SVG letter marks are the reliable source (served by Vite from public/).
  // The Clearbit URL is the production upgrade: when a real logo loads it replaces
  // the letter mark automatically via the image onError fallback chain.
  const LOCAL_SLUG = {
    'OpenAI': 'openai', 'Microsoft': 'microsoft', 'Meta': 'meta',
    'Google': 'google', 'Perplexity': 'perplexity', 'Anthropic': 'anthropic',
    'Cohere': 'cohere', 'Midjourney': 'midjourney', 'Suno': 'suno',
    'Udio': 'udio', 'NVIDIA': 'nvidia', 'Apple': 'apple',
    'Stability AI': 'stability-ai', 'Ross Intelligence': 'ross-intelligence',
    'Universal Music Group': 'universal-music-group',
    'Warner Music Group': 'warner-music-group',
    'Databricks': 'databricks', 'Mureka': 'mureka', 'Eleven Labs': 'eleven-labs',
    'New York Times': 'new-york-times', 'Sony Music': 'sony-music',
    'Disney': 'disney', 'Warner Bros.': 'warner-bros',
    'Universal Pictures': 'universal-pictures', 'DreamWorks': 'dreamworks',
    'Getty Images': 'getty-images', 'Thomson Reuters': 'thomson-reuters',
    'Forbes': 'forbes', 'Condé Nast': 'conde-nast',
    'The Guardian': 'the-guardian', 'CNN': 'cnn', 'Dow Jones': 'dow-jones',
    'Reddit': 'reddit', 'Chicago Tribune': 'chicago-tribune',
    'The Atlantic': 'the-atlantic', 'Vox Media': 'vox-media',
    'Politico': 'politico', 'LA Times': 'la-times',
    'Encyclopedia Britannica': 'encyclopedia-britannica',
    'Elsevier': 'elsevier', 'BMG': 'bmg', 'TED Entertainment': 'ted-entertainment',
    'Chegg': 'chegg', 'GEMA': 'gema', 'Raw Story': 'raw-story',
    'The Intercept': 'the-intercept', 'Daily News': 'daily-news',
    'AFM': 'afm', 'Jamendo': 'jamendo', 'Epidemic Sound': 'epidemic-sound',
    'Koda': 'koda', 'Penske Media': 'penske-media',
    'Hachette Book Group': 'hachette', 'Concord': 'concord',
    'Cognella': 'cognella', 'Authors Guild': 'authors-guild',
    'Ziff Davis': 'ziff-davis',
  };

  // Google favicon service — real logos, no API key, no CORS issues, 128px quality.
  // Falls back to local SVG letter mark if Google can't resolve the domain.
  const logoUrl = id => {
    const domain = LOGO_DOMAINS[id];
    if (domain) return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    const s = LOCAL_SLUG[id];
    return s ? `/logos/${s}.svg` : null;
  };
  const nodeFill = n => {
    if (n.role === 'defendant' || n.role === 'both') return SERIES_1;
    return INDUSTRY_COLOR[n.industry] || TEXT_MUT;
  };
  const nodeStroke = n => {
    if (n.role === 'both')      return '#c98500';
    if (n.role === 'defendant') return 'rgba(255,255,255,0.22)';
    return 'rgba(255,255,255,0.08)';
  };

  // ── Drag behaviour (defined before simulation) ────────────────────────────
  const dragBehavior = d3.drag()
    .on('start', (event, d) => {
      if (!event.active) sim.alphaTarget(0.25).restart();
      d.fx = d.x; d.fy = d.y;
    })
    .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
    .on('end',  (event, d) => {
      if (!event.active) sim.alphaTarget(0);
      d.fx = null; d.fy = null;
    });

  // ── clipPath defs — one per node, used to mask logo images ───────────────
  const defs = svg.append('defs');
  nodes.forEach(n => {
    defs.append('clipPath')
      .attr('id', `clip-${slug(n.id)}`)
      .append('circle')
      .attr('r', n.r);
  });

  // ── Link elements ─────────────────────────────────────────────────────────
  const linkSel = zoomG.append('g').attr('class', 'links')
    .selectAll('line')
    .data(links)
    .join('line')
      .attr('stroke',         d => STATUS_LINK_COLOR[d.status] || STATUS_LINK_COLOR.Ongoing)
      .attr('stroke-width',   d => STATUS_LINK_WIDTH[d.status]  || 1.5)
      .attr('stroke-linecap', 'round');

  // ── Node groups — background circle + logo image + stroke ring ────────────
  const nodeSel = zoomG.append('g').attr('class', 'nodes')
    .selectAll('g.node-g')
    .data(nodes)
    .join('g')
      .attr('class', 'node-g')
      .style('cursor', 'grab')
      .call(dragBehavior);

  // 1. White base (logo sits on clean white; role colour shows via stroke ring)
  nodeSel.append('circle')
    .attr('class', 'node-bg')
    .attr('r',    d => d.r)
    .attr('fill', d => {
      // Only show colour fill for nodes without a logo (no domain mapping)
      return (LOGO_DOMAINS[d.id] || LOCAL_SLUG[d.id]) ? '#ffffff' : nodeFill(d);
    });

  // 2. Logo image clipped to circle
  nodeSel.each(function(d) {
    const url = logoUrl(d.id);
    if (!url) return;
    d3.select(this).append('image')
      .attr('class',               'node-logo')
      .attr('href',                url)
      .attr('x',                   -d.r)
      .attr('y',                   -d.r)
      .attr('width',               d.r * 2)
      .attr('height',              d.r * 2)
      .attr('clip-path',           `url(#clip-${slug(d.id)})`)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .on('error', function() {
        // Google favicon failed → fall back to local SVG letter mark
        const s = LOCAL_SLUG[d.id];
        if (s) {
          d3.select(this)
            .attr('href', `/logos/${s}.svg`)
            .on('error', function() { d3.select(this).remove(); });
        } else {
          d3.select(this).remove();
        }
      });
  });

  // 3. Stroke ring on top (carries role colour, doesn't obscure logo)
  nodeSel.append('circle')
    .attr('class',        'node-ring')
    .attr('r',            d => d.r)
    .attr('fill',         'none')
    .attr('stroke',       d => {
      if (d.role === 'both')      return '#c98500';
      if (d.role === 'defendant') return SERIES_1;
      return INDUSTRY_COLOR[d.industry] || TEXT_MUT;
    })
    .attr('stroke-width', d => (d.role === 'defendant' || d.role === 'both') ? 3 : 2);

  // ── Defendant labels (always visible) ────────────────────────────────────
  const defLabelSel = zoomG.append('g').attr('class', 'def-labels')
    .selectAll('text')
    .data(nodes.filter(n => n.role === 'defendant' || n.role === 'both'))
    .join('text')
      .attr('class', 'node-label-def')
      .style('font-size', d => `${Math.min(12, Math.max(9, d.r * 0.55))}px`)
      .text(d => d.id);

  // ── Plaintiff labels (shown on hover) ────────────────────────────────────
  const pLabelSel = zoomG.append('g').attr('class', 'plaintiff-labels')
    .attr('opacity', 0)
    .selectAll('text')
    .data(nodes.filter(n => n.role === 'plaintiff'))
    .join('text')
      .attr('class', 'node-label-small')
      .text(d => d.id.length > 22 ? d.id.slice(0, 20) + '…' : d.id);

  // ── Scale pre-positions into canvas space ─────────────────────────────────
  nodes.forEach(n => { n.x = n.x * W; n.y = n.y * H; });

  // Pin the most-connected defendant at dead center so the force simulation
  // can't drift it. Release the pin after the simulation has cooled.
  const anchor = nodes.find(n => (n.role === 'defendant' || n.role === 'both') &&
    links.filter(l => (l.source.id ?? l.source) === n.id || (l.target.id ?? l.target) === n.id).length ===
    Math.max(...nodes.map(m => links.filter(l => (l.source.id ?? l.source) === m.id || (l.target.id ?? l.target) === m.id).length))
  );
  if (anchor) { anchor.fx = W / 2; anchor.fy = H / 2; }

  // ── Force simulation — light refinement on top of pre-positions ───────────
  const sim = d3.forceSimulation(nodes)
    .force('link',    d3.forceLink(links).id(d => d.id).distance(80).strength(0.08))
    .force('charge',  d3.forceManyBody().strength(d =>
      d.role === 'defendant' ? -400 : -80
    ))
    .force('collide', d3.forceCollide(d => d.r + 10).strength(1).iterations(6))
    .force('center',  d3.forceCenter(W / 2, H / 2).strength(0.05))
    .alphaDecay(0.02)
    .on('end', () => { if (anchor) { anchor.fx = null; anchor.fy = null; } });

  const cx = W / 2, cy = H / 2, maxR = Math.min(W, H) / 2 - 20;

  sim.on('tick', () => {
    nodes.forEach(n => {
      const dx = n.x - cx, dy = n.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const limit = maxR - n.r;
      if (dist > limit) {
        const scale = limit / dist;
        n.x = cx + dx * scale;
        n.y = cy + dy * scale;
      }
    });

    linkSel
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    // Node groups use transform so clipPath origin stays at (0,0) of the group
    nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);

    // clipPath circles also move with the node group — no extra update needed
    // (they're inside <defs> but reference the same coordinate system via transform)
    defs.selectAll('clipPath circle').each(function(_, i) {
      // clipPaths are in user space; sync their circle centre to (0,0) of each group
    });

    defLabelSel
      .attr('x', d => d.x)
      .attr('y', d => d.y + d.r + 14);

    pLabelSel
      .attr('x', d => d.x)
      .attr('y', d => d.y + d.r + 12);
  });

  // ── Hover interaction ─────────────────────────────────────────────────────
  nodeSel
    .on('mouseenter', function(event, d) {
      const connected = new Set([d.id]);
      const connLinks = new Set();
      links.forEach((l, i) => {
        const sid = l.source.id ?? l.source;
        const tid = l.target.id ?? l.target;
        if (sid === d.id || tid === d.id) {
          connected.add(sid); connected.add(tid);
          connLinks.add(i);
        }
      });

      nodeSel.attr('opacity',        n => connected.has(n.id) ? 1 : 0.08);
      linkSel.attr('stroke-opacity', (_, i) => connLinks.has(i) ? 0.95 : 0.04);
      defLabelSel.attr('opacity',    n => connected.has(n.id) ? 1 : 0.08);
      pLabelSel.attr('opacity',      n => connected.has(n.id) ? 1 : 0);

      const caseList = links.filter(l => {
        const sid = l.source.id ?? l.source;
        const tid = l.target.id ?? l.target;
        return sid === d.id || tid === d.id;
      });
      const isDefendant = d.role === 'defendant' || d.role === 'both';

      const caseRows = caseList.slice(0, 8).map(l => {
        const sid   = l.source.id ?? l.source;
        const other = sid === d.id ? (l.target.id ?? l.target) : sid;
        const sc    = (STATUS_LINK_COLOR[l.status] || '#fff').replace(/[\d.]+\)$/, '1)');
        const badge = l.status !== 'Ongoing'
          ? ' <span style="color:' + sc + '">[' + l.status + ']</span>' : '';
        return other + badge;
      }).join('<br>');

      const overflow = caseList.length > 8
        ? '<br><em style="color:#898781">+' + (caseList.length - 8) + ' more</em>' : '';

      const exposureRow = d.role !== 'plaintiff'
        ? '<div class="tooltip-row"><span>Est. exposure</span><strong>' + fmtExposure(d.exposure || 0) + '</strong></div>' : '';
      const industryRow = d.role === 'plaintiff'
        ? '<div class="tooltip-row"><span>Industry</span><strong>' + (d.industry || '—') + '</strong></div>' : '';

      const html = '<div class="tooltip-title">' + d.id + '</div>'
        + '<div class="tooltip-row"><span>' + (isDefendant ? 'Cases against' : 'Cases filed') + '</span><strong>' + caseList.length + '</strong></div>'
        + exposureRow + industryRow
        + '<div class="tooltip-section">'
        + '<div style="font-size:.7rem;color:#898781;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">'
        + (isDefendant ? 'Plaintiffs' : 'Defendants sued') + '</div>'
        + '<div class="tooltip-plaintiffs">' + caseRows + overflow + '</div>'
        + '</div>';
      if (tooltipEnabled) showTooltip(html, event);
    })
    .on('mouseleave', () => {
      nodeSel.attr('opacity', 1);
      linkSel.attr('stroke-opacity', 1);
      defLabelSel.attr('opacity', 1);
      pLabelSel.attr('opacity', 0);
      hideTooltip();
    });
}

// ─── Theme toggle ────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const p = PALETTES[theme];
  SURFACE_1 = p.SURFACE_1; TEXT_PRI = p.TEXT_PRI; TEXT_MUT = p.TEXT_MUT;
  GRID_COL  = p.GRID_COL;  BASELINE = p.BASELINE;
  SERIES_1  = p.SERIES_1;  SERIES_2 = p.SERIES_2;
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? 'Light' : 'Dark';
  drawExposureChart();
  drawIndustryChart();
  drawStatusSection();
  drawNodeGraph();
}

// ─── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'light') applyTheme('light');

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  animateKPIs();
  drawExposureChart();
  drawIndustryChart();
  drawStatusSection();
  drawNodeGraph();
});
