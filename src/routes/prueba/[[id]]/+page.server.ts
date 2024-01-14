import { crudUserSchema } from '$lib/types/zodSchemas/productSchema.js';
import { superValidate } from 'sveltekit-superforms/server';
import { grabar } from '$lib/supabaseClient';
import {
	createProductFromAdmin,
	createProductImages,
	createPrice
} from '$lib/server/db_queries/query_create.js';
import { product_by_id } from '$lib/server/db_queries/query_select.js';
import type { productToModify } from '$lib/types/Interfaces_or_types.js';

const urlToFIle = (url: string) => {
	const arr = url.split(',');
	const mime: string | null = arr[0].match(/:(.*?);/)?.[1] || null;

	const data = arr[1];
	const dataStr = atob(data);
	let n = dataStr.length;
	const dataArr = new Uint8Array(n);
	while (n--) {
		dataArr[n] = dataStr.charCodeAt(n);
	}

	//let file = new File([dataArr], 'File.jpg', {type: mime})
	const file = new File([dataArr], 'File.jpg', { type: mime as string | undefined });

	return file;
};

export const load = async ({ params }) => {
	const { id } = params;

	if (!id) {
		const form = await superValidate(crudUserSchema);
		return { form };
	}
	const producto = await product_by_id(id);
	if (!producto) {
		const form = await superValidate(crudUserSchema);
		return { form };
	}

	console.log(producto)

	const productoAActualizar: productToModify = {
		"id" : producto.id,
		"name": producto.name,
		"active": producto.active ? 'on' : 'off',
		"codigo": producto.codigo === null? undefined : producto.codigo,
		"description": producto.description,
		"ean_code" : producto.ean_code === null? undefined : producto.ean_code,
		"marca": producto.marca === null? undefined : producto.marca,
		"nuevo": producto.nuevo ? 'on' : 'off',
		"descuento": producto.descuento === null? undefined : producto.descuento,
		"quantity": producto.quantity === null? undefined : producto.quantity,
		"tax": producto.tax,
		"price": producto.prices[0].price,
		"send_images": JSON.stringify(producto.images), //producto.images
	}

	console.log(productoAActualizar);

	const form = await superValidate(productoAActualizar,crudUserSchema);

	return { form };
};

export const actions = {
	create: async ({ request }: { request: Request }) => {
		const form = await superValidate(request, crudUserSchema);
		console.log(form.valid);
		console.log(form);
		if (!form.valid) return;
		return
		const product_id = await createProductFromAdmin(
			form.data.name,
			form.data.quantity,
			form.data.marca,
			form.data.codigo,
			form.data.ean_code,
			form.data.description,
			form.data.descuento,
			form.data.tax,
			form.data.active === 'on' ? true : false,
			form.data.nuevo === 'on' ? true : false
		);

		if (!product_id) return;

		const temp = JSON.parse(form.data.send_images);

		let i = 0;
		const imagenes = temp.files.map((element: { file: string; main: boolean }) => {
			if (element.main) {
				return {
					file: urlToFIle(element.file),
					product_id,
					secure_url: `https://rxcvntscktadpgjwroxh.supabase.co/storage/v1/object/public/products/${product_id}_main.png`,
					file_name: `${product_id}_main.png`,
					main: true
				};
			} else {
				i++;
				return {
					file: urlToFIle(element.file),
					product_id,
					secure_url: `https://rxcvntscktadpgjwroxh.supabase.co/storage/v1/object/public/products/${product_id}_image${i}.png`,
					file_name: `${product_id}_image${i}.png`,
					main: false
				};
			}
		});

		const imagrabar = imagenes.map(
			(element: { product_id: string; secure_url: string; main: boolean }) => {
				return {
					product_id,
					secure_url: element.secure_url,
					main: element.main
				};
			}
		);

		const crear_imagenes = await createProductImages(imagrabar);

		if (!crear_imagenes) return;

		const precio = await createPrice(form.data.price, product_id, 'main');

		if (!precio) return;

		imagenes.forEach(async (element: { file: File; file_name: string }) => {
			try {
				const { data, error } = await grabar.storage
					.from('products')
					.upload(element.file_name, element.file);
				if (data) {
					console.log('sucess', data);
				} else {
					console.log('fail', error, data);
				}
			} catch (error) {
				console.log(error);
				console.log('no se pudo subir');
			}
		});
		return;
	}
};
