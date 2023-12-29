<script lang="ts">

	import Item from '$lib/components/Item.svelte';



	export let data;
	let datos
	
	let paginacion = true;

	let pags: number[] = [...Array(data.pages).keys()];


	let texto = '';


	$: if (paginacion) datos = data.products;
	

	$: if (data.pages) {
		pags = [...Array(data.pages).keys()];
	}

</script>



<!-- Herramienta de búsqueda>

<Fin herramienta de búsqueda-->


<!--Muestra los productos a comprar-->

{#if data.cantidad> 0}
	<div class="flex flex-wrap justify-center">
		{#each data.products as product (product.id)}
			<Item {product}  />
		{/each}
	</div>
{:else}
	<h1 class="text-xl sm:text-7xl">Ups, no hay productos aquí</h1>
{/if}
<!--Fin muestra los productos a mostrar-->


<!--Muestra los botones de paginación-->

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
		</style>	<a
				class="mx-1 {i + 1 === data.page ? 'active' : ''}"
				href={`/tienda/${JSON.stringify({ param: data.query.param, page: 1 + i, por_categoria: data.query.por_categoria })}`}
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
