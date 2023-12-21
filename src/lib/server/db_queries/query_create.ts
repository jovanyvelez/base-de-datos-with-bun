
import type { ProductStore } from '$lib/interfaces/Interfaces_or_types';
import type { usuario } from '@prisma/client';
import prisma from '../prisma';

  
export async function saveOrder(productos:ProductStore[], usuario: usuario){

    /**
     * Totalizamos el valor de la orden
     * 
     */
    const valor = productos.reduce( (a,c)=> a + (c.prices[0].price*c.qtyBuy),0);

    /**
     * Grabamos el encabezado de la orden en la base de datos
     */
    const finalOrder = await prisma.ordenes.create({
        data: {
            user_id: usuario.id,
            direccion_entrega: usuario.address,
            ciudad_ent: usuario.city,
            departamento_ent: usuario.departament,
            cod_vendedor: usuario.asesor,
            valor,
        }
    });

    /**
     * Le ponemos el codigo de la orden a cada item del detalle en el array
     */

    const orderProducts = productos.map(product => {
        return {
                product_id: product.id, 
                cantidad:product.qtyBuy, 
                precio: product.prices[0].price,
                tax: product.tax,
                orden_id: finalOrder.id,
            }
    })

    /**
     * Grabamos el detalle de la orden en la base de datos
     */

    await prisma.detalle_orden.createMany({
        data: orderProducts
    });

    /**
     * Actualizamos en inventario final por producto en la tabla productos
     */
    await Promise.all(
        productos.map(async (element) => {
            await prisma.productos.update({
                where: {
                    id: element.id
                },
                data: {
                    quantity : element.quantity - element.qtyBuy
                }
            });
        })
        );

	return finalOrder.id;
}