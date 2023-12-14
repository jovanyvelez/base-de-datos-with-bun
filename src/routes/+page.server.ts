import { productosAleatorios } from "$lib/server/db_queries/query_select";



export const load = async () => {


	return {

		datos: await productosAleatorios()
	
	};
};