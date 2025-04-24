<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import Bar from "../../components/Bar.svelte";
  import ScatterPlot from "../../components/ScatterPlot.svelte"

  let data = [];
  let commits = [];
  let width = 1000,
    height = 600;
  let clickedCommits = [];
  let commitProgress = 100;

  onMount(async () => {
    data = await d3.csv("portfolio-svelte.github.io/locs.csv", (row) => ({
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

  /************************************************************************/
  $: timeScale = d3.scaleTime().domain([minDate, maxDate]).range([0, 100]);
  $: commitMaxTime = timeScale.invert(commitProgress);

  $: filteredCommits = commits.filter(
    (commit) => commit.datetime <= commitMaxTime
  );
  $: filteredLines = data.filter((d) => d.datetime <= commitMaxTime);

  $: minFilteredDate = d3.min(filteredCommits, (d) => d.date);
  $: maxFilteredDate = d3.max(filteredCommits, (d) => d.date);
  $: maxFilteredDatePlusOne = new Date(maxFilteredDate);
  $: maxFilteredDatePlusOne.setDate(maxFilteredDatePlusOne.getDate() + 1);

  /************************************************************************/

  $: minDate = d3.min(commits.map((d) => d.date));
  $: maxDate = d3.max(commits.map((d) => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

  /********************* CHART BAR **************************************/
  $: allTypes = Array.from(new Set(filteredLines.map((d) => d.type)));
  $: selectedLines = (
    clickedCommits.length > 0 ? clickedCommits : filteredCommits
  ).flatMap((d) => d.lines);

  $: selectedCounts = d3.rollup(
    selectedLines,
    (v) => v.length,
    (d) => d.type
  );

  $: languageBreakdown = allTypes.map((type) => [
    type,
    selectedCounts.get(type) || 0,
  ]);
  /************************************************************************/
</script>

<section class="container">
  <div class="card">
    <h2>Summary</h2>
    <dl class="stats">
      <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
      <dd>{filteredLines.length}</dd>
      <dt>Files</dt>
      <dd>{d3.groups(filteredLines, (d) => d.file).length}</dd>
      <dt>Commits</dt>
      <dd>{d3.groups(filteredLines, (d) => d.commit).length}</dd>
    </dl>
  </div>
  <div class="slider-container">
    <div class="slider">
      <label for="slider">Show commits until:</label>
      <input
        type="range"
        id="slider"
        name="slider"
        min="0"
        max="100"
        bind:value={commitProgress}
      />
    </div>
    <time class="time-label">{commitMaxTime.toLocaleString()}</time>
  </div>
  <ScatterPlot
    {data}
    {commits}
    {filteredCommits}
    {filteredLines}
    {width}
    {height}
    bind:clickedCommits
    {minFilteredDate}
    {maxFilteredDatePlusOne}
  />
  <Bar data={languageBreakdown} {width} />
</section>

<style>
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

  .slider-container {
    display: grid;
  }
  .slider {
    display: flex;
  }
  #slider {
    flex: 1;
  }
  .time-label {
    font-size: 0.75em;
    text-align: right;
  }
</style>
