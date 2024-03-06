import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { ProductStore } from '$lib/types/Interfaces_or_types';
import type { opciones_producto, usuario } from '@prisma/client';
import prisma from '../prisma';

export async function saveOrder(productos: ProductStore[], usuario: usuario) {
	/**
	 * Totalizamos el valor de la orden
	 *
	 */
	const valor = productos.reduce((a, c) => a + c.prices[0].price * c.qtyBuy, 0);

	/**
	 * Grabamos el encabezado de la orden en la base de datos
	 */
	const finalOrder = await prisma.ordenes.create({
		data: {
			user_id: usuario.id,
			direccion_entrega: usuario.address,
			ciudad_ent: usuario.city,
			departamento_ent: usuario.departament,
			cod_vendedor: usuario.asesor,
			valor
		}
	});

	/**
	 * Le ponemos el codigo de la orden a cada item del detalle en el array
	 */

	const orderProducts = productos.map((product) => {
		return {
			product_id: product.id,
			cantidad: product.qtyBuy,
			precio: product.prices[0].price,
			tax: product.tax,
			orden_id: finalOrder.id
		};
	});

	/**
	 * Grabamos el detalle de la orden en la base de datos
	 */

	await prisma.detalle_orden.createMany({
		data: orderProducts
	});

	/**
	 * Actualizamos en inventario final por producto en la tabla productos
	 */
	await Promise.all(
		productos.map(async (element) => {
			await prisma.productos.update({
				where: {
					id: element.id
				},
				data: {
					quantity: element.quantity - element.qtyBuy
				}
			});
		})
	);
	await prisma.$disconnect();
	return finalOrder.id;
}

export async function creatUserFromWeb(usuario: usuario) {
	const asesor = await prisma.usuario.findFirst({
		where: { name: 'Ecommerce' },
		select: { id: true, name: true }
	});
	console.log(asesor);

	if (!asesor) throw new Error('No se encontro el asesor');

	const newUser = await prisma.usuario.create({
		data: {
			name: usuario.name,
			phone: usuario.phone,
			email: usuario.email,
			doc_type: usuario.doc_type,
			num_doc: usuario.num_doc,
			departament: usuario.departament,
			city: usuario.city,
			address: usuario.address,
			bussiness_unit: usuario.bussiness_unit,
			asesor: asesor.id,
			discount: usuario.discount
		}
	});
    let session;
	try {
		const user = await auth.createUser({
			key: {
				providerId: 'email', // auth method
				providerUserId: newUser.email, // unique id when using "username" auth method
				password: newUser.num_doc
			},
			attributes: {
				email: newUser.email
			}
		});

		session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		 // set session cookie
	} catch (e) {
		if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
			console.log("Usuario no existe")
		} else {
			console.log("Hubo un error posiblemente en la creacion en la bd")
		}
	}

	return {newUser, session};
}

export async function createProductFromAdmin ( name:string, 
											   quantity:number, 
											   marca:string,
											   codigo: string,
											   ean_code: string,
											   description: string,
											   descuento: number,
											   tax: number,
											   active: boolean,
											   nuevo: boolean) 
											   {
	const producto = await prisma.productos.create({
		data: {
			name,
			marca,
			codigo,
			ean_code,
			description,
			quantity,
			descuento,
			tax,
			active,
			nuevo
		}
	})

	return producto.id;
}

export async function createProductImages(datos: {product_id :string; secure_url:string, main:boolean, public_id:string}[]){
	console.log('grabando imagenes', datos)
	try {
		await prisma.image.createMany({
			data: datos
		})
		return true
	} catch (error) {
		console.log('error en la grabacion del registro',error)
		return false
	}
}

export async function createCategoryImages(datos: {categoria_id :string; secure_url:string, main:boolean, public_id:string}){
	console.log('grabando imagenes', datos)
	try {
		await prisma.image.create({
			data: datos
		})
		return true
	} catch (error) {
		console.log('error en la grabacion del registro',error)
		return false
	}
}

export async function createPrice(price:number, product_id:string, name:opciones_producto | undefined = "main"){
	const precio = await prisma.price.create({
		data: {
			price,
			product_id,
			name,
		}
	})
	return precio
}