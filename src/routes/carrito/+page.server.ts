import type {  Actions } from './$types';
import { buscarFullUsuario } from '$lib/server/db_queries/query_select';
import { saveOrder } from '$lib/server/db_queries/query_create';


export async function load() {
    return { };
}


export const actions = {
	compra: async ({request, locals}) => {

		console.log("Entra en la accion de compra");
		
		const session = await locals.auth.validate();

		if(!session)  return { success: false, savedorder: "nada" };

		const data = await request.formData();

		const carrito = JSON.parse(data.get("carrito") as string)
		
		//console.log(locals.user);

		const usuario = await buscarFullUsuario(session.user.email);


		if(!usuario) return { success: false, savedorder: "nada" };

		const idOrder = await saveOrder(carrito, usuario)

		return { success: true, savedorder: idOrder };

	},
}satisfies Actions;