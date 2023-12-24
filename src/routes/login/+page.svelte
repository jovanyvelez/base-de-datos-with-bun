<script lang="ts">
	import {superForm, superValidate} from 'sveltekit-superforms/client'
	export let data;
	const {form, message, enhance, errors} = superForm(data.form, {
		resetForm: true
	});
</script>

<h1 class="text-center mt-5">Ingresa tus datos para continuar</h1>

<div class="px-4 pt-8 flex flex-col w-full place-items-center">

	<form action="?/login" method="post" use:enhance>
		<div>
			<label for="email" class="label">Email</label>
			<input
				id="email"
				name="email"
				type="text"
				placeholder="Ingresa tu Email"
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
				name="password"
				type="password"
				placeholder="Ingresa # de Documento o Password"
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
		<div class="w-full flex justify-center mb-4 ">
			<button type="submit" class="btn btn-sm btn-primary w-full mt-4">Ingresar</button>
		</div>
		<a href="/adm/users" class="text-blue-800">... O registrate</a>
	</form>
</div>
