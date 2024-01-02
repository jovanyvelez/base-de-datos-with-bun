import { z } from 'zod';

export const productSchema = z
	.object({
        id: z.string().min(1),
		name: z
		.string({ required_error: 'Se requiere nombre' })
		.min(3, { message: 'Se requiere minimo de 3 caracteres' })
		.max(50, { message: 'Debe usar menos de 50 caracteres' })
		.trim(),
        active: z.enum(['on','off']),
		codigo: z
		.string({ required_error: 'Se requiero Codigo' })
		.min(3, { message: 'Se requiere codigo' })
		.max(13)
		.trim(),
		description: z
		.string({ required_error: 'Se requiere descripcion' })
		.min(5, { message: 'Se requiere minimo de 3 caracteres' })
		.max(500)
		.trim(),
        ean_code: z
		.string({ required_error: 'Se requiero Codigo Ean' })
		.min(13, { message: 'Se requiere codigo' })
		.max(13)
		.trim(),
		marca: z
		.string({ required_error: 'Se requiere Marca' })
		.min(3, { message: 'Se requiere minimo de 3 caracteres' })
		.max(100)
		.trim(),
        new: z.enum(['on','off']),
        descuento: z.number().gte(0).lt(100),
		quantity: z
		.number({required_error:'Se requiere cantidad'})
		.nonnegative({message:'No puede ser negativa'}),
		tax: z.number().gte(0).lt(100),
		send_images: z.string()
	})

	export const crudUserSchema = productSchema.extend({
		id: productSchema.shape.id.optional(),
		send_images: productSchema.shape.send_images.optional()	
	})