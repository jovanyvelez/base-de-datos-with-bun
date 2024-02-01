import { z } from 'zod';

export const categoriaSchema = z
	.object({
        id: z.string().min(1),
		name: z
		.string({ required_error: 'Se requiere nombre' })
		.min(1, { message: 'Se requiere minimo de 3 caracteres' })
		.max(50, { message: 'Debe usar menos de 50 caracteres' })
		.trim(),
		description: z
		.string({ required_error: 'Se requiere descripcion' })
		.min(5, { message: 'Se requiere minimo de 3 caracteres' })
		.max(500)
		.trim(),
        parent_id: z.string().min(1),
		send_images: z.string().min(20, { message: 'Se requiere almenos una imagen' }).trim(),
	})

	export const crudCategoriaSchema = categoriaSchema.extend({
		id: categoriaSchema.shape.id.optional(),
	})