
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
		const imageIndexado = producto.images.reduce((ac, el:{name:string ,main?:boolean,secure_url:string})=> {
			if(el.main)	ac = ac+el.secure_url
			return ac
		}, '')

		return {...producto, img: imageIndexado}

	})

	return { products, cantidad, query, page: query.page, pages: Math.ceil(cantidad / pageSize)};
}