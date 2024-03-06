import { grabar } from '$lib/supabaseClient';
import { urlToFIle } from '$lib/server/utils/files.js';
import { crudCategoriaSchema } from '$lib/types/zodSchemas/categoriesSchema.js';
import {superValidate } from 'sveltekit-superforms/server';
import type{ categoryToModify } from '$lib/types/Interfaces_or_types.js';
import { allCategories, categoriaById } from '$lib/server/db_queries/query_select.js';
import { updateCategoryById } from '$lib/server/db_queries/query_update.js';
import { createCategoryImages } from '$lib/server/db_queries/query_create.js';
import { deleteCategoryImage } from '$lib/server/db_queries/query_delete.js';

export const load = async ({ params }) => {
	const { id } = params;

	if (!id) {
		const form = await superValidate(crudCategoriaSchema);
		return { form };
	}
	
	const categoria = await categoriaById(id);
	
    if (!categoria) {
		const form = await superValidate(crudCategoriaSchema);
		return { form };
	}

	const categoriaAActualizar: categoryToModify = {
		name: categoria.name,
		description: categoria.description ? categoria.description : 'Nothing',
		parent_id: categoria.parent_id ? categoria.parent_id : ' ',
		send_images: JSON.stringify(categoria.imagen) ? JSON.stringify(categoria.imagen) : '[xxxxxxxxxxxxxxxxxxx]',
		id: categoria.id
	};


	const form = await superValidate(categoriaAActualizar, crudCategoriaSchema);

	return { form };

};

export const actions = {
	create: async ({ request }: { request: Request }) => {

		const form = await superValidate(request, crudCategoriaSchema);

		const imagesFrom = JSON.parse(form.data.send_images);

		if (!form.valid) return {form};

		if (!form.data.id) {
			return {
				form
			};
		}

		const categoria = await categoriaById(form.data.id);
		if (!categoria) {
			return {
				form
			};
		}

		
		console.log("Podemos actualizar el registro")

		const imagen = {
			file: urlToFIle(imagesFrom.files.secure_url),
			secure_url: `https://rxcvntscktadpgjwroxh.supabase.co/storage/v1/object/public/products/${categoria.id}_${categoria.name}.png`,
			file_name: `${categoria.id}_${categoria.name}.png`,
			main: true 
		}
		if(categoria.imagen){
			//Borramos la imagen vieja en supabase
			const { error } = await grabar.storage
							.from('products')
							.remove([ `${categoria.imagen.public_id}` ]);
			console.log(error)
			if(error) return
			//Borro el registro en la tabla de imagenes
			deleteCategoryImage(categoria.imagen.id)
		}
			//creo la imagen en supabase
			try {
				const { data, error } = await grabar.storage
					.from('products')
					.upload(imagen.file_name, imagen.file);
				if (data) {
					console.log('sucess');

				} else {
					console.log('fail', error, data);
				}
			} catch (error) {
				console.log(error);
				console.log('no se pudo subir');
			}
		
		const imgGrabada = await createCategoryImages({categoria_id:categoria.id, secure_url: imagen.secure_url, main:true, public_id: imagen.file_name})
		if(!imgGrabada){
			console.log('actualizo');
		}
		return {form}
	}
}


