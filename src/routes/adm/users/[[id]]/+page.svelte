<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { userSchema } from '$lib/types/zodSchemas/schemas.js';

	export let data;
	const { departamentos } = data;


	const userCreateSchema = userSchema.extend({
		id: userSchema.shape.id.optional(),
		asesor: userSchema.shape.asesor.optional(),
		role_id: userSchema.shape.role_id.optional(),
	});

	type Municipio = {
		ciudad: string;
		codigo: string;
	};

	type Vendedor = {
		code: string;
		email: string;
		id: number;
	};

	let vendedor: Vendedor | undefined = undefined;

	let municipios: Array<Municipio> = [];

	const { form, errors, enhance, delayed, message, reset, constraints } = superForm(data.form, {
		resetForm: true,
		validators: userCreateSchema
	});


	async function handleSubmit() {
		const response = await fetch(`/api/ciudad?departamento=${$form.departament}`);
		const data = await response.json();
		municipios = data;
	}
</script>

<h1 class="text-xl sm:text-3xl text-center  my-4">Datos de facturacion</h1>
{#if $message}
	<h3 class=" text-center text-xl text-red-500">{$message}</h3>
{/if}
<form action="?/register" method="post">
	<input type="hidden" name="id" bind:value={$form.id} />
	<div class="flex flex-wrap flex-col sm:w-8/12 sm:p-10 mx-3 sm:mx-auto">
			<input
				id="name"
				name="name"
				type="text"
				placeholder="Nombre y apellidos o Razon Social"
				data-invalid={$errors.name}
				bind:value={$form.name}
				{...$constraints.name}
				class="input w-full mb-4 {$errors?.name
					? 'input-error'
					: 'input-bordered'} rounded-xl "
			/>
	
			{#if $errors.name}
				<small class="text-error">{$errors.name}</small>
			{/if}

		<div>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="Correo Electrónico"
				data-invalid={$errors.email}
				bind:value={$form.email}
				{...$constraints.email}
				class="input w-full {$errors?.email
					? 'input-error'
					: 'input-bordered'}   rounded-md"
			/>
		</div>

		{#if $errors.email}
			<small class="text-error">{$errors.email}</small>
		{/if}

		<div>
			<input
				id="telefono"
				name="phone"
				type="text"
				placeholder="Tefono de contacto"
				data-invalid={$errors.phone}
				bind:value={$form.phone}
				{...$constraints.phone}
				class="input mt-4  w-full {$errors?.phone
					? 'input-error'
					: 'input-bordered'}  input-bordered  rounded-xl"
			/>
		</div>
		<!--Hasta aqui todo ok-->
		{#if $errors.phone}
			<small class="text-error">{$errors.phone}</small>
		{/if}

		<div id="tipo" class=" flex flex-col sm:flex-row justify-center items-center p-2 px-2 border border-slate-300 rounded-lg ">
			<select
				name="doc_type"
				bind:value={$form.doc_type}
				data-invalid={$errors.doc_type}
				class="select select-bordered select-xs mr-2 mb-3"
			>
				<option disabled>tipo</option>
				<option value="cedula">cedula</option>
				<option value="cedula_de_extranjeria">cedula_de_extranjeria</option>
				<option value="nit">nit</option>
				<option value="pasaporte">pasaporte</option>
			</select>

			<input
				type="text"
				name="num_doc"
				bind:value={$form.num_doc}
				{...$constraints.num_doc}
				data-invalid={$errors.num_doc}
				class="input w-8/12 {$errors?.num_doc ? 'input-error' : 'input-bordered'}"
				placeholder="Numero de identificación"
			/>
		</div>
		{#if $errors.num_doc}
			<small class="text-error">{$errors.num_doc}</small>
		{/if}
		{#if $errors.doc_type}
			<small class="text-error">{$errors.doc_type}</small>
		{/if}

		<div>
			<input
				id="direccion"
				name="address"
				type="text"
				placeholder="Escriba direccion"
				data-invalid={$errors.address}
				bind:value={$form.address}
				{...$constraints.address}
				class="input {$errors?.address
					? 'input-error'
					: 'input-bordered'} input-sm rounded-md w-full max-w-xs mt-4"
			/>
		</div>
		{#if $errors.address}
			<small class="text-error">{$errors.address}</small>
		{/if}

		<div class="flex justify flex-col">
			<label class="label" for="departamento">Seleccione el Departamento</label>

			<select
				id="departamento"
				bind:value={$form.departament}
				class="select select-bordered select-xs w-11/12 mb-5"
				data-invalid={$errors.departament}
				{...$constraints.departament}
				on:change={() => handleSubmit()}
				name="departament"
			>
				{#each departamentos as departamento (departamento.codigo)}
					<option value={departamento.departamento}>
						{departamento.departamento}
					</option>
				{/each}
			</select>

			{#if $errors.departament}
				<small class="text-error">{$errors.departament}</small>
			{/if}

			{#if municipios.length > 0}
				<label class="label mr-6 my-2 p-2" for="municipio">Seleccione Ciudad</label>
				<select
					id="municipio"
					{...$constraints.city}
					bind:value={$form.city}
					class="select select-bordered select-xs w-11/12 mb-5"
					name="city"
				>
					{#each municipios as Municipio (Municipio.codigo)}
						<option value={Municipio.ciudad}>
							{Municipio.ciudad}
						</option>
					{/each}
				</select>
				{#if $errors.city}
					<small class="text-error">{$errors.city}</small>
				{/if}
			{/if}
		</div>
		<div>
			<div class="w-full flex justify-center mt-5">
				<button type="submit" class="btn btn-sm my-4">Registrar</button>

				{#if $delayed}
					<span class="text-4xl">Un momento</span>
				{/if}
			</div>
		</div>
	</div>
</form>
