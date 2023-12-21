import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia.js';



export const load = async ( {locals} ) => {
	
	const session = await locals.auth.validate();
	if (!session) redirect(302,'/');
	await auth.invalidateSession(session.sessionId); // invalidate session
	locals.auth.setSession(null); // remove cookie
	locals.user = null;
	throw redirect(302,"/");
	return {}
}
