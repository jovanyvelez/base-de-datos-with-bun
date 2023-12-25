import { z } from 'zod';

export const userSchema = z
	.object({
		id: z.string(),
		name: z.string({required_error:"Se requiere nombre de usuario"})
			.min(5,{message:"Nombre requiere mas de cinco caracteres"}).trim(),
		email: z.string().email().min(5),
		phone: z.string().regex(/^((3\d{9})|(60\d{8}))$/, 'Número telefónico no es de Colombia'),
		doc_type: z.enum(['cedula', 'cedula_de_extranjeria', 'nit', 'pasaporte']),
		num_doc: z.string({required_error:"Min 8, max 12 caracteres"}).min(8).max(12).trim(),
		address: z.string({required_error:"No escribió direccion"})
			.min(10,{message:"Debe temer mas de 10 caracteres"}).trim(),
		departament: z.string({required_error:"Se requiere nombre de Departamento"})
			.min(4,{message:"Nombre requiere mas de tres caracteres"}).trim(),
		city: z.string({required_error:"Se requiere nombre de Ciudad"})
			.min(3,{message:"Nombre requiere mas de dos caracteres"}).trim(),
		bussiness_unit: z.string({required_error:"Se requiere ccosto"})
			.max(2,{message:"No puede ser mas de 2 caracteres"}).trim().default('6'),
		zone_id: z.number().int(),
		discount: z.number().nonnegative(),
		asesor: z.string().email().min(5),
		role_id: z.enum(["admin","asesor","cliente","operador"]),
		codVendedor: z.string().max(2),
	});

	export const createUserSchema = z
	.object({
		name: z.string({required_error:"Se requiere nombre de usuario"})
		.min(5,{message:"Nombre requiere mas de cinco caracteres"}).trim(),
		email: z.string().email().min(5),
		telefono: z.string().regex(/^((3\d{9})|(60\d{8}))$/, 'Número telefónico no es de Colombia'),
		tipo: z.enum(['CC', 'CA', 'PA', 'NIT']),
		document: z.string().regex(/^[0-9]{4,}$/i, 'Requeriod solo numeros y mínimo 4 caracteres'),
		documentConfirm: z
			.string()
			.regex(/^[0-9]{4,}$/i, 'Requeriod solo numeros y mínimo 4 caracteres'),
		password: z.string().min(4).trim().regex(/^(?=.*[a-zA-Z])(?=.*\d).*$/, 'debe terner al menos un numero y una letra'),
		passwordConfirm: z.string().min(4).trim()
	})	

	export const authSchema = z
	.object({
		email: z.string().email().min(5),
		password: z.string().min(4).trim().regex(/^(?=.*[a-zA-Z])(?=.*\d).*$/, 'debe terner al menos un numero y una letra'),
	})
	

	export const userCreateSchema = userSchema.extend({
		id: userSchema.shape.id.optional()
	})