import { env } from '$env/dynamic/private';
import { transporter } from '$lib/server/utils/nodemailer.js';
import { htmlTable } from '$lib/server/utils/htmlMail.js';
import { redirect } from '@sveltejs/kit';
import { buscarFullUsuario, foundOrderByCode } from '$lib/server/db_queries/query_select.js';


export async function load({ params, locals }) {

	const session = await locals.auth.validate();
	if(!session) redirect(302,'/login');
	
	const cliente = await buscarFullUsuario(session.user.username)

	//Hay que terminar esta instruccion
	if(!cliente) redirect(302,'/');

	let cliente_id;
	cliente !==  null && cliente.id !== null ? cliente_id = cliente.id : cliente_id = "no id"	
	
	const order = await foundOrderByCode(params.orden, cliente_id)
	
	//Hay que terminar esta instruccion
	if(!order) redirect(302,'/');

	//detalle is a function that grab the html to send in the email body

	const detalle = htmlTable(JSON.stringify(order,null,2))

	//transporter.sendMail in return object, for show quick the final order to the user
		return {
			order, envio: await transporter.sendMail({
				from: `"Zendent" ${env.NODE_MAILER_USER}`, // email address sender
				to: [`${cliente?.email}`, `${cliente?.asesor}`], // Email, client and seller
				subject: `Numero de orden de compra: ${order?.id}`, // Order number in a subject
				//text: `${JSON.stringify(orden,null,2)}`, // plain text body
				html: detalle, // html body
			}) 
		}
}



