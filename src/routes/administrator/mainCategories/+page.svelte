<script>
    import { goto } from '$app/navigation';
    import AddItem from '$lib/components/iconos/Add-icon.svelte';
	export let data
    const{ categories } = data
	console.log(categories)
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

<div class="flex justify-center items-center flex-wrap">
	{#each categories as categoria (categoria.id)}

		<div class="card card-compact w-96 bg-base-100 shadow-xl m-5">
			<button on:click={() => goto(`/administrator/categories/${categoria.id}`)}>
				<figure><img src={categoria.imagen?.secure_url} alt="Shoes"/></figure>
			</button>
			<div class="card-body">
			<h2 class="card-title">{categoria.name}</h2>
			<p>{categoria.description}</p>
			<div class="card-actions justify-end">
				<button class="btn btn-primary">Categorias hijas</button>
			</div>
			</div>
		</div>
	{/each}
</div>

<pre>{JSON.stringify(categories, null, 2)}</pre>