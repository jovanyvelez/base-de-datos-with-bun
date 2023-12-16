<script>
	export let data;
	const { datos } = data;
	
</script>



{#if data.usertype === 'cliente' || data.usertype === undefined}
	{#if datos.length > 0}
		{#await datos}
			<p>...waiting</p>
		{:then categorias}
			{#each categorias as category (category.categoria_id)}
				<div>
					<h1 class="my-10 ml-12 text-blue-800 font-bold text-3xl text-center">{category.categoria_name}</h1>
				</div>
				<div class="flex flex-wrap justify-center">
					{#each category.productos as product (product.product_id)}
						<div class="card w-48 sm:w-64 bg-base-100 shadow-xl mx-2 mt-2">
							<figure>
								<img
									src={product.secure_url}
									alt="article"
									class=""
								/>
							</figure>
							<div class="card-body">
								<p class="card-title text-sm font-bold">{product.name.trim()}</p>
								<div class="card-actions justify-end">
									<small class="font-bold">code: {product.product_id}</small>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		{/if}
{:else}
	<div class="flex justify-center items-center min-h-full">
		<h1 class="text-3xl text-primary mx-auto">Bienvenido al Panel de Administracion</h1>
	</div>
{/if}
