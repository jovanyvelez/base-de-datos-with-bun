<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from "sveltekit-superforms/client";


	//import { grabar } from '$lib/supabaseClient';

	//export let form;
	export let data;
	const { form } = superForm(data.form);

	const WITH = 300;
	let primera_imagen = true;
	let input: HTMLInputElement;
	$form.quantity = 1;
	$form.tax = 0;
	$form.descuento = 0;
	$form.active = "on";
	$form.new = "on";

	let imagen_to_upload;
	let images: { id: number; main: boolean; file: string }[] = [];
	let new_image_url = '';

	let showImage = false;

	async function onChange() {
		const file = input.files ? input.files[0] : null;
		imagen_to_upload = input.files ? input.files[0] : null;

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
						//imagen_to_upload =  urlToFIle(new_image_url)
					}
					const existe = buscar_imagen(new_image_url);
					if (!existe)
						images = [
							...images,
							{ file: new_image_url, id: Date.now(), main: primera_imagen ? true : false }
						];
					primera_imagen = false;
					canvas.remove();
					//const {data, error} = await grabar.storage.from('products').upload(`product_${Date.now()}.png`, imagen_to_upload)
				};
				new_image.remove();
			});

			reader.readAsDataURL(file);

			return;
		}
		showImage = false;
	}

	let urlToFIle = (url: string) => {
		let arr = url.split(',');
		let mime: string | null = arr[0].match(/:(.*?);/)?.[1] || null;

		let data = arr[1];
		let dataStr = atob(data);
		let n = dataStr.length;
		let dataArr = new Uint8Array(n);
		while (n--) {
			dataArr[n] = dataStr.charCodeAt(n);
		}

		//let file = new File([dataArr], 'File.jpg', {type: mime})
		let file = new File([dataArr], 'File.jpg', { type: mime as string | undefined });

		return file;
	};

	const deleteThis = (main: boolean, id: number) => {
		images = images.filter((item) => item.id != id);
		if (images.length === 0) {
			primera_imagen = true;
			showImage = false;
		}
		if (main && images.length) images[0].main = true;
	};

	const buscar_imagen = (imagen: string) => {
		const temp_image = images.find((item) => item.file == imagen);

		return temp_image ? true : false;
	};

	function selectDiv(image: { id: number; main: boolean; file: string }) {
		if (image.main) return;
		image.main = true;
		images.forEach((item) => {
			if (item.id !== image.id) {
				item.main = false;
			} else {
				item.main = true;
			}
		});
		images = [...images];
	}
</script>

<main class="m-7 bg-white bordered shadow-slate-400 shadow-lg rounded-xl">
	<h1 class="text-3xl font-semibold p-4">Agregar un producto</h1>

	<article class=" p-4 mx-4">
		<h2 class="text-xl font-semibold mb-2">Agregar fotos del producto</h2>
		<h3 class="text-lg mb-2">Agrega una o varias imágenes a tu producto</h3>
		<div class="max-w-min">
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
				{#each images as item (item.id)}
					<div
						class={`p-2  main relative ${
							item.main ? 'bordered border-4 border-red-500 rounded-xl' : ''
						}`}
					>
						<button on:click={(event) => selectDiv(item)}>
							<img src={item.file} alt="{item.id}}" class="mx-2 rounded-xl" />
						</button>

						<div
							class="bg-white rounded-full bordered border-4 border-red-500 absolute top-2 right-4 cursor-pointer shadow-lg"
						>
							<button on:click={() => deleteThis(item.main, item.id)}
								><span class=" text-sm hover:text-sm font-bold p-2 text-red-500">X</span></button
							>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex justify-center items-center p-2 w-52 h-52 bg-slate-100 rounded-2xl">
					<svg width="96" height="96" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M3 20h18a1 1 0 0 0 .864-1.504l-7-12c-.359-.615-1.369-.613-1.729 0L9.866 12.1l-1.02-1.632A.998.998 0 0 0 8 10h-.001a1 1 0 0 0-.847.47l-5 8A1 1 0 0 0 3 20M14 8.985L19.259 18h-5.704l-2.486-3.987zm-5.999 3.9L11.197 18H4.805zM6 8c1.654 0 3-1.346 3-3S7.654 2 6 2S3 3.346 3 5s1.346 3 3 3m0-4a1 1 0 1 1 0 2a1 1 0 0 1 0-2"
						/></svg
					>
				</div>
			{/if}
		</div>

		<form method="post" action="?/create">
			<input type="hidden" name="id" bind:value={$form.id} />			<h2 class="text-xl font-semibold mb-2">Agregar nombre</h2>
			<h3 class="text-lg my-4">Agrega un nombre del producto, que lo diferencie de otros</h3>
			<input
				type="text"
				name="name"
				id="name"
				bind:value={$form.name}
				placeholder="Agrega un nombre"
				class="input input-primary input-bordered w-full m-4"
			/>
			<h2 class="text-xl font-semibold mb-2">Agregar marca</h2>
			<h3 class="text-lg my-4">Agrega la marca del producto, (-Es opcional-)</h3>
			<input
				type="text"
				name="marca"
				bind:value={$form.marca}
				placeholder="Aqui va la marca del producto"
				class="input input-primary input-bordered w-full m-4"
			/>
			<h2 class="text-xl font-semibold mb-2">Agregar codigo</h2>

			<div class="flex items-center">
				<h3 class="text-lg my-4">Agrega codigo de interno del producto, (-Es opcional-)</h3>
				<input
					type="text"
					name="codigo"
					bind:value={$form.codigo}
					placeholder="codigo ?"
					class="input input-primary input-bordered w-full m-4 max-w-40 mx-4 rounded-full"
				/>
			</div>
			<h2 class="text-xl font-semibold mb-2">Agregar codigo EAN</h2>

			<div class="flex items-center">
				<h3 class="text-lg my-4">Agrega codigo EAN del producto, ( - Es opcional - )</h3>
				<input
					type="text"
					name="ean_code"
					bind:value={$form.ean_code}
					placeholder="codigo EAN ?"
					class="input input-primary input-bordered w-full m-4 max-w-40 mx-4 rounded-full"
				/>
			</div>
			<h2 class="text-xl font-semibold mb-2">Agregar descripcion</h2>
			<h3 class="text-lg my-4">Agrega mayor información de tu producto</h3>
			<textarea
				bind:value={$form.description}
				placeholder="Escribe aqui la descripcion de tu producto"
				name="description"
				class="textarea textarea-primary textarea-bordered w-full mx-4"
			></textarea>
			<h2 class="text-xl font-semibold my-4">Cantidad disponible</h2>
			<div class="flex">
				<h3 class="text-lg my-4">Cantidad de unidades disponibles para la venta</h3>
				<div class="mx-4 flex flex-col sm:flex-row items-center">
					<button
						type="button"
						on:click={() => ($form.quantity = Math.round($form.quantity - 1) < 0 ? 0 : Math.round($form.quantity - 1))}
						><svg width="50" height="50" viewBox="0 0 50 50"
							><path
								fill="currentColor"
								d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"
							/><path fill="currentColor" d="M16 24h18v2H16z" /></svg
						></button
					>
					<input
						class="rounded-lg text-xl max-w-20"
						min="0"
						name="quantity"
						bind:value={$form.quantity}
						type="number"
					/>
					<button type="button" on:click={() => ($form.quantity = Math.round($form.quantity + 1))}
						><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"
							><path
								fill="currentColor"
								d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"
							/><path fill="currentColor" d="M16 24h18v2H16z" /><path
								fill="currentColor"
								d="M24 16h2v18h-2z"
							/></svg
						></button
					>
				</div>
			</div>
			<h2 class="text-xl font-semibold mb-2">Agregar precio al público</h2>
			<div class="flex items-center">
				<h3 class="text-lg my-4">incluye el precio de tu producto sin decimales</h3>
				<input type="number" name="price" bind:value={$form.price} required class="min-w-16 mx-4 rounded-full" />
			</div>
			<h2 class="text-xl font-semibold mb-2">Agregar precio Lista1</h2>
			<div class="flex items-center">
				<h3 class="text-lg my-4">incluye el precio de tu producto sin decimales</h3>
				<input type="number" name="price1" bind:value={$form.price1} required class="min-w-16 mx-4 rounded-full" />
			</div>
			<h2 class="text-xl font-semibold mb-2">Agregar precio Lista2</h2>
			<div class="flex items-center">
				<h3 class="text-lg my-4">incluye el precio de tu producto sin decimales</h3>
				<input type="number" name="price2" bind:value={$form.price2} required class="min-w-16 mx-4 rounded-full" />
			</div>
			<h2 class="text-xl font-semibold mb-2">Agregar precio Lista3</h2>
			<div class="flex items-center">
				<h3 class="text-lg my-4">incluye el precio de tu producto sin decimales</h3>
				<input type="number" name="price3" bind:value={$form.price3} required class="min-w-16 mx-4 rounded-full" />
			</div>
			<h2 class="text-xl font-semibold mb-2">Agregar descuento</h2>
			<div class="flex items-center">
				<h3 class="text-lg my-4">Agrega el descuento en porcentaje</h3>
				<input type="number" name="price" bind:value={$form.descuento} class="min-w-16 mx-4 rounded-full" />
			</div>
			<h2 class="text-xl font-semibold mb-2">Agregar iva</h2>
			<div class="flex items-center">
				<h3 class="text-lg my-4">Agrega el iva en porcentaje</h3>
				<input type="number" name="tax" bind:value={$form.tax}  class="min-w-16 mx-4 rounded-full" />
			</div>
			<h2 class="text-xl font-semibold mb-2">Activacion del producto</h2>
			<fieldset>
				<div class="flex align-center">
					<legend class="flex flex-row items-center text-lg gap-2 mr-2 my-2"
						>Deseas activar el producto:</legend
					>
					<input
						type="radio"
						id="activeChoice1"
						bind:value={$form.active}
						name="active"
						checked
						class="w-8 h-8 bg-[#E0E0E0] rounded-full cursor-pointer not-checked:appearance-none"
					/>
					<label for="activeChoice1" class="flex flex-row items-center gap-2 ml-2 mr-2">SI</label>

					<input
						type="radio"
						id="activeChoice2"
						bind:value={$form.active}
						name="active"
						class="ml-2 mr-1 w-8 h-8 bg-[#E0E0E0] rounded-full cursor-pointer not-checked:appearance-none"
					/>
					<label for="activeChoice2" class="flex flex-row items-center gap-2">NO</label>
				</div>
			</fieldset>
			<fieldset>
				<div class="flex align-center">
					<legend class="flex flex-row items-center text-lg gap-2 mr-2 my-2"
						>Es una referencia nueva?</legend
					>
					<input
						type="radio"
						id="activeChoice1"
						bind:value={$form.new}
						name="new"
						checked
						class="w-8 h-8 bg-[#E0E0E0] rounded-full cursor-pointer not-checked:appearance-none"
					/>
					<label for="activeChoice1" class="flex flex-row items-center gap-2 ml-2 mr-2">SI</label>

					<input
						type="radio"
						id="activeChoice2"
						bind:value={$form.new}
						name="new"
						class="ml-2 mr-1 w-8 h-8 bg-[#E0E0E0] rounded-full cursor-pointer not-checked:appearance-none"
					/>
					<label for="activeChoice2" class="flex flex-row items-center gap-2">NO</label>
				</div>
			</fieldset>
			<!--form
	action="?/registrar"
	method="post"
	enctype="multipart/form-data"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		formData.append('nueva_imagen', imagen_modificada);

		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted

		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
		};
	}}
>
	<input
		id="file"
		name="file"
		bind:this={input}
		on:change={onChange}
		type="file"
		accept=".jpg, .jpeg, .png"
	/>
	<button type="submit" class="btn btn-primary">Enviar </button>
</form-->
			<button type="submit" class="btn btn-primary">Enviar </button>
		</form>
	</article>
</main>

<style>
	input[type='number'] {
		-webkit-appearance: textfield;
		-moz-appearance: textfield;
		appearance: textfield;
		font-family: sans-serif;
		padding: 0.5rem;
		border: solid;
		border-width: 2px;
		height: 3rem;
		font-weight: bold;
		text-align: center;
		color: #588dd3;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
	}
</style>
