<script lang="ts">
	import '../app.css';
	import MenuClient from '$lib/components/MenuClient.svelte';
	import MenuAdmin from '$lib/components/MenuAdmin.svelte';
	import Adminbarebone from '$lib/components/Adminbarebone.svelte';
	export let data;
</script>

{#if data.usertype === 'cliente' || data.usertype === null || data.usertype === undefined}
	<MenuClient categorias={data.categorias} usuario={data.usuario} />
	<nav class="my-4 flex flex-col sm:flex-row justify-evenly items-center text-blue-800 font-extrabold ">
		{#each data.categorias as categoria (categoria.id) }
			<a href="/tienda/{categoria.id}" class="py-2"><span>{categoria.name} </span></a>
			
		{/each}

	</nav>
	<main class="overflow-auto">
		<slot />
	</main>
{:else}
	<Adminbarebone>
		<slot />
		<MenuAdmin slot="menu"  usuario={data.usuario} />
	</Adminbarebone>
{/if}
