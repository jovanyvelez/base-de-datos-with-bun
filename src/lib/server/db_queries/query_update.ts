import prisma from '../prisma';

export async function deleteProductImage(id: string) {
	return await prisma.image.delete({
		where: {
			id
		}
	});
}

export async function updateProductById(
	id: string,
	name: string,
	quantity: number,
	marca: string,
	codigo: string,
	ean_code: string,
	description: string,
	descuento: number,
	tax: number,
	active: boolean,
	nuevo: boolean
) {
	const producto = await prisma.productos.update({
        where: {
            id
        },
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
	});

	return producto.id;
}

export async function imageUpdateMain(id:string, main:boolean) {
	return await prisma.image.update({
		where: {
			id
		},
		data: {
			main
		}
	});
}

export async function deleteImageNotInlist(eliminarNoExistentes:string[]) {
	try {
		await prisma.image.deleteMany({
			where: {
				id: {in:eliminarNoExistentes}
			}
		})
	} catch (error) {
		console.log('no se pudo borrar las imagenes', error)
	}
}