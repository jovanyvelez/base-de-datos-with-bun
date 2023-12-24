import  prisma  from '$lib/server/prisma';

interface citiesDepartment{
	ciudades: {
        ciudad: string;
    }[];
}

export const GET = async ({ url }: { url: URL }): Promise<Response> => {

	const departament:string = String(url.searchParams.get('departamento')).trim();
	let departamento:citiesDepartment|null|undefined;
	try {
		departamento = await prisma.departamentos.findFirst({
			where:{departamento:departament},
			select:{ciudades:{
				select:{
					ciudad:true,
					codigo:true
				}
			}}	
		});
	} catch (error) {
		console.error('Error al obtener los departamentos:', error);
	} finally {
		await prisma.$disconnect();
	}
	
	return new Response(JSON.stringify(departamento?.ciudades), { status: 201 });
};
