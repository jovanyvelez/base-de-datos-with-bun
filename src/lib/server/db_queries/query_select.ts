import prisma from '../prisma';
import type { Product, NewItem, OriginalItem } from '$lib/types/Interfaces_or_types';



/**
 * Busca un usuario de acuerdo a email en tabla user
 * @param {string} email
 */

export async function buscarFullUsuario(email: string) {
	const user = await prisma.usuario.findUnique({
		where: { email }
	});

	return user;
}

export async function buscarUsuario(email: string) {
	const user = await prisma.usuario.findUnique({
		where: { email },
		select: {
			id: true,
			role_id: true,
			name: true
		}
	});
	if (!user) return null;
	const usuario = { id: user.id, role_id: user.role_id as string, name: user.name };
	return usuario;
}

export async function buscarUsuarioBYEmailOrDocument(email: string, document: string) {
	const user = await prisma.usuario.findFirst({
		where: {
			OR: [{ email }, { num_doc: document }]
		},
		select: {
			id: true,
			role_id: true,
			name: true
		}
	});
	if (!user) return null;
	const usuario = { id: user.id, role_id: user.role_id as string, name: user.name };
	return usuario;
}

export async function buscarUsuarioByEmailAndDocument(email: string, document: string) {
	const user = await prisma.usuario.findFirst({
		where: {
			AND: [{ email }, { num_doc: document }]
		},
		select: {
			id: true,
			role_id: true,
			name: true
		}
	});
	if (!user) return null;
	const usuario = { id: user.id, role_id: user.role_id as string, name: user.name };
	return usuario;
}

export async function allDepartments() {
	let departamentos: { departamento: string; codigo: string }[] = [];
	try {
		departamentos = await prisma.departamentos.findMany({
			select: {
				departamento: true,
				codigo: true
			},
			orderBy: {
				departamento: 'asc'
			}
		});
	} catch (error) {
		console.error('Error al obtener los departamentos:', error);
	} finally {
		await prisma.$disconnect();
	}
	return departamentos;
}

export async function foundOrderByCode(order: string, id: string) {
	const orden = await prisma.ordenes.findUnique({
		where: { id: order, user_id: id },

		select: {
			id: true,
			created_at: true,
			direccion_entrega: true,
			ciudad_ent: true,
			departamento_ent: true,
			valor: true,
			usuario: {
				select: {
					name: true,
					phone: true,
					email: true,
					doc_type: true,
					num_doc: true,
					asesor: true,
					discount: true
				}
			},
			detalle: {
				select: {
					product: {
						select: {
							codigo: true,
							name: true,
							tax: true
						}
					},
					cantidad: true,
					precio: true
				}
			}
		}
	});
	prisma.$disconnect();
	console.log(JSON.stringify(orden, null, 2));
	return orden;
}

export const products_by_name_query = async (
	searchTerm: string,
	pageSize: number,
	queryPage: number
) => {
	const products: Product[] = await prisma.productos.findMany({
		where: {
			OR: [
				{ name: { contains: searchTerm, mode: 'insensitive' } },
				{ codigo: { contains: searchTerm, mode: 'insensitive' } }
				//{ description: { contains: searchTerm, mode: 'insensitive' } }
			]
		},
		take: pageSize, // LIMIT
		skip: pageSize * (queryPage - 1), // OFFSET
		select: {
			id: true,
			name: true,
			quantity: true,
			description: true,
			codigo: true,
			ean_code: true,
			tax: true,
			prices: {
				select: {
					name: true,
					price: true
				}
			},
			images: {
				select: {
					main: true,
					secure_url: true
				}
			}
		}
	});

	const cantidad = await prisma.productos.count({
		where: {
			OR: [
				{ name: { contains: searchTerm, mode: 'insensitive' } },
				{ codigo: { contains: searchTerm, mode: 'insensitive' } }
				//{ description: { contains: searchTerm, mode: 'insensitive' } }
			]
		}
	});

	prisma.$disconnect();

	return { products, cantidad };
};

export const product_by_id = async (id: string) => {
	const product = await prisma.productos.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			active: true,
			codigo: true,
			description: true,
			ean_code: true,
			marca: true,
			nuevo: true,
			descuento: true,
			quantity: true,
			tax: true,
			prices: {
				select: {
					name: true,
					price: true
				}
			},
			images: {
				select: {
					id:true,
					main: true,
					secure_url: true
				}
			}	
		}	
	});
	return product;
}

export async function productosPorCategoria_usando_sql(
	categoriaConsulta: string,
	pageSize: number,
	queryPage: number
) {
	const productos: Product[] = await prisma.$queryRaw`
	SELECT 
		productos.id, 
    	productos.name,
		productos.quantity,
		productos.description,
		productos.codigo,
		productos.ean_code,
		productos.tax,
		price.name as price_type, 
		price.price, 
		image.name as image_type, 
		image.secure_url
	FROM productos
	JOIN price ON productos.id = price.product_id
	JOIN image on productos.id = image.product_id
	JOIN productos_categorias ON productos.id = productos_categorias.product_id
	WHERE productos_categorias.category_id = ${categoriaConsulta}
	LIMIT ${pageSize} OFFSET ${pageSize * (queryPage - 1)}

`;

	const total: { count: bigint }[] = await prisma.$queryRaw`
	SELECT COUNT(*)
FROM (
    SELECT productos.id
    FROM productos
    JOIN price ON productos.id = price.product_id
    JOIN image ON productos.id = image.product_id
    JOIN productos_categorias ON productos.id = productos_categorias.product_id
    WHERE productos_categorias.category_id = ${categoriaConsulta}
) AS selected_products;
`;

	const cantidad = Number(total[0]['count']);

	await prisma.$disconnect();
	return { productos, cantidad };
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

	return resultadoObjeto;
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

export async function productos_por_categoria(
	categoriaConsulta: string,
	pageSize: number,
	queryPage: number
) {
	const products: Product[] = await prisma.productos.findMany({
		where: {
			categorias: {
				some: {
					category: {
						id: categoriaConsulta
					}
				}
			}
		},
		take: pageSize, // LIMIT
		skip: pageSize * (queryPage - 1), // OFFSET
		select: {
			id: true,
			name: true,
			quantity: true,
			description: true,
			codigo: true,
			ean_code: true,
			tax: true,
			prices: {
				select: {
					name: true,
					price: true
				}
			},
			images: {
				select: {
					main: true,
					secure_url: true
				}
			}
		}
	});

	const cantidad = await prisma.productos.count({
		where: {
			categorias: {
				some: {
					category: {
						id: categoriaConsulta
					}
				}
			}
		}
	});

	return { products, cantidad };
}

export async function mainCategories() {
	const categorias: { id: string; name: string }[] = await prisma.categorias.findMany({
		where: {
			parent_id: null
		},
		select: {
			id: true,
			name: true
		}
	});

	return categorias;
}

export async function categoriasPrincipales() {
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
	prisma.$disconnect();
	return productos;
}
