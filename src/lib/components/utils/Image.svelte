{#if loaded}
	<img {src} alt="Document" class="w-full" />
{:else if failed}
	<img src="https://icon-library.com/images/not-found-icon/not-found-icon-20.jpg" alt="Not Found" />
{:else if loading}
    <span>Loading</span>
    <span class="loading loading-ring loading-lg text-primary"></span>
{/if}

<script lang="ts">
	import { onMount } from 'svelte'
	export let src: string;

	let loaded = false;
	let failed = false;
	let loading = false;

	onMount(() => {
			const img = new Image();
			img.src = src;
			loading = true;

			img.onload = () => {
					loading = false;
					loaded = true;
			};
			img.onerror = () => {
					loading = false;
					failed = true;
			};
	})
</script>