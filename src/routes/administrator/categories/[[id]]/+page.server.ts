import { crudCategoriaSchema } from '$lib/types/zodSchemas/categoriesSchema.js';

import {superValidate } from 'sveltekit-superforms/server';

import type{ categoryToModify } from '$lib/types/Interfaces_or_types.js';
import { allCategories, categoriaById } from '$lib/server/db_queries/query_select.js';


export const load = async ({ params }) => {
	const { id } = params;

	if (!id) {
		const form = await superValidate(crudCategoriaSchema);
		const categorias = await allCategories();
		return { form, categorias };
	}

	const categoria = await categoriaById(id);

    if (!categoria) {
		const form = await superValidate(crudCategoriaSchema);
		return { form };
	}

	const productoAActualizar: categoryToModify = {
		name: categoria.name,
		description: categoria.description ? categoria.description : undefined,
		parent_id: categoria.parent_id ? categoria.parent_id : undefined,
		send_images: JSON.stringify(categoria.imagenes),
		id: categoria.id
	};

	const form = await superValidate(productoAActualizar, crudCategoriaSchema);


	return { form };
};

export const actions = {
	create: async ({ request }: { request: Request }) => {
		const form = await superValidate(request, crudCategoriaSchema);
		const imagesFromFront = JSON.parse(form.data.send_images);
		//const tempImages = imagesFromFront.files.slice();
		//if (tempImages.length < 1) return { form };
		//console.log(imagesFromFront);
		if (!form.valid) return  {form} ;
		return {form};
	}
}

