<svelte:head>
  <title>My Project</title>
</svelte:head>
<script>
  import projects from "$lib/projects.json";
</script>
<div class="container">
  <div class="projects">
    {#each projects as p}
      <article>
        <h2>Lorem ipsum dolor sit.</h2>
        <img src="https://i.etsystatic.com/iap/a0f246/5502938083/iap_640x640.5502938083_69958kp0.jpg" alt="" />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam dolor quos,
          quod assumenda explicabo odio, nobis ipsa laudantium quas eum veritatis
          ullam sint porro minima modi molestias doloribus cumque odit.
        </p>
      </article>
    {/each}
  </div>
    Comming soon ...
</div>