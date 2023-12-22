import type {  Actions } from './$types';
import { buscarFullUsuario } from '$lib/server/db_queries/query_select';
import { saveOrder } from '$lib/server/db_queries/query_create';
import enviar_correo  from '$lib/server/send_mails/mails'



export async function load() {
    return { };
}


export const actions = {
	compra: async ({request, locals}) => {

			
		const session = await locals.auth.validate();

		if(!session) return { success: false, savedorder: "nada" }

		const data = await request.formData();

		const carrito = JSON.parse(data.get("carrito") as string)
		
		//console.log(locals.user);

		const usuario = await buscarFullUsuario(session.user.email);


		if(!usuario) return { success: false, savedorder: "nada" }

		const idOrder = await saveOrder(carrito, usuario)

		await enviar_correo(usuario.email,'Compra exitosa',`<p>Felicidades tu compra fue exitosa y tu número de orden es <strong>${idOrder}</strong></p>`)

		console.log(idOrder);
		return { success: true, savedorder: idOrder };

	},
}satisfies Actions;