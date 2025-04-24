<script>
  import * as d3 from "d3";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";

  export let commits = [];
  export let filteredCommits = [];
  export let width = 1000;
  export let height = 600;
  export let clickedCommits = [];
  export let minFilteredDate;
  export let maxFilteredDatePlusOne;

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

  $: xScale = d3
    .scaleTime()
    .domain([minFilteredDate, maxFilteredDatePlusOne])
    .range([usableArea.left, usableArea.right])
    .nice();

  $: yScale = d3
    .scaleLinear()
    .domain([24, 0])
    .range([usableArea.bottom, usableArea.top]);
  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
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

  $: hoveredCommit = filteredCommits[hoveredIndex] ?? {};
  $: console.log("Hovered commit", hoveredCommit);
  $: rScale = d3
    .scaleLinear()
    .domain(d3.extent(commits.map((d) => d.totalLines)))
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
        middleware: [offset(10), autoPlacement()],
      });
    } else if (evt.type === "mouseleave") {
      hoveredIndex = -1;
    } else if (evt.type === "click") {
      let commit = commits[index];
      if (!clickedCommits.includes(commit)) {
        clickedCommits = [...clickedCommits, commit];
      } else {
        clickedCommits = clickedCommits.filter((c) => c !== commit);
      }
    }
  }
</script>

<svg on:mousemove={handleMouseMove} viewBox="0 0 {width} {height}">
  <g class="dots">
    {#each filteredCommits as commit, index (commit.id)}
      <circle
        style="--r: {rScale(commit.totalLines)}"
        on:mouseenter={(e) => dotInteraction(index, e)}
        on:mouseleave={(e) => dotInteraction(index, e)}
        on:click={(evt) => dotInteraction(index, evt)}
        class:selected={clickedCommits.includes(commit)}
        cx={xScale(commit.datetime)}
        cy={yScale(commit.hourFrac)}
        r={rScale(commit.totalLines)}
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

<style>
  svg {
    overflow: visible;
  }
  .gridlines {
    stroke-opacity: 0.2;
  }
  circle {
    transition:
      transform 200ms,
      r calc(var(--r) * 100ms);
    transform-origin: center;
    transform-box: fill-box;
  }

  circle:hover {
    transform: scale(1.5);
  }

  @starting-style {
    circle {
      r: 0;
    }
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
    transition:
      top 0.15s ease,
      left 0.15s ease;
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
  .selected {
    fill: var(--color-accent);
    stroke: black;
    stroke-width: 1.5;
  }
</style>
