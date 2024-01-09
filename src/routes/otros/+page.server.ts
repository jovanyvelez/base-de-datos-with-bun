import { productosPorCategoria_usando_sql } from '$lib/server/db_queries/query_select.js';
import { superValidate } from 'sveltekit-superforms/server';



export const load = async () => {
     return {
         test: await productosPorCategoria_usando_sql("f48358e3-6550-4b46-bd9d-5b93fc41adde")
     }
}

export const actions = {
	create: async ({ request }: { request: Request }) => {
		
        const form = await superValidate(request, crudUserSchema);
        console.log(form)
		
	}
}