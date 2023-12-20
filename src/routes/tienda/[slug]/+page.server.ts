
import { productos_por_categoria, products_by_name_query } from '$lib/server/db_queries/query_select.js';

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
	let productos
	if(query.page < 1) 
	{
		query.page = 1;
		productos = await products_by_name_query(query.param, pageSize, query.page);

	}else{
		productos =  await productos_por_categoria(query.param, pageSize, query.page);
	}


	return { products: productos.products, cantidad: productos.cantidad, query, page: query.page, pages: Math.ceil(productos.cantidad / pageSize)};
}