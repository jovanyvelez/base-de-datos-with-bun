import { consultaPrueba, productosPorCategoria } from "$lib/server/db_queries/query_select"

export const load = async ()=>{
    console.time('quer');
    const productos = await productosPorCategoria('c7ffb770-539a-4f43-ba20-7ff2a3c4bc7b')

    console.timeEnd('quer');
    return {
        productos
    }
}