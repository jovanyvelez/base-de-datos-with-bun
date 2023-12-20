
import { productos_por_categoria, products_by_name_query } from '$lib/server/db_queries/query_select.js';

export async function load({ params }) {
	
	type mQuery = {
		param: string;
		page: number;
		por_categoria: boolean
	};

	let query: mQuery;

	try {
		query = JSON.parse(params.slug);
	} catch (error) {
		console.log('error parseando el json');
		query = { param: '', page: 1, por_categoria: false };
	}

	console.log(query);


	const pageSize = 12;

	//consultamos todas las categorias hijas y descendientes de la categoria
	//pasada en el parámetro
	let productos
	if(!query.por_categoria)
	{
		productos = await products_by_name_query(query.param, pageSize, query.page);

	}else{
		productos =  await productos_por_categoria(query.param, pageSize, query.page);
	}


	return { products: productos.products, cantidad: productos.cantidad, query, page: query.page, pages: Math.ceil(productos.cantidad / pageSize)};
}