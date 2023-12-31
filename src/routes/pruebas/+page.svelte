<script>
	import { grabar } from "$lib/supabaseClient";

	export let form;

	const WITH = 200

	let input;
	let container;
	let imagen_to_upload;
	let images = [];
	let image;
	let new_image_url = ''
	let placeholder;
	let showImage = false;

	async function onChange() {

		const file = input.files[0];
		imagen_to_upload = input.files[0];

		if (file) {
			showImage = true;
			const reader = new FileReader();	
			let modificar = false;
			

			reader.addEventListener('load', function () {
				
				const new_image = document.createElement("img")
				new_image.setAttribute("src",reader.result)
				new_image_url = reader.result;
				
				new_image.onload = async (e)=>{
					
					const w_image = e.target.width;
					const h_image = e.target.height;
					let ratio;
					let canvas = document.createElement("canvas")
					if(w_image >= h_image && (WITH / w_image) < 1){
						ratio = WITH / w_image
						canvas.width = WITH
						canvas.height = h_image * ratio
						modificar = true
					}else if(w_image < h_image && (WITH / h_image) < 1){
						ratio = WITH / h_image
						canvas.height = WITH
						canvas.width = w_image * ratio
						modificar = true
					}
					if(modificar){
						const context = canvas.getContext("2d")
						context.drawImage(new_image, 0, 0, canvas.width, canvas.height)
						new_image_url = context.canvas.toDataURL("image/jpeg", 100 )
						//imagen_to_upload =  urlToFIle(new_image_url)
					}
						const existe = buscar_imagen(new_image_url);
						if(!existe) images = [...images, {file:new_image_url,id:Date.now()}]
						//const {data, error} = await grabar.storage.from('products').upload(`product_${Date.now()}.png`, imagen_to_upload)

						//console.error(error);
					
				}
				new_image.remove();
			});
			
			reader.readAsDataURL(file);

			return
		}
		showImage = false;
	}

	let urlToFIle = (url) => {
	
		let arr = url.split(",");
		let mime = arr[0].match(/:(.*?);/)[1];
		console.log(mime)
		let data = arr[1];
		let dataStr = atob(data);
		let n = dataStr.length;
		let dataArr = new Uint8Array(n)
		while(n--){
			dataArr[n] = dataStr.charCodeAt(n)
		}

		let file = new File([dataArr], 'File.jpg', {type: mime})

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

	const deleteThis = (id)=>{
		images = images.filter(item => item.id != id)
	}

	const buscar_imagen = (imagen)=>{
		
		const temp_image = images.find(item => item.file == imagen);

		return temp_image? true : false 
	}
</script>



<h1>Image Preview on File Upload</h1>
<input bind:this={input} on:change={onChange} type="file" accept=".jpg, .jpeg, .png" />

<div bind:this={container} class="flex justify-center items-center p-2 flex-wrap">
	{#if showImage}
		{#each images as item (item.id)}
			<div class="relative">
				<img  src={item.file} alt="{item.id}}" class="mx-2" />
				<div class="rounded-full bordered border-2 border-red-500   absolute top-2 right-4 cursor-pointer shadow-lg">
					<button on:click={() => deleteThis(item.id)}><span class=" text-xs hover:text-sm font-bold p-2 text-red-500 ">X</span></button>
				</div>
			</div>	
		{/each}
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

