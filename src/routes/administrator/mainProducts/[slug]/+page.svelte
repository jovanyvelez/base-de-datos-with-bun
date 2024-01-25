<script lang="ts">
	import { goto } from '$app/navigation';
	import AddItem from '$lib/components/iconos/Add-icon.svelte';
	import Image from '$lib/components/utils/Image.svelte';
	export let data;
	let paginacion = true;
	let pags: number[] = [...Array(data.pages).keys()];
</script>

<menu class="flex flex-col sm:flex-row justify-between mx-16 items-center mb-10">
	<h1 class="text-3xl font-bold">E-products</h1>
	<button class="btn btn-primary" on:click={() => goto('/administrator/productos')}><AddItem /> Agregar producto</button>
</menu>

<article class="flex w-10/12 flex-wrap justify-around items-center mx-auto">
	{#each data.products as producto (producto.id)}
		<button on:click={() => goto(`/administrator/productos/${producto.id}`)}>
			<div class="card w-96 bg-base-100 shadow-xl my-5 mx-5">
				<div class="h-80 flex justify-center items-center">
					<figure><Image src={producto.img} /></figure>
				</div>

				<div class="card-body">
					<h2 class="card-title">{producto.name}</h2>
					<p>cantidad: {producto.quantity}</p>
					<p>Precio: {producto.prices[0].price}</p>
				</div>
			</div>
		</button>
	{/each}
</article>

{#if pags.length > 1 && paginacion}
	<div class="flex flex-wrap justify-center pagination">
		{#each pags as pag, i}
			<style>
				.pagination a {
					padding: 0.5rem;
					margin: 0.5rem;
					border-radius: 0.5rem;
					border: 0.1rem #a4a4a4 solid;
					font-size: 0.8rem;
					font-family: Helvetica, Arial, sans-serif;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}
				.pagination a.active {
					font-weight: bold;
					color: red;
				}
			</style>
			<a
				class="mx-1 {i + 1 === data.page ? 'active' : ''}"
				href={`/administrator/mainProducts/${i+1}`}
			>
				{i + 1}
			</a>
		{/each}
	</div>
{/if}

<style>
	.pagination a {
		padding: 0.5rem;
		margin: 0.5rem;
		border-radius: 0.5rem;
		border: 0.1rem #a4a4a4 solid;
		font-size: 0.8rem;
		font-family: Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.pagination a.active {
		font-weight: bold;
		color: red;
	}
</style>
