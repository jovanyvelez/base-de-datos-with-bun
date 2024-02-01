<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { form, message, errors, enhance } = superForm(data.form, {
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

	if ($form.id) {
		image = JSON.parse($form.send_images); //Imagenes que vienen del servidor
	}

	const WITH = 300; //Ancho máximo de las imagenes

	let input: HTMLInputElement;

	let new_image_url = '';

	let showImage = image.id !== 0 ? true : false;

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
				<img src={image.secure_url} alt="{image.id}}" class="mx-2 rounded-xl" />
			{/if}
		</div>
	</article>

	<pre>
	{JSON.stringify($form, null, 2)}
</pre>
</main>
