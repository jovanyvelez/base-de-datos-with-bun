
import { productosPorCategoria } from '$lib/server/db_queries/query_select.js';

export async function load({ params }) {
	
	type mQuery = {
		param: string;
		page: number;
	};

	let query: mQuery;
	try {
		query = JSON.parse(params.slug);
	} catch (error) {
		query = { param: params.slug, page: 1 };
	}

	const pageSize = 12;

	//consultamos todas las categorias hijas y descendientes de la categoria
	//pasada en el parámetro
	
	
	const {productos, cantidad } =  await productosPorCategoria(query.param);


	return { productos,cantidad, query, page: query.page, pages: Math.ceil(cantidad / pageSize)};
}