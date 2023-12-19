
import { test1 } from '$lib/server/db_queries/query_select.js';

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
	
	
	const {products, cantidad } =  await test1(query.param, pageSize, query.page);



	return { products, cantidad, query, page: query.page, pages: Math.ceil(cantidad / pageSize)};
}