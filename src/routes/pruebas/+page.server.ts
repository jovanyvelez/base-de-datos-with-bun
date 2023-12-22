import enviar_correo  from '$lib/server/send_mails/mails'

export const load = async () => {
    const envio = enviar_correo('jovany.velez@gmail.com','Compra exitosa','<h3>Prueba de envio</h3>')
    return {envio}
}