import { type Actions, type Action, fail } from '@sveltejs/kit';
import sharp from 'sharp';
import { grabar } from "$lib/supabaseClient";



const registrar: Action = async ({ request, locals }) => {
	
	//Traemos todos los datos del formulario web
	const datos = await request.formData();
    const file = await datos.get('nueva_imagen')
	console.log(file)
	const {data, error} = await supabase.storage.from('products').upload(`product_${Date.now()}.png`, file)
	console.log("enviado correctamente")
	return {sucess:true}
	//const buffer = Buffer.from(await file.arrayBuffer());

	if(error){
		console.log("Error en supabase")
	}

	return
	let blob
	try {
		await sharp(buffer)
			.resize(200, 300, {
				kernel: sharp.kernel.nearest,
				fit: 'contain',
				background: { r: 255, g: 255, b: 255, alpha: 0.5 }
			})
			.toBuffer()
			.then(async data => {
				blob = data;
				blob.name = file.name				
			});


	} catch (error) {
		console.error(error)
	}

	return {sucess:true, image:JSON.stringify(blob)}
};

export const actions: Actions = { registrar };
