import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { ProductStore } from '$lib/types/Interfaces_or_types';
import type { usuario } from '@prisma/client';
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
