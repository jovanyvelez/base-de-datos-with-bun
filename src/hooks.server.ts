import { buscarUsuario } from '$lib/server/db_queries/query_select';
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	
	// we can pass `event` because we used the SvelteKit middleware

	event.locals.auth = auth.handleRequest(event);
	const session = await event.locals.auth.validate();

	if (session) {
		const email = session.user.email;
		event.locals.user = await buscarUsuario(email) 
	} else {
		event.locals.user = null
	}

	return await resolve(event);
};