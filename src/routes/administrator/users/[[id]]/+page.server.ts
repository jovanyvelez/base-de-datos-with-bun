import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { redirect } from '@sveltejs/kit';
import { type Actions, type Action, fail } from '@sveltejs/kit';
import { creatUserFromWeb } from '$lib/server/db_queries/query_create.js';
import { superValidate, message } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/types/zodSchemas/schemas.js';
import { allDepartments, buscarUsuarioBYEmailOrDocument } from '$lib/server/db_queries/query_select.js';

const userCreateSchema = userSchema.extend({
	id: userSchema.shape.id.optional(),
	asesor: userSchema.shape.asesor.optional(),
	role_id: userSchema.shape.role_id.optional()
});

export const load = async ({ locals, params }) => {
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
	const form = await superValidate(usersDb, userCreateSchema);

	//consulta a la bd de los tipos de usuarios para ingreso de nuevo usuario
	//const tipos = await prisma.roles.findMany();

	//Traemos toda la tabla de vendedores para asignación de asesor
	//const vendedores = await prisma.sellers.findMany()

	const departamentos = await allDepartments();

	return {
		form,
		departamentos
	};
};

const register: Action = async ({ request, locals }) => {
	//Traemos todos los datos del formulario web
	const datos = await request.formData();

	//Asignamos los datos enviados a un form de superform
	const form = await superValidate(datos, userCreateSchema);

	//let registro = form.data;

	//Prueba de verificacion de los datos colectados
	

	if (!form.valid) return fail(400, { form });

	const existeUsuario = await buscarUsuarioBYEmailOrDocument(form.data.email, form.data.num_doc);

	if (existeUsuario) {
		form.errors = {
			email: ['El usuario ya existe'], num_doc: ['El usuario ya existe']
		}
		return fail(400, {
			form,
			message: 'El usuario ya existe'
		})
	}

	const { id, ...cliente_a_crear } = form.data;

	cliente_a_crear.asesor = '';
	cliente_a_crear.role_id = 'cliente';

	const {newUser, session} = await creatUserFromWeb(cliente_a_crear);
	if (!newUser || !session) return fail(400, { form });
	
	locals.auth.setSession(session);
	try {
		const key = await auth.useKey('email', newUser.email.toLowerCase(), newUser.num_doc);
		const session = await auth.createSession({
			userId: key.userId,
			attributes: {}
		});
		locals.user = newUser;

		locals.auth.setSession(session); // set session cookie
	} catch (e) {
		if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
			return fail(500, {
				message: 'Usuario ya existe'
			});
		} else {
			return fail(500, {
				message: 'hubo un error'
			});
		}
	}
	throw redirect(303, '/carrito');

	return message(form, 'Usuario creado!');
};

export const actions: Actions = { register };
