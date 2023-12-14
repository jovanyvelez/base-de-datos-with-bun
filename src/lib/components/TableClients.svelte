<script lang="ts">
    import Search_icon from '$lib/components/iconos/Search-icon.svelte';
    import Edit_icon from '$lib/components/iconos/Edit-Icon.svelte';
    export let clientes;
</script>


<table class="border-collapse w-full">
	<thead>
		<tr>
			<th class="border border-slate-300 bg-slate-200 p-2">Nombre</th>
			<th class="border border-slate-300 bg-slate-200 p-2">Correo</th>
			<th class="border border-slate-300 bg-slate-200 p-2">Pedidos</th>
			<th class="border border-slate-300 bg-slate-200 p-2">Valor</th>
            <th class="border border-slate-300 bg-slate-200 p-2">Accion</th>
		</tr>
	</thead>
	<tbody>
		{#each clientes as cliente (cliente.id)}
			<tr>
				<td class="border border-slate-300 p-1">{cliente.name}</td>
				<td class="border border-slate-300 p-1">{cliente.email}</td>
				<td class="border border-slate-300 p-1">{cliente.pedidos}</td>
				<td class="border border-slate-300 p-1">{cliente.valor?`${cliente.valor}`:'No compra'}</td>
                <td class="border border-slate-300 p-1">
                    <div class="flex justify-evenly">
                        <a href={`/adm/clientes/${cliente.id}`}>
							<Search_icon/>
						</a>
						<a href="/administrator">
							<Edit_icon color="text-primary"/>
						</a>
                    </div>
                </td>
			</tr>
		{/each}
	</tbody>
</table>