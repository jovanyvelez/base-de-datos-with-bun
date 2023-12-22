import { MAIL_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

const resend = new Resend(MAIL_API_KEY);


export default async function sendEmails(to:string, subject:string, html:string) {
    
    try {
        const data = await resend.emails.send({
            from: 'tienes un nuevo pedido <ecommerce@jovany.com.co>',
            to,
            subject,
            html
        });
        console.log(data);
        return data
    }catch (error) {
        console.error(error);
        return "No se pudo enviar el correo"
    }

}

