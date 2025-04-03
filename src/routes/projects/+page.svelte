<script>
  import projects from "$lib/projects.json";
  import Pie from "../../components/Pie.svelte";
  import * as d3 from "d3";

  let query = "";
  let selectedYearIndex = -1;
  
  $: filteredProjects = projects.filter(project => {
    let values = Object.values(project).join("\n").toLowerCase();
    return values.includes(query.toLowerCase());
  });

  let pieData;
  $: {
    let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);
    pieData = rolledData.map(([year, count]) => ({ value: count, label: year }));
  }

  let selectedYear;
  $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

  $: filteredByYear = filteredProjects.filter(project => {
    if (selectedYear) return project.year === selectedYear;
    return true;
  });
</script>

<svelte:head>
  <title>My Projects</title>
</svelte:head>

<input
  type="search"
  bind:value={query}
  aria-label="Search projects"
  placeholder="🔍 Search projects..."
/>
<div class="pie-chart">
  <Pie data={pieData} />
</div>
<div class="container-projects">
  {#each filteredByYear as p}
    <article class="project-card">
      <img src={p.image} alt={p.title} class="project-image" />
      <div class="project-info">
        <h2>{p.title}</h2>
        <p>{p.description}</p>
        <a href={p.link} class="btn" target="_blank">Ver más</a>
      </div>
    </article>
  {/each}
</div>

<style>
  .container-projects {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
  }

  .project-card {
    background: var(--card-bg);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 5px 15px var(--shadow);
    transition:
      transform 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
    max-width: 350px;
    display: flex;
    flex-direction: column;
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px var(--shadow);
  }

  .project-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .project-info {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    display: inline-block;
    background: var(--primary);
    color: white;
    text-align: center;
    padding: 0.8rem;
    border-radius: 8px;
    font-weight: bold;
    text-decoration: none;
    transition: background 0.3s;
  }

  .btn:hover {
    background: var(--primary-dark);
  }
</style>
