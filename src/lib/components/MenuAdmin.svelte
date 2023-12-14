<script lang="ts">
	interface categories {
		id: string;
		name: string;
	}

	export let usuario: string | null | undefined;
</script>

<nav class="navbar md:justify-around mx-auto bg-white">
	<!--Comienzo cambios-->

	<div class="flex justify-between items-center text-blue-800 font-extrabold md:w-auto  w-max">
		<span class="text-xs sm:text-xl md:text-2xl font-[Poppins]">
			<img
				class="inline h-12"
				src="https://res.cloudinary.com/dqlbbx7ud/image/upload/v1695397092/tienda/Logo_rbmsi8.svg"
				alt="Logo"
			/>
			Ecommerce
		</span>
	</div>

	<div class="md:flex">
		<ul class="menu menu-horizontal px-1 text-xs md:text-sm lg:text-xl">
			<!--li><a href="/adm/signup">Crear usuario</a></li-->
			{#if usuario !== null}
				<li><a href="/logout" data-sveltekit-reload>CERRAR SESION</a></li>
			{/if}
		</ul>
	</div>
</nav>
