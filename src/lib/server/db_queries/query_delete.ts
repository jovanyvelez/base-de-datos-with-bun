import prisma from '../prisma';

export async function deleteProductImage(id: string) {
	return await prisma.image.delete({
		where: {
			id
		}
	});
}

export async function deleteProductPrice(id: string) {
    return await prisma.price.delete({
        where: {
            id
        }
    });
}