import { consultaPrueba, productosPorCategoria } from "$lib/server/db_queries/query_select"

export const load = async ()=>{
    console.time('quer');
    const productos = await consultaPrueba('d1eefb93-05f4-45f0-b72b-47ad6a256c0b')

    console.timeEnd('quer');
    return {
        productos
    }
}