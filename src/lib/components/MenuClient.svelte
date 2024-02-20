<script lang="ts">
	import { cart  } from '$lib/stores/stores';

	interface categories {
		id:string,
		name: string
	}

	export let categorias:categories[];
	export let usuario: string | null | undefined ;
	$: items = $cart.length;

</script>

<nav class="navbar md:justify-around mx-auto bg-white shadow-md">
  <!--Comienzo cambios-->
	
  <div class="flex justify-between items-center text-blue-800 font-extrabold md:w-auto w-screen">
    <span class="text-xs sm:text-xl md:text-2xl font-[Poppins]">
		Ecommerce
        <!--img class="inline h-12" src="https://res.cloudinary.com/dqlbbx7ud/image/upload/v1695397092/tienda/Logo_rbmsi8.svg" alt="Logo"-->
    </span>

</div>

	<div class="md:flex ">
		<ul class="menu menu-horizontal px-1 text-xs md:text-sm lg:text-xl">
			<li class=""><a href="/">INICIO</a></li>
			<!--li>
				<details>
					<summary class="mr-9 md:mx-0"> <span class="font-bold">IR A TIENDA</span></summary>
					<ul class="p-2 bg-base-100 z-50">
						{#each categorias as categoria}
							<li class="text-base"><a href="/tienda/{categoria.id}" data-sveltekit-reload>{categoria.name}</a></li>
						{/each}
					</ul>
				</details>
			</li-->
			{#if usuario !== null}
				<li><a href="/logout" data-sveltekit-reload>CERRAR SESION</a></li>
			{/if}
		</ul>
	</div>

	<div class=" flex-none mr-10">
		<div class="relative flex">
			<a href="/carrito">
				<img src="https://res.cloudinary.com/dqlbbx7ud/image/upload/v1695398056/tienda/Carrito_sk1brn.svg" alt="Carrito" />
			</a>
			
			<div class="relative flex">
				{#key items}
					<span>{items}</span>
				{/key}
			</div>
		</div>
	</div>

</nav>
