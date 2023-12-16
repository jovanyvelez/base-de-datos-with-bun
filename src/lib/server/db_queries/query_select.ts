import prisma from '../prisma';



interface OriginalItem {
	categoria_id: string;
	categoria_name: string;
	product_id: string;
	name: string;
	price_type: string;
	price: number;
	image_type: string;
	secure_url: string;
	row_num: bigint;
  }
  
  interface NewItem {
	categoria_id: string;
	categoria_name: string;
	productos: Omit<OriginalItem, 'categoria_id' | 'categoria_name' | 'row_num'>[];
  }


/**
 * Busca un usuario de acuerdo a email en tabla user
 * @param {string} email
 */

export async function buscarUsuario(email: string) {
	const user = await prisma.usuario.findUnique({
		where: { email },
		select: {
			id: true,
			role_id: true,
			name: true
		}
	});
	if(!user) return null
	const usuario = {id: user.id, role_id: user.role_id as string, name: user.name}
	return usuario;
}


export async function productosPorCategoria(categoriaConsulta: string) {
	const productos = await prisma.$queryRaw`
	SELECT productos.id, productos.name, price.name as price_type, price.price, image.name as image_type, image.secure_url
	FROM productos
	JOIN price ON productos.id = price.product_id
	JOIN image on productos.id = image.product_id
	WHERE productos."categoria_id" IN (
		SELECT categorias.id
		FROM categoriasclosure
		JOIN categorias ON categoriasclosure.hijo = categorias.id
		WHERE (categoriasclosure.root = ${categoriaConsulta} or 
				categoriasclosure.padre = ${categoriaConsulta} or 
				categoriasclosure.hijo = ${categoriaConsulta})
	)
	ORDER BY random()
	LIMIT 4
`;
	prisma.$disconnect();
	return productos;
}


export async function mainCategories() {
	const categorias: {id:string, name: string}[] = await prisma.$queryRaw`
		SELECT categorias.id as id, categorias.name as name
		FROM categoriasclosure
		JOIN categorias ON categoriasclosure.hijo = categorias.id
		WHERE (categoriasclosure.root = categoriasclosure.padre and 
				categoriasclosure.padre = categoriasclosure.hijo )
	`;

	return categorias
}

export async function categoriasPrincipales() {
	console.time('query');
	const productos = await prisma.$queryRaw`
	SELECT categorias.name as categoria, categorias.id , productos.id as product_id, productos.name, price.name as price_type, price.price, image.name as image_type, image.secure_url
	FROM productos
	JOIN price ON productos.id = price.product_id
	JOIN image on productos.id = image.product_id
	JOIN categorias on productos."categoria_id" = categorias.id
	WHERE productos."categoria_id" IN (
		SELECT categorias.id
		FROM categoriasclosure
		JOIN categorias ON categoriasclosure.hijo = categorias.id
		WHERE (categoriasclosure.root = categoriasclosure.padre and 
				categoriasclosure.padre = categoriasclosure.hijo )
	)
	ORDER BY random()
	LIMIT 4
`;
	console.log('categorias ppales');
	console.timeEnd('query');
	prisma.$disconnect();
	return productos;
}



export async function productosAleatorios() {
	
	const productos: OriginalItem[] = await prisma.$queryRaw`
	SELECT *
FROM (
    SELECT
        categorias.id as categoria_id,
        categorias.name as categoria_name,
        productos.id,
		productos.codigo  as product_id,
        productos.name,
        price.name as price_type,
        price.price,
        image.name as image_type,
        image.secure_url,
        ROW_NUMBER() OVER (PARTITION BY categorias.id ORDER BY random()) as row_num
    FROM productos
    JOIN price ON productos.id = price.product_id
    JOIN image ON productos.id = image.product_id
    JOIN categorias ON productos."categoria_id" = categorias.id
    WHERE productos."categoria_id" IN (
        SELECT categorias.id
        FROM categoriasclosure
        JOIN categorias ON categoriasclosure.hijo = categorias.id
        WHERE (categoriasclosure.root = categoriasclosure.padre and 
                categoriasclosure.padre = categoriasclosure.hijo)
        ORDER BY random()
    )
) AS subquery
WHERE row_num <= 4

`;

const resultadoObjeto = organizarProductosPorCategoria(productos);

return  resultadoObjeto ;
}



function organizarProductosPorCategoria(arr: OriginalItem[]): NewItem[] {
	const categorias: { [key: string]: NewItem } = {};
  
	arr.forEach((item: OriginalItem) => {
	  const { categoria_id, categoria_name, row_num, ...productoInfo } = item;
	  if (!categorias[categoria_id]) {
		categorias[categoria_id] = { categoria_id, categoria_name, productos: [] };
	  }
	  categorias[categoria_id].productos.push(productoInfo);
	});
  
	return Object.values(categorias);
  }