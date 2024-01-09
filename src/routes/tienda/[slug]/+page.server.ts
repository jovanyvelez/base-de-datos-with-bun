
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

	let {products} = productos
	const {cantidad} = productos

	products = products.map(producto => {
		const imageIndexado = producto.images.reduce((ac:{name:string,secure_url:string}, el:{name:string,secure_url:string})=> {
			return {
				...ac,
				[el.name]: el
			}
		}, {})
		return {...producto, img: imageIndexado.main.secure_url}

	})

	return { products, cantidad, query, page: query.page, pages: Math.ceil(cantidad / pageSize)};
}