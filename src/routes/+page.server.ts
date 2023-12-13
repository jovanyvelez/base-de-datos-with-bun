import { redirect } from '@sveltejs/kit';

export const load = async ({locals}) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	return {
		one: "a",
		two: 2,
		streamed: {
			three: 3
		},
		userId: session.user.userId,
		username: session.user.email
	};
};