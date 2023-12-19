<script lang="ts">
	import ButonQuantity from '$lib/components/ButonQuantity.svelte';

	export let product: any;


</script>

<div class="flex flex-col items-center border-2 mb-4 mx-2 text-center w-72 bg-white rounded-xl shadow-lg
			{product.quantity <= 0?'opacity-50':''}">

	
	<img src={product.images[0].secure_url} alt="article" class="w-45" />

	<div>
		<small><span class="font-bold">code:</span> {product.codigo}</small>
		<p class="mx-2 text-sm font-bold">{product.name}</p>
		<p class="text-slate-700">
			<strong
				>{product.prices[0].price.toLocaleString('es-ES', { style: 'currency', currency: 'COP' })}</strong
			>
		</p>
		<!--p><small class=''>{product.description}</small></p-->
		<p class={product.quantity <= 0?'text-red-500':''}>disponible: {product.quantity}</p>
	</div>
	{#if product.quantity > 0}
		<div class="z-30">
			{#key product}
				<ButonQuantity product={{ ...product, qtyBuy: 0 }} mostrarCosto={false} />
			{/key}
		</div>
	{/if}
	
</div>


