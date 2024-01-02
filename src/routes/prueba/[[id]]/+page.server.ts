import { crudUserSchema } from '$lib/types/zodSchemas/productSchema.js';
import { superValidate } from 'sveltekit-superforms/server';
import { grabar } from '$lib/supabaseClient';

const urlToFIle = (url: string) => {
    const arr = url.split(',');
    const mime: string | null = arr[0].match(/:(.*?);/)?.[1] || null;

    const data = arr[1];
    const dataStr = atob(data);
    let n = dataStr.length;
    const dataArr = new Uint8Array(n);
    while (n--) {
        dataArr[n] = dataStr.charCodeAt(n);
    }

    //let file = new File([dataArr], 'File.jpg', {type: mime})
    const file = new File([dataArr], 'File.jpg', { type: mime as string | undefined });

    return file;
};

export const load = async ({params}) => {
    const form = await superValidate(crudUserSchema);
    return {form}
}

export const actions = {
	create: async ({ request }: { request: Request }) => {
		
        const form = await superValidate(request, crudUserSchema);
        //console.log(form)
        const temp  = form.data.send_images ? form.data?.send_images : ''
        const temp1 = JSON.parse(temp)
        const temp2 = urlToFIle(temp1.files[0]) 
        console.log(temp2)
        try {
            await grabar.storage.from('products').upload(`product_${Date.now()}.png`, temp2)
            console.log('subido');
        } catch (error) {
            console.log(error)
            console.log('no se pudo subir');
        }
		
	}
}