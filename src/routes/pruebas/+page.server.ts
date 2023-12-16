import { productosPorCategoria } from "$lib/server/db_queries/query_select"

export const load = async ()=>{

    const {productos, cantidad} = await productosPorCategoria('c7ffb770-539a-4f43-ba20-7ff2a3c4bc7b')
    return {
        productos, cantidad
    }
}