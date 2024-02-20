<script>
    import { goto } from '$app/navigation';
    import AddItem from '$lib/components/iconos/Add-icon.svelte';
	export let data
    const{ categories } = data
</script>

<menu class="flex flex-col sm:flex-row justify-between mx-16 items-center mb-10">
	<h1 class="text-3xl font-bold">Categorias</h1>
	<button class="btn btn-primary" on:click={() => goto('/administrator/categories')}><AddItem /> Agregar categoria</button>
</menu>


<article class="flex w-10/12 flex-wrap justify-around items-center mx-auto">
	{#each categories as categoria (categoria.id)}
		<button on:click={() => goto(`/administrator/categories/${categoria.id}`)}>
            <p>{categoria.name}</p>
		</button>
	{/each}
</article>

<pre>{JSON.stringify(categories, null, 2)}</pre>