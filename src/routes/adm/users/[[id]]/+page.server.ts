import { type Actions, type Action, fail } from '@sveltejs/kit';

import { superValidate, message } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/types/zodSchemas/schemas.js';
import { allDepartments } from '$lib/server/db_queries/query_select.js';

const userCreateSchema = userSchema.extend({
	id: userSchema.shape.id.optional()
})


export const load = async ({locals, params}) => {

	
	const usersDb = null;
/* Mirar este bloque lueto!!	
	//Usuario traido del inicio de seccion
	const user =   locals.user;
	if(!user) throw redirect(303, '/'); 	

	let id_user;
	if(params.id){
		try {
			usersDb = await prisma.usuario.findUnique({
				where:{id: id_user}
			});
			if(!usersDb) throw error(404);
		} catch (error) {
			console.error('Error!, no se encontró el usuario', error);
		} finally {
			await prisma.$disconnect();
		}
	}
*/
	//form con los tipos de datos
	const form = await superValidate(usersDb,userCreateSchema);

	//consulta a la bd de los tipos de usuarios para ingreso de nuevo usuario
	//const tipos = await prisma.roles.findMany();

	//Traemos toda la tabla de vendedores para asignación de asesor
	//const vendedores = await prisma.sellers.findMany()
	
	const departamentos = await allDepartments();
	
	return {
		form, departamentos
	};
};


const register: Action = async ({ request }) => {
	
	//Traemos todos los datos del formulario web
	const datos = await request.formData();

	//Asignamos los datos enviados a un form de superform
	const form = await superValidate(datos, userCreateSchema);

	//let registro = form.data;

	//Prueba de verificacion de los datos colectados
	//console.log(form.data);
	if(!form.valid) return fail(400, {form})
	
	/*const vendedor = await prisma.sellers.findFirst({
		*/
	
	//Agregamos los datos del código del vendedor
	//registro = {...registro, codVendedor: vendedor.code}
	
	//compruebo que todo esté OK
	//console.log(registro)
	//return message(form, 'Usuario creado!');
	/*
	try {
			await prisma.usuario.create({
			data: {roleId: form.data.roleId,
					name: form.data.name,
					phone: form.data.phone,
					email: form.data.email,
					docType: form.data.docType,
					numDoc: form.data.numDoc,
					Departament: form.data.Departament,
					city: form.data.city,
					address: form.data.address,
					bussinessUnit: form.data.bussinessUnit,
					discount:form.data.discount,
					zoneid: form.data.zoneid,
					asesor:form.data.asesor,
					codVendedor: form.data.codVendedor
				}

		})
	} catch (error) {
		console.log("No se grabó el usuario")
		return fail(400, {form});
	}
*/

	return message(form, 'Usuario creado!');

/*
	try {
		const user = await auth.createUser({
			primaryKey: {
				providerId: 'username',
				providerUserId: form.data.email,
				password: form.data.password
			},
			attributes: {
				email: form.data.email
			}
		});
		const session = await auth.createSession(user.userId);
		locals.auth.setSession(session);
		console.log("usuario creado")
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002' &&
			error.message?.includes('username')
		) {
			return fail(400, {
				message: 'Username already in use'
			});
		}
		if (error instanceof LuciaError && error.message === 'AUTH_DUPLICATE_KEY_ID') {
			return fail(400, {
				message: 'Username already in use'
			});
		}
		console.error(error);
		return fail(500, {
			message: 'Unknown error occurred'
		});
	}*/

};

export const actions: Actions = { register };
