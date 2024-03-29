import { crudUserSchema } from '$lib/types/zodSchemas/productSchema.js';
import { superValidate } from 'sveltekit-superforms/server';
import { grabar } from '$lib/supabaseClient';
import { urlToFIle } from '$lib/server/utils/files.js';
//import {uploadImage} from '$lib/server/cloudinary.js';
import {
	createProductFromAdmin,
	createProductImages,
	createPrice
} from '$lib/server/db_queries/query_create.js';
import { product_by_id } from '$lib/server/db_queries/query_select.js';
import type { productToModify } from '$lib/types/Interfaces_or_types.js';
import {
	deleteImageNotInlist,
	imageUpdateMain,
	updateProductById,
} from '$lib/server/db_queries/query_update.js';
import { deleteProductPrice } from '$lib/server/db_queries/query_delete.js';

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

	const productoAActualizar: productToModify = {
		id: producto.id,
		name: producto.name,
		active: producto.active ? "on" : "off",
		codigo: producto.codigo === null ? undefined : producto.codigo,
		description: producto.description,
		ean_code: producto.ean_code === null ? undefined : producto.ean_code,
		marca: producto.marca === null ? undefined : producto.marca,
		nuevo: producto.nuevo ? "on" : "off",
		descuento: producto.descuento === null ? undefined : producto.descuento,
		quantity: producto.quantity === null ? undefined : producto.quantity,
		tax: producto.tax,
		price: producto.prices[0].price,
		send_images: JSON.stringify(producto.images) //producto.images
	};

	const form = await superValidate(productoAActualizar, crudUserSchema);


	return { form };
};

export const actions = {
	create: async ({ request }: { request: Request }) => {
		const form = await superValidate(request, crudUserSchema);

		//console.log(form)
		if (!form.valid) return {form};

		const imagesFromFront = JSON.parse(form.data.send_images);

		let tempImages = imagesFromFront.files.slice();

		/**
		 * El producto debe tener al menos una imagen
		 */
		if (tempImages.length < 1) return { form };

		let producto;
		let product_id: string;
		let imagenes: {
			id: string;
			public_id?: string;
			secure_url: string;
			main: boolean;
			file_name: string;
			file: File;
		}[] = [];

		/**
		 * Si Existe form.data.id es porque estamos actualizando
		 */

		if (form.data.id) {


			producto = await product_by_id(form.data.id);

			if (!producto) return {form}; //El producto debería existir

			/**
			 * capturo id del producto a modificar
			 */
			product_id = producto.id;



			/**
			 * Traigo las imagenes de la base de datos
			 */
			const { images } = producto;

			/**
			 * indexo las imagenes traidas de la base de datos y las guardo en un objeto
			 */

			const index: { [key: string]: { id: string; main: boolean; public_id: string } } = images.reduce((acc, curr) => {
				return { ...acc, [curr.id]: { id: curr.id, main: curr.main, public_id: curr.public_id } };
			}, {});

			/**
			 * indexo imagenes de interfaz de usuaio y las guardo en un objeto
			 */

			const indexImages: { [key: string]: { id: string; main: boolean } } = tempImages.reduce(
				(acc:{ [key: string]: { id: string; main: boolean; public_id: string } }, 
					curr: { id: string; main: boolean; public_id: string }) => {
					return { ...acc, [curr.id]: { id: curr.id, main: curr.main } };
				},
				{} 
			);

			/**
			 * Busco imagenes que estén en la base de datos y no estén en la interfaz de usuario
			 */

			const imagesToDelete = Object.keys(index).filter((key) => !indexImages[key]);

			for (const image of tempImages) {
				if (index[image.id]) {
					if (image.main !== index[image.id].main) {
						/**
						 * Imagenes que estan en la base de datos y en la interfaz de usuario
						 * pero que cambiaron su atributo main, se actualiza la base de datos
						 */
						const result = await imageUpdateMain(image.id, image.main);
						if (!result) {
							console.log('no se pudo actualizar la imagen');
						}
					}
				} else {
					/**
					 * Imagenes que no estan en la base de datos
					 */
					imagenes = [...imagenes, image];
				}
			}

			if (imagesToDelete.length > 0) {
				
				/**
				 * Borro las imagenes en la base de datos que no estén en la interfaz de usuario
				 */
				await deleteImageNotInlist(imagesToDelete);
				/**
				 * Borro imagenes de supabase
				 */
				for (let i = 0; i < imagesToDelete.length; i++) {
					if (index[imagesToDelete[i]]) {
						const { error } = await grabar.storage
							.from('products')
							.remove([ `${index[imagesToDelete[i]].public_id}` ]);
						if(error) return
					}
				}
			}
			

			await deleteProductPrice(producto.prices[0].id);

			try {
				await createPrice(form.data.price, product_id, 'main');
			} catch (error) {
				console.log('No se pudo crear el precio');
			}
			/**
			 * Actualizo el producto en la base de datos con los valores que vienen de la interfaz de usuario
			 */
			await updateProductById(
				product_id,
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

			
			/**
			 * Regreso en caso de que no haya imagenes nuevas
			 */
			if(imagenes.length < 1) return {form};

		} else {
			product_id = await createProductFromAdmin(
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

		}

		if (!product_id) return {form};

		if (imagenes.length > 0) {
			tempImages = [...imagenes];
		} else {
			const precio = await createPrice(form.data.price, product_id, 'main');
			if (!precio) return {form};
		}

		let i = 0;
		imagenes = tempImages.map((element: { secure_url: string; main: boolean }) => {
			const name = Date.now();
			i++;
			return {
				file: urlToFIle(element.secure_url),
				product_id,
				secure_url: `https://rxcvntscktadpgjwroxh.supabase.co/storage/v1/object/public/products/${product_id}_${name}${i}.png`,
				file_name: `${product_id}_${name}${i}.png`,
				main: element.main ? true : false
			};
		});

		const imagrabar = imagenes.map(
			(element: { secure_url: string; main: boolean; file_name: string }) => {
				return {
					product_id,
					secure_url: element.secure_url,
					main: element.main,
					public_id: element.file_name
				};
			}
		);
	

		const crear_imagenes = await createProductImages(imagrabar);

		if (!crear_imagenes) return {form};

		//grabamos imagenes en el servidor de imagenes

		imagenes.forEach(async (element: { file: File; file_name: string }) => {
		
			try {
				const { data, error } = await grabar.storage
					.from('products')
					.upload(element.file_name, element.file);
				if (data) {
					console.log('sucess');

				} else {
					console.log('fail', error, data);
				}
			} catch (error) {
				console.log(error);
				console.log('no se pudo subir');
			}
		});
		console.log('actualizo');
		return {form}
	}
};
