<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { categorias } = data;
	const { form, errors } = superForm(data.form, {
		resetForm: false
	});

	/**
	 * Se declara el array de imagenes que contendrá el producto
	 */
	let image: { id: number; main: boolean; secure_url: string } = {
		id: 0,
		main: false,
		secure_url: ''
	};

	let showImage = image.id !== 0 ? true : false;

	if ($form.send_images) {
		image = JSON.parse($form.send_images).files;
		showImage = image.id !== 0 ? true : false;
	}


	const WITH = 300; //Ancho máximo de las imagenes

	let input: HTMLInputElement;

	let new_image_url = '';



	async function onChange() {
		const file = input.files ? input.files[0] : null;

		if (file) {
			showImage = true;
			const reader = new FileReader();
			let modificar = false;

			reader.addEventListener('load', function () {
				const new_image = document.createElement('img');
				if (reader.result !== null) {
					new_image.setAttribute('src', reader.result as string);
					new_image_url = reader.result as string;
				}

				new_image.onload = async (e) => {
					let w_image = WITH;
					let h_image = WITH;
					if (e.target !== null) {
						const imageElement = e.target as HTMLImageElement;
						w_image = imageElement.width ? imageElement.width : 300;
						h_image = imageElement.height ? imageElement.height : 300;
					}
					let ratio;
					let canvas = document.createElement('canvas');
					if (w_image >= h_image && WITH / w_image < 1) {
						ratio = WITH / w_image;
						canvas.width = WITH;
						canvas.height = h_image * ratio;
						modificar = true;
					} else if (w_image < h_image && WITH / h_image < 1) {
						ratio = WITH / h_image;
						canvas.height = WITH;
						canvas.width = w_image * ratio;
						modificar = true;
					}
					if (modificar) {
						const context = canvas.getContext('2d');
						if (context) {
							context.drawImage(new_image, 0, 0, canvas.width, canvas.height);
							new_image_url = context.canvas.toDataURL('image/jpeg', 100);
						}
					}

					image = { secure_url: new_image_url, id: Date.now(), main: true };

					canvas.remove();
				};
				new_image.remove();
			});
			reader.readAsDataURL(file);
			return;
		}
		showImage = false;
	}
	const convert_to_string = async () => {
		$form.send_images = JSON.stringify({ files: image });
	};



</script>

<main class="m-7 bg-white bordered shadow-slate-400 shadow-lg rounded-xl">
	{#if $form.id}
		<h1 class="text-3xl font-semibold p-4">Modificacion de categoria</h1>
	{:else}
		<h1 class="text-3xl font-semibold p-4">Agregar una categoria</h1>
	{/if}
	<article class=" p-4 mx-4">
		<h2 class="text-xl font-semibold mb-2">Agregar foto de la categoria</h2>
		<h3 class="text-lg mb-2">Solo una imagen por categoria</h3>
		<div class="max-w-min my-4">
			<label for="laImagen">
				<div class="flex w-1/12">
					<div class="flex flex-col justify-center items-center max-w-md">
						<div
							class="bordered border-4 hover:cursor-pointer border-sky-500 rounded-full w-9 h-9 flex justify-center items-center"
						>
							<span class="text-2xl my-4"> + </span>
						</div>
						<span class="text-xl font-semibold">Agregar </span>
					</div>
				</div>
			</label>
		</div>
		<input
			id="laImagen"
			class="hidden"
			bind:this={input}
			on:change={onChange}
			type="file"
			accept=".jpg, .jpeg, .png .svg"
		/>
		<div class="flex justify-center items-center p-2 flex-wrap">
			{#if showImage}

				{#if !image}
					<p>No hay imagen a mostrar</p>
				{:else}
					<img src={image.secure_url} alt="{image.id}}" class="mx-2 rounded-xl" />
				{/if}
					

			{/if}
		</div>
	</article>

	<form method="post" action="?/create" class="sm:mx-20">
		<input type="hidden" name="parent_id" bind:value={$form.parent_id} />
		<input type="hidden" name="send_images" bind:value={$form.send_images} />
		<input type="hidden" name="id" bind:value={$form.id} />

		<article class="flex flex-col md:flex-row mt-8">
			<div class="w-full sm:w-3/6">
				<h2 class="text-xl font-semibold">Agregar nombre</h2>
				<h3 class="text-lg mb-2">Agrega un nombre de categoria, que la diferencie de otras</h3>
			</div>
			<input
				type="text"
				name="name"
				id="name"
				bind:value={$form.name}
				placeholder="Agrega un nombre"
				class="input input-primary input-bordered input-md sm:input-lg w-full sm:w-3/6 sm:ml-2"
			/>
			{#if $errors.name}<small class="text-error">{$errors.name}</small>
			{/if}
		</article>

		<article class="flex flex-col md:flex-row items-center mt-8">
			<div class="sm:w-6/12">
				<h2 class="text-xl font-semibold">Agregar descripcion</h2>
				<h3 class="text-lg my-4">Agrega mayor información de la categoria</h3>
			</div>
			<textarea
				bind:value={$form.description}
				placeholder="Escribe aqui la descripcion de tu producto"
				name="description"
				class="textarea textarea-primary textarea-bordered textarea-md sm:textarea-lg w-3/6 sm:ml-2"
			></textarea>
		</article>
		
		<button type="submit" on:click={convert_to_string} class="btn btn-primary mt-8">Enviar </button>
	</form>
	<div class="flex justify-center items-center p-2 flex-wrap">
		{#each categorias as categoria (categoria.id)}
			<div class="flex flex-col border-2 border-sky-500 m-3 p-5 rounded-2xl">
				<button on:click={() => $form.parent_id = categoria.id}>
					<p>{categoria.name}</p>
					{#each categoria.tree as branch (branch.id)}
						<small>{branch.name}</small>
					{/each}
				</button>
			</div>
		{/each}
	</div>

</main>
<small>{JSON.stringify(image, null, 2)}</small>
