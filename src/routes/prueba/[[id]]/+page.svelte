<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { form } = superForm(data.form);

	console.log($form)

	/**
	 * Se declara el array de imagenes que contendrá el producto
	*/
	let images: { id: number; main: boolean; secure_url: string }[] ;
	/**
	 * Si no viene un producto desde el servidor, se inicializa el formulario
	 * con los valores por defecto
	*/
	if(!$form.id){
		$form.quantity = 1;
		$form.tax = 0;
		$form.descuento = 0;
		$form.price = 0;
		$form.active = 'on';
		$form.nuevo = 'on';
		images = []
	}else{

		images = JSON.parse($form.send_images); //Imagenes que vienen del servidor
	}


	const WITH = 300; //Ancho máximo de las imagenes

	let primera_imagen = true;
	let input: HTMLInputElement;

	
	let new_image_url = '';

	let showImage = images.length > 0?true:false;

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
					const existe = buscar_imagen(new_image_url);
					if (!existe)
						images = [
							...images,
							{ secure_url: new_image_url, id: Date.now(), main: primera_imagen ? true : false }
						];
					primera_imagen = false;
					canvas.remove();
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
		const temp_image = images.find((item) => item.secure_url == imagen);

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

	const convert_to_string = async () => {
		$form.send_images = JSON.stringify({ files: images });
	};
</script>

<main class="m-7 bg-white bordered shadow-slate-400 shadow-lg rounded-xl">
	<h1 class="text-3xl font-semibold p-4">Agregar un producto</h1>

	<article class=" p-4 mx-4">
		<h2 class="text-xl font-semibold mb-2">Agregar fotos del producto</h2>
		<h3 class="text-lg mb-2">Agrega una o varias imágenes a tu producto</h3>
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
				{#each images as item (item.id)}
					<div
						class={`p-2  main relative ${
							item.main ? 'bordered border-4 border-red-500 rounded-xl' : ''
						}`}
					>
						<button on:click={(event) => selectDiv(item)}>
							<img src={item.secure_url} alt="{item.id}}" class="mx-2 rounded-xl" />
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

		<form method="post" action="?/create" class="sm:mx-20">
			<input type="hidden" name="send_images" bind:value={$form.send_images} />
			<input type="hidden" name="id" bind:value={$form.id} />

			<article class="flex flex-col md:flex-row mt-8">
				<div class="w-full sm:w-3/6">
					<h2 class="text-xl font-semibold">Agregar nombre</h2>
					<h3 class="text-lg mb-2">Agrega un nombre del producto, que lo diferencie de otros</h3>
				</div>
				<input
					type="text"
					name="name"
					id="name"
					bind:value={$form.name}
					placeholder="Agrega un nombre"
					class="input input-primary input-bordered input-md sm:input-lg w-full sm:w-3/6 sm:ml-2"
				/>
			</article>

			<article class="flex flex-col md:flex-row mt-8">
				<div class="w-full sm:w-6/12">
					<h2 class="text-xl font-semibold">Agregar marca</h2>
					<h3 class="text-lg my-4">Agrega la marca del producto, (-Es opcional-)</h3>
				</div>
				<input
					type="text"
					name="marca"
					bind:value={$form.marca}
					placeholder="Aqui va la marca del producto"
					class="input input-primary input-bordered input-md sm:input-lg w-full sm:w-3/6 sm:ml-2"
				/>
			</article>

			<article class="flex flex-col md:flex-row items-center mt-8">
				<div class="w-full sm:w-6/12">
					<h2 class="text-xl font-semibold">Agregar codigo</h2>
					<h3 class="text-lg my-4">Agrega codigo de interno del producto, (-Es opcional-)</h3>
				</div>

				<input
					type="text"
					name="codigo"
					bind:value={$form.codigo}
					placeholder="codigo ?"
					class="input input-primary input-bordered w-full max-w-40 rounded-full mt-4 sm:ml-2"
				/>
			</article>

			<article class="flex flex-col md:flex-row items-center mt-8">
				<div class="w-full sm:w-6/12">
					<h2 class="text-xl font-semibold">Agregar codigo EAN</h2>
					<h3 class="text-lg">Agrega codigo EAN del producto, ( - Es opcional - )</h3>
				</div>
				<input
					type="text"
					name="ean_code"
					bind:value={$form.ean_code}
					placeholder="codigo EAN ?"
					class="input input-primary input-bordered w-full max-w-40 rounded-full mt-4 sm:ml-2"
				/>
			</article>
			<article class="flex flex-col md:flex-row items-center mt-8">
				<div class="sm:w-6/12">
					<h2 class="text-xl font-semibold">Agregar descripcion</h2>
					<h3 class="text-lg my-4">Agrega mayor información de tu producto</h3>
				</div>
				<textarea
					bind:value={$form.description}
					placeholder="Escribe aqui la descripcion de tu producto"
					name="description"
					class="textarea textarea-primary textarea-bordered textarea-md sm:textarea-lg w-3/6 sm:ml-2"
				></textarea>
			</article>
			<article class="flex flex-col md:flex-row items-center mt-8">
				<div class="w-full sm:w-6/12">
					<h2 class="text-xl font-semibold mt-8">Cantidad disponible</h2>
					<h3 class="text-lg">Cantidad de unidades disponibles para la venta</h3>
				</div>
				<div class="flex items-center ml-2">
					<button
						type="button"
						on:click={() =>
							($form.quantity =
								Math.round($form.quantity - 1) < 0 ? 0 : Math.round($form.quantity - 1))}
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
			</article>
			<article class="flex flex-col md:flex-row items-center">
				<div class="w-full sm:w-6/12">
					<h2 class="text-xl font-semibold mt-8">Agregar precio al público</h2>
					<h3 class="text-lg my-4">incluye el precio de tu producto sin decimales</h3>
				</div>
				<input
					type="number"
					name="price"
					bind:value={$form.price}
					class="min-w-16 rounded-full ml-2"
				/>
			</article>

			<article class="flex flex-col md:flex-row items-center">
				<div class="w-full sm:w-6/12">
					<h2 class="text-xl font-semibold mt-8">Agregar descuento</h2>
					<h3 class="text-lg my-4">Agrega el descuento en porcentaje</h3>
				</div>
				<input
					type="number"
					name="descuento"
					bind:value={$form.descuento}
					class="min-w-16 rounded-full ml-2"
				/>
			</article>
			<article class="flex flex-col items-center sm:flex-row">
				<div class="w-full sm:w-6/12">
					<h2 class="text-xl font-semibold mt-8">Agregar iva</h2>
					<h3 class="text-lg my-4">Agrega el iva en porcentaje</h3>
				</div>
				<input type="number" name="tax" bind:value={$form.tax} class="min-w-16 rounded-full" />
			</article>

			<fieldset>
				<div class="flex align-center flex-col sm:flex-row mt-8">
					<legend class="text-lg gap-2 ml-2 my-2 sm:w-6/12"
						>Deseas activar el producto:</legend
					>
					<div class="mx-auto w-6/12">
						<input
							type="radio"
							id="activeChoice1"
							bind:value={$form.active}
							name="active"
							checked
							class="w-4 sm:w-8 h-4 sm:h-8 bg-[#E0E0E0] rounded-full cursor-pointer not-checked:appearance-none ml-2"
						/>
						<label for="activeChoice1" class="gap-2 mx-2 text-xs sm:text-sm">SI</label>

						<input
							type="radio"
							id="activeChoice2"
							bind:value={$form.active}
							name="active"
							class="ml-2 mr-1 w-4 sm:w-8 h-4 sm:h-8 bg-[#E0E0E0] rounded-full cursor-pointer not-checked:appearance-none"
						/>
						<label for="activeChoice2" class="gap-2 mx-2 text-xs sm:text-lg">NO</label>
					</div>
				</div>
			</fieldset>
			<fieldset>
				<div class="flex align-center flex-col sm:flex-row mt-8">
					<legend class=" text-lg gap-2 ml-2 my-2 sm:w-6/12">Es una referencia nueva?</legend>
					<div class="mx-auto w-6/12">
						<input
							type="radio"
							id="activeChoice1"
							bind:value={$form.nuevo}
							name="nuevo"
							checked
							class="w-4 sm:w-8 h-4 sm:h-8 bg-[#E0E0E0] rounded-full cursor-pointer not-checked:appearance-none"
						/>
						<label for="activeChoice1" class="gap-2 mx-2 text-xs sm:text-sm">SI</label>

						<input
							type="radio"
							id="activeChoice3"
							bind:value={$form.nuevo}
							name="nuevo"
							class="ml-2 mr-1 w-4 sm:w-8 h-4 sm:h-8 bg-[#E0E0E0] rounded-full cursor-pointer not-checked:appearance-none"
						/>
						<label for="activeChoice3" class="gap-2 mx-2 text-xs sm:text-sm">NO</label>
					</div>
				</div>
			</fieldset>
			<button type="submit" on:click={convert_to_string} class="btn btn-primary  mt-8"
				>Enviar
			</button>
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
