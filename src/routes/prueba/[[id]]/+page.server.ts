import { crudUserSchema } from '$lib/types/zodSchemas/productSchema.js';
import { superValidate } from 'sveltekit-superforms/server';
import { grabar } from '$lib/supabaseClient';
import { createProductFromAdmin, createProductImages } from '$lib/server/db_queries/query_create.js';

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
	const form = await superValidate(crudUserSchema);
	return { form };
};

export const actions = {
	create: async ({ request }: { request: Request }) => {
		const form = await superValidate(request, crudUserSchema);
		console.log(form.valid);
		if (!form.valid) return;

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

        console.log('product_id',product_id);
		if(!product_id) return

		const temp = JSON.parse(form.data.send_images);

		let i = 0;
		const imagenes = temp.files.map((element: { file: string; main: boolean }) => {
			if (element.main) {
				return {
					file: urlToFIle(element.file),
					product_id,
					secure_url: `https://rxcvntscktadpgjwroxh.supabase.co/storage/v1/object/public/products/${product_id}_main.png`,
					file_name: `${product_id}_main.png`,
					name: 'main'
				};
			} else {
				i++;
				return {
					file: urlToFIle(element.file),
					product_id,
					sucure_url: `https://rxcvntscktadpgjwroxh.supabase.co/storage/v1/object/public/products/${product_id}_image${i}.png`,
					file_name: `${product_id}_image${i}.png`,
					name: `image${i}`
				};
			}
		});
        console.log(imagenes)
        
      const imagrabar = imagenes.map((element: { file: File; name: string }) => {
        return {
          product_id,
          secure_url: `https://rxcvntscktadpgjwroxh.supabase.co/storage/v1/object/public/products/${element.name}`,
		  name: element.name
        };
      })

        const crear_imagenes = await createProductImages(imagrabar);


        if(!crear_imagenes) return

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
