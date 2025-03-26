<script>
	import Header from '../components/Header.svelte'
	import './styles.css';
</script>

<div class="app">
	<Header/>
	<main>
		<slot />
	</main>

	<footer>
		<p>visit to learn with Luis Sante</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	/*
		main {
		}
	*/

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
