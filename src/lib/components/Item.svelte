<script lang="ts">
	import ButonQuantity from '$lib/components/ButonQuantity.svelte';
	import type { Product1 } from '$lib/interfaces/Product';
	export let product: Product1;
	const imgCloud = product.Image[0].secureUrl;
	const imgServer = product.Image[0].publicId.split('/').pop();
	export let images: string;
</script>

<div class="flex flex-col items-center border-2 mb-4 mx-2 text-center w-72 bg-white rounded-xl shadow-lg
			{product.quantity <= 0?'opacity-50':''}">

	
	<img src={images === 'true' ? imgCloud : imgServer} alt="article" class="w-45" />

	<div>
		<small><span class="font-bold">code:</span> {product.code}</small>
		<p class="mx-2 text-sm font-bold">{product.name}</p>
		<p class="text-slate-700">
			<strong
				>{product.Price[0].price1.toLocaleString('es-ES', { style: 'currency', currency: 'COP' })}</strong
			>
		</p>
		<p><small class=''>{product.description}</small></p>
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


