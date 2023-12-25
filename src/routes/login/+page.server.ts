import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { buscarUsuario } from '$lib/server/db_queries/query_select';

const userSchema = z.object({
	texto: z.string().optional(),
	email: z.string().email(),
	password: z.string().min(2)
});

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) redirect(302, '/');

	const form = await superValidate(userSchema);
	return { form };
};

const login: Action = async ({ request, locals }) => {
	const form = await superValidate(request, userSchema);

	if (!form.valid) return fail(400, { form });
	//console.log(form.data);

	const usuario = await buscarUsuario(form.data.email);

	try {
		// find user by key
		// and validate password
		const key = await auth.useKey('email', form.data.email.toLowerCase(), form.data.password);
		const session = await auth.createSession({
			userId: key.userId,
			attributes: {}
		});

		locals.user = usuario;

		locals.auth.setSession(session); // set session cookie
	} catch (e) {
		if (
			e instanceof LuciaError &&
			(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
		) {
			// user does not exist
			// or invalid password
			form.errors = {
				email: ['Usuario no encontrado'],
				password: ['Usuario no encontrado']
			};
			return fail(400, {
				form
			});
		}
		return fail(500, {
			message: 'An unknown error occurred'
		});
	}

	const busqueda = locals.user?.role_id ? locals.user?.role_id : 'admin';

	if (busqueda === 'cliente') {
		throw redirect(302, '/carrito');
	} else if (usuario?.role_id && usuario.role_id === 'admin') {
		redirect(302, '/administrator');
	}

	form.data.texto = 'email o contraseña incorrecto';
	console.log(locals.user);
	return fail(400, { form });
};

export const actions: Actions = { login };
