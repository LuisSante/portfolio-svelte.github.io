<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";

  let data = [];
  let commits = [];
  let width = 1000,
    height = 600;
  let xAxis, yAxis;
  let yAxisGridlines;
  let hoveredIndex = -1;
  let tooltipEl;

  let margin = { top: 10, right: 10, bottom: 30, left: 20 };
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };

  let commitTooltip;
  let tooltipPosition = { x: 0, y: 0 };

  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;

  onMount(async () => {
    data = await d3.csv("./loc.csv", (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + "T00:00" + row.timezone),
      datetime: new Date(row.datetime),
    }));

    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url:
            "https://github.com/LuisSante/portfolio-svelte.github.io/commit/" +
            commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };

        Object.defineProperty(ret, "lines", {
          value: lines,
          configurable: true,
          writable: true,
          enumerable: false,
        });

        return ret;
      });

    console.log(commits);
  });

  $: minDate = d3.min(commits.map((d) => d.date));
  $: maxDate = d3.max(commits.map((d) => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

  $: xScale = d3
    .scaleTime()
    .domain([minDate, maxDatePlusOne])
    .range([usableArea.left, usableArea.right])
    .nice();

  $: yScale = d3
    .scaleLinear()
    .domain([24, 0])
    .range([usableArea.bottom, usableArea.top]);
  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    //d3.select(yAxis).call(d3.axisLeft(yScale));
    d3.select(yAxis).call(
      d3
        .axisLeft(yScale)
        .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00")
    );
  }

  $: {
    d3.select(yAxisGridlines).call(
      d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width)
    );
  }

  $: hoveredCommit = commits[hoveredIndex] ?? {};
  $: console.log("Hovered commit", hoveredCommit);
  $: rScale = d3.scaleLinear()
                .domain(d3.extent(commits.map(d=>d.totalLines)))
                .range([2, 60]);

  function handleMouseMove(event) {
    if (tooltipEl) {
      tooltipEl.style.left = `${event.clientX + 12}px`;
      tooltipEl.style.top = `${event.clientY + 12}px`;
    }
  }

  async function dotInteraction(index, evt) {
    let hoveredDot = evt.target;

    if (evt.type === "mouseenter") {
      hoveredIndex = index;

      tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
        strategy: "fixed",
        middleware: [
          offset(10), // puedes ajustar este valor
          autoPlacement(),
        ],
      });
    } else if (evt.type === "mouseleave") {
      hoveredIndex = -1;
    }
  }
</script>

<section class="container">
  <div class="card">
    <h2>Summary</h2>
    <dl class="stats">
      <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
      <dd>{data.length}</dd>
      <dt>Files</dt>
      <dd>{d3.groups(data, (d) => d.file).length}</dd>
      <dt>Commits</dt>
      <dd>{d3.groups(data, (d) => d.commit).length}</dd>
    </dl>
  </div>
  <svg on:mousemove={handleMouseMove} viewBox="0 0 {width} {height}">
    <g class="dots">
      {#each commits as commit, index}
        <circle
          on:mouseenter={(e) => dotInteraction(index, e)}
          on:mouseleave={(e) => dotInteraction(index, e)}
          cx={xScale(commit.datetime)}
          cy={yScale(commit.hourFrac)}
          r={ rScale(commit.totalLines) }
          fill="steelblue"
          fill-opacity="0.5"
        />
      {/each}
    </g>

    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
    <g
      class="gridlines"
      transform="translate({usableArea.left}, 0)"
      bind:this={yAxisGridlines}
    />
  </svg>
  <dl
    class="info tooltip"
    bind:this={commitTooltip}
    hidden={hoveredIndex === -1}
    style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px;"
  >
    <dt>Commit</dt>
    <dd>
      <a href={hoveredCommit.url} target="_blank">{hoveredCommit.id}</a>
    </dd>

    <dt>Date</dt>
    <dd>
      {hoveredCommit.datetime?.toLocaleString("en", { dateStyle: "full" })}
    </dd>

    <dt>Author</dt>
    <dd>{hoveredCommit.author}</dd>

    <dt>Time</dt>
    <dd>{hoveredCommit.time}</dd>
  </dl>
</section>

<style>
  svg {
    overflow: visible;
  }
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .card {
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 5px 15px var(--shadow);
    border: 1px solid var(--border-color);
    transition:
      transform 0.3s,
      box-shadow 0.3s;
  }

  dl {
    display: grid;
    grid-template-columns: auto;
  }
  dt {
    grid-row: 1;
    font-weight: bold;
    color: var(--border-gray);
    text-transform: uppercase;
  }
  dd {
    font-family: inherit;
    font-weight: bold;
  }
  .gridlines {
    stroke-opacity: 0.2;
  }
  circle {
    transition: transform 200ms;
    transform-origin: center;
    transform-box: fill-box;
  }

  circle:hover {
    transform: scale(1.5);
  }

  .info {
    display: grid;
    margin: 0;
    grid-template-columns: auto auto;
    background-color: oklch(100% 0% 0 / 80%);
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    backdrop-filter: blur(6px);
    padding: 10px;
    font-family: sans-serif;
    font-size: 0.9rem;

    transition:
      opacity 500ms ease,
      visibility 500ms ease;
  }

  .info[hidden]:not(:hover, :focus-within) {
    opacity: 0;
    visibility: hidden;
  }

  .tooltip {
    position: fixed;
    top: 1em;
    left: 1em;
    pointer-events: none;
    z-index: 999;
    transition: top 0.15s ease, left 0.15s ease;
  }

  .info {
    display: grid;
    margin: 0;
    grid-template-columns: 2;
  }

  .info dt {
    grid-column: 1;
    grid-row: auto;
  }

  .info dd {
    grid-column: 2;
    grid-row: auto;
    font-weight: 400;
  }

  .tooltip {
    position: fixed;
    top: 1em;
    left: 1em;
  }
</style>
