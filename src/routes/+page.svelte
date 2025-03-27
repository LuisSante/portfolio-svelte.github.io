<script>
  import GitHubStats from "../components/GitHubStats.svelte";
  let username = "LuisSante";
</script>

<div class="container">
  <h1>Luis Felipe Sante Taipe</h1>
  <div class="description">
    <p>Hello, my name is Luis Sante, I am 23 years old.</p>
    <p>
      I am from Arequipa, Peru. I studied Computer Science at the National
      University of San Agustín and completed my studies in 2023.
    </p>
    <p>
      My areas of interest include Artificial Intelligence, Machine Learning,
      Deep Learning, Data Science, Natural Language Processing (NLP) and
      Computer Vision.
    </p>
  </div>
  <img src="./images/perfil.jpeg" alt="Foto de perfil de Luis Sante" />

  <div class="skills">
    <h2>Technical Skills</h2>
    <ul>
      <li>🧠 Artificial Intelligence</li>
      <li>📊 Machine Learning</li>
      <li>🖥️ Deep Learning</li>
      <li>📝 Natural Language Processing (NLP)</li>
      <li>📷 Computer Vision</li>
    </ul>
  </div>

  <div>
    <GitHubStats username={username} /> 
  </div>
  
  <div class="portfolio">
    <p>If you want to see my experience, you can visit my portfolio:</p>
    <a
      href="https://portofolio-artificial-intelligence.vercel.app/"
      target="_blank">My portfolio</a
    >
  </div>
</div>
