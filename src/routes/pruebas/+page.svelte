<script>
	import { grabar } from "$lib/supabaseClient";
	import { enhance } from '$app/forms';


	export let form;

	const WITH = 200

	let input;
	let container;
	let imagen_modificada;
	let image;
	let new_image_url
	let new_image;
	let placeholder;
	let showImage = false;

	function onChange() {

		const file = input.files[0];
		let result;
		if (file) {
			showImage = true;
			const reader = new FileReader();	
			reader.addEventListener('load', function () {
				
				image.setAttribute("src",reader.result)

				image.onload = (e)=>{
					
					let canvas = document.createElement("canvas")
					let ratio = WITH /e.target.width
					canvas.width = WITH
					canvas.height = e.target.height * ratio
					const context = canvas.getContext("2d")
					context.drawImage(image, 0, 0, canvas.width, canvas.height)
					new_image_url = context.canvas.toDataURL("image/jpeg", 100 )

					imagen_modificada = urlToFIle(new_image_url)
					//const resultBlob = dataURItoBlob(new_image_url);
					const {data, error} = grabar.storage.from('products').upload(`product_${Date.now()}.png`, imagen_modificada)
				}
			});
			reader.readAsDataURL(file);
			image.setAttribute("src", new_image_url)
			console.log("vamos aqui")
			return;
		}
		showImage = false;
	}

	let urlToFIle = (url) => {
		let arr = url.split(",");
		let mime = arr[0].match(/:(.*?);/)[1];
		let data = arr[1];
		let dataStr = atob(data);
		let n = dataStr.length;
		let dataArr = new Uint8Array(n)
		while(n--){
			dataArr[n] = dataStr.charCodeAt(n)
		}

		let file = new File([dataArr], 'File.jpg', {type: mime})
		console.log(file)
		return file

	}
	// Función para convertir una URL de datos a Blob
	function dataURItoBlob(dataURI) {
		const byteString = atob(dataURI.split(',')[1]);
		const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);

		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ab], { type: mimeString });
	}
</script>

<h1>Image Preview on File Upload</h1>
<input bind:this={input} on:change={onChange} type="file" accept=".jpg, .jpeg, .png"/>

<div bind:this={container}>
	{#if showImage}
		<img bind:this={image} src="" alt="Preview" />
	{:else}
		<span bind:this={placeholder}>Image Preview</span>
	{/if}
</div>

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

<style>
	div {
		width: 300px;
		min-height: 100px;
		border: 2px solid #ddd;
		margin-top: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		color: #ccc;
	}
	img {
		width: 100%;
	}
</style>
