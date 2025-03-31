<svelte:head>
  <title>Contact me</title>
</svelte:head>

<div class="container-form">
    <form action="mailto:luissante123@gmail.com" method="get">
        <label for="email">Email:</label> <br>
        <input name="email" type="email"> <br>
        <label for="subject">Subject:</label> <br>
        <input name="subject" type="text"> <br>
        <label for="body">Body:</label> <br>
        <textarea name="body"></textarea> <br>
        <button>Submit</button>
    </form>
</div>

<style>
  /* Contact form */
.container-form {
  max-width: 600px;
  background: var(--card-bg);
  padding: 2rem;
  margin: 3rem auto;
  border-radius: 12px;
  box-shadow: 0 5px 20px var(--shadow);
  border: 1px solid var(--border-color);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.15);
}

textarea {
  resize: vertical;
  min-height: 120px;
}

</style>