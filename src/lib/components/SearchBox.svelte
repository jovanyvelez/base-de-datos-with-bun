<script lang="ts">
    import { goto } from '$app/navigation';
    let texto: string = '';
    const handleKeyDown = (event:KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleClick();
        }
    }

    const handleClick = () => {
        //goto(`/pruebas/${texto}`)

		goto(`/tienda/${JSON.stringify({ param: texto, page: 1, por_categoria: false })}`);
		texto = '';
    }
</script>


<div class="flex flex-wrap justify-center mb-3 mt-5">
	<div class="input-group w-4/12 flex justify-center">
		<input
			type="text"
			placeholder="Buscar…"
			class="input input-bordered"
			bind:value={texto}
			on:keydown={handleKeyDown}
		/>
		<button class="btn btn-square bg-blue-200" on:click={() => handleClick()}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="#1877F2"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/></svg
			>
		</button>
	</div>
</div>