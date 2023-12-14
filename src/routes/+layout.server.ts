import { mainCategories } from '$lib/server/db_queries/query_select.js';

export const load = async ({ locals }) => {

	const categorias = await mainCategories()
	const session = await locals.auth.validate();

	let user = null;
	let usertype = null;

	if (session) user = locals.user?.name;

	usertype = locals.user?.role_id;


	//console.log(usertype);
	return { categorias, usuario: user, usertype };
};
