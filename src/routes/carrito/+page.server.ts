//import type {  Actions } from './$types';
//import { buscarFullUsuario } from '$lib/server/queryStart';
//import { saveOrder } from '$lib/server/queryUpdates';

export async function load() {
    return { };
}

/*
export const actions = {
	compra: async ({request, locals}) => {
		
		const session = await locals.auth.validate();
		if(!session)  return { success: false, savedorder: "nada" };
		const usuario = await buscarFullUsuario(session.user.username)
		const data = await request.formData();
		const carrito = JSON.parse(data.get("carrito") as string)
		//const idOrder = await saveOrder(carrito, usuario)
		return { success: true, savedorder: idOrder };

	},
}satisfies Actions;*/