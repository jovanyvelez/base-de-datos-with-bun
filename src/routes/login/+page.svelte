<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { z } from 'zod';
	export let data;
	/*const {form, message, enhance, errors} = superForm(data.form, {
		resetForm: true,
		validators: userSchema
	});*/

	const userSchema = z.object({
		texto: z.string().optional(),
		email: z.string().email(),
		password: z.string().min(2)
	});

	const { form, errors, enhance, delayed, message, reset, constraints } = superForm(data.form, {
		resetForm: true,
		validators: userSchema
	});
</script>

<h1 class="text-center mt-5">Ingresa tus datos para continuar</h1>

<div class="px-4 pt-8 flex flex-col w-full place-items-center">
	<form action="?/login" method="post">
		<div>
			<label for="email" class="label">Email</label>
			<input
				id="email"
				name="email"
				type="text"
				placeholder="Ingresa tu Email"
				{...$constraints.email}
				bind:value={$form.email}
				class="input input-md input-primary input-bordered rounded-md w-full max-w-xs"
			/>
		</div>
		{#if $errors.email}
			<small class="text-error">{$errors.email}</small>
		{/if}

		<div>
			<label for="password" class="label">Tu Documento o Password</label>
			<input
				id="password"
				name="password"{...$constraints.name}
				type="password"
				placeholder="Ingresa # de Documento o Password"
				{...$constraints.password}
				bind:value={$form.password}
				class="input input-primary input-bordered w-full max-w-xs"
			/>
		</div>
		{#if $errors.password}
			<small class="text-error">{$errors.password}</small>
		{/if}
		{#if $form.texto}
			<small class="text-error">{$form.texto}</small>
		{/if}
		<div class="w-full flex justify-center mb-4">
			<button type="submit" class="btn btn-sm btn-primary w-full mt-4">Ingresar</button>
		</div>
		<a href="/adm/users" class="text-blue-800">... O registrate</a>
	</form>
</div>


<pre>{JSON.stringify($errors,null,2)}</pre>