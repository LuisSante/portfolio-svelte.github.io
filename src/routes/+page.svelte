<script>
  import GitHubStats from "../components/GitHubStats.svelte";
  let username = "LuisSante";
</script>

<div class="container">
  <section class="profile-section">
    <img
      src="./images/perfil.jpeg"
      alt="Profile photo of Luis Sante"
      class="profile-image"
    />
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
  </section>

  <section class="skills card">
    <h2>Technical Skills</h2>
    <div class="skills-grid">
      <div class="skill-item">
        <span>🧠</span>
        <span>Artificial Intelligence</span>
      </div>
      <div class="skill-item">
        <span>📊</span>
        <span>Machine Learning</span>
      </div>
      <div class="skill-item">
        <span>🖥️</span>
        <span>Deep Learning</span>
      </div>
      <div class="skill-item">
        <span>📝</span>
        <span>Natural Language Processing</span>
      </div>
      <div class="skill-item">
        <span>📷</span>
        <span>Computer Vision</span>
      </div>
    </div>
  </section>

  <section class="github-stats card">
    <h2>GitHub Statistics</h2>
    <GitHubStats {username} />
  </section>

  <section class="portfolio">
    <p>Want to see more of my work and experience?</p>
    <a
      href="https://portofolio-artificial-intelligence.vercel.app/"
      target="_blank"
    >
      View My Full Portfolio
    </a>
  </section>
</div>

<style>
  /* Modern container with max-width */
.container,
.container-sm {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.container-sm {
  max-width: 800px;
}

/* Cards for content sections */
.card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px var(--shadow);
  border: 1px solid var(--border-color);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px var(--shadow);
}

/* Profile section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 3rem 0;
}

.profile-image {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--card-bg);
  box-shadow: 0 5px 15px var(--shadow);
  margin-bottom: 1.5rem;
}

.description {
  max-width: 800px;
  margin: 1.5rem auto;
  text-align: center;
  line-height: 1.7;
}

/* Skills section */
.skills {
  padding: rem 0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.skill-item {
  background-color: var(--card-bg);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 5px var(--shadow);
  transition: transform 0.2s, background-color 0.2s;
}

.skill-item:hover {
  transform: translateY(-3px);
  background-color: rgba(var(--primary-rgb, 58, 134, 255), 0.05);
}

.skill-item i,
.skill-item span {
  font-size: 1.1rem;
}

/* GitHub stats section */
.github-stats {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 5px 15px var(--shadow);
}

.github-stats img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.github-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}


/* Portfolio link */
.portfolio {
  margin: 3rem 0;
  text-align: center;
}

.portfolio a {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white !important;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s;
}

.portfolio a:hover {
  background-color: var(--primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(58, 134, 255, 0.3);
}
</style>