import { crudUserSchema } from '$lib/types/zodSchemas/productSchema.js';
import { superValidate } from 'sveltekit-superforms/server';



export const load = async () => {
    const form = await superValidate(crudUserSchema);
    return {form}
}

export const actions = {
	create: async ({ request }: { request: Request }) => {
		
        const form = await superValidate(request, crudUserSchema);
        console.log(form)
		
	}
}