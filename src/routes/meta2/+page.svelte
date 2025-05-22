<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import Bar from "../../components/Bar.svelte";
    import ScatterPlot from "../../components/ScatterPlot.svelte";
    import FileLines from "../../components/FileLines.svelte";
    import { base } from "$app/paths";
    import StackedBar from "../../components/StackedBar.svelte";
    import Scrolly from "svelte-scrolly";
  
    let data = [];
    let commits = [];
    let width = 1000, height = 600;
    let clickedCommits = [];
    let commitProgress = 100;
    
    // Add these variables for the StackedBar component
    let selectedIndex = -1;
    let hoveredIndex = -1;
  
    onMount(async () => {
      data = await d3.csv(base + "/locs.csv", (row) => ({
        ...row,
        line: +row.line,
        depth: +row.depth,
        length: +row.length,
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
            url: "https://github.com/LuisSante/portfolio-svelte.github.io/commit/" + commit,
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
    $: minDate = d3.min(commits.map((d) => d.date));
    $: maxDate = d3.max(commits.map((d) => d.date));
    $: maxDatePlusOne = new Date(maxDate);
    $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);
  
    $: timeScale = d3.scaleTime().domain([minDate, maxDate]).range([0, 100]);
    $: commitMaxTime = timeScale.invert(commitProgress);
  
    $: filteredCommits = commits.filter(commit => commit.datetime <= commitMaxTime);
    $: filteredLines = data.filter(d => d.datetime <= commitMaxTime);
  
    $: minFilteredDate = d3.min(filteredCommits, d => d.date);
    $: maxFilteredDate = d3.max(filteredCommits, d => d.date);
    $: maxFilteredDatePlusOne = new Date(maxFilteredDate);
    $: maxFilteredDatePlusOne.setDate(maxFilteredDatePlusOne.getDate() + 1);
  
    /************************************************************************/
    $: allTypes = Array.from(new Set(filteredLines.map((d) => d.type)));
    
    // Updated to use filteredCommits as mentioned in Step 2.2
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
  
    <!-- Step 3.3: Scrollytelling Implementation -->
    <Scrolly bind:progress={commitProgress}>
      <!-- Story Content -->
      {#each commits as commit, index}
        <p>
          On {commit.datetime.toLocaleString("en", {dateStyle: "full", timeStyle: "short"})},
          {index === 0 
            ? "I set forth on my very first commit, beginning a magical journey of code. You can view it "
            : "I added another commit. See it "}
          <a href="{commit.url}" target="_blank">
            {index === 0 ? "here" : "here"}
          </a>.
          This update transformed {commit.totalLines} lines across {d3.rollups(commit.lines, D => D.length, d => d.file).length} files.
          With every commit, our project grows.
        </p>
      {/each}
  
      <!-- Visualizations in the viz slot -->
      <svelte:fragment slot="viz">
        <div class="viz-container">
          <div class="filelines-container">
            <FileLines lines={filteredLines} width={1200} />
          </div>
          
          <div class="charts-container">
            <ScatterPlot
              {data}
              {commits}
              {filteredCommits}
              {filteredLines}
              width={700}
              {height}
              bind:clickedCommits
              {minFilteredDate}
              {maxFilteredDatePlusOne}
            />
  
            <StackedBar
              data={languageBreakdown}
              width={700}
              bind:selectedIndex
              bind:hoveredIndex
            />
          </div>
        </div>
      </svelte:fragment>
    </Scrolly>
  </section>
  
  <style>
    /* Step 3.0: Making the page wider */
    :global(body) {
      max-width: min(120ch, 80vw);
      margin: 0 auto;
    }
  
    .container {
      width: 100%;
      max-width: none;
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
  
    .viz-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem;
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 5px 15px var(--shadow);
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
    }
  
    .filelines-container {
      width: 100%;
      margin-bottom: 2rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow-x: auto;
    }
  
    .charts-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: center;
    }
  
    /* Scrolly styling */
    :global(.scrolly-container) {
      max-width: none !important;
    }
  
    :global(.scrolly-viz) {
      position: sticky;
      top: 0;
      height: 100vh;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 1rem;
      overflow-y: auto;
    }
  
    /* Scrolly story styling */
    :global(.scrolly) p {
      margin: 2rem 0;
      padding: 2rem;
      background: var(--card-bg);
      border-radius: 8px;
      border-left: 4px solid var(--accent-color);
      line-height: 1.6;
      font-size: 1.1rem;
    }
  
    :global(.scrolly) a {
      color: var(--accent-color);
      text-decoration: none;
      font-weight: bold;
    }
  
    :global(.scrolly) a:hover {
      text-decoration: underline;
    }
  </style>