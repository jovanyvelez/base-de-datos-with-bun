import { test1, productosPorCategoria } from "$lib/server/db_queries/query_select"

export const load = async ({params})=>{

    console.time('consulta')
    //await productosPorCategoria(params.parametro, 3,1);
    await test1(params.parametro)
    console.timeEnd('consulta')

    return {
        parametro: params.parametro
    }
}