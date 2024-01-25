
import { todosLosProductos } from '$lib/server/db_queries/query_select.js';

export async function load({ params }) {
	

	const page: number = parseInt(params.slug, 10);

	const pageSize = 12;

	const productos = await todosLosProductos(pageSize, page);

	let {products} = productos
	const {cantidad} = productos

	products = products.map(producto => {
		const imageIndexado = producto.images.reduce((ac, el:{name:string, main?:boolean,secure_url:string})=> {
			if(el.main)	ac = ac+el.secure_url
			return ac
		}, '')

		return {...producto, img: imageIndexado}

	})



	return { products, cantidad, page, pages: Math.ceil(cantidad / pageSize)};
}