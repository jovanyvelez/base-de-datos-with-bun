import {allCategories} from '$lib/server/db_queries/query_select';

export const load =  async()=>{
    const categories = await allCategories();
    console.log(categories)
    return {
        categories
    }
}