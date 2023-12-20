import { test1, productosPorCategoria } from "$lib/server/db_queries/query_select"

export const load = async ({params})=>{

  

    return {
        parametro: params.parametro
    }
}