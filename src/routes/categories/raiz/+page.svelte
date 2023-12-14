<script lang="ts">
	
	export let data
	const { test } = data;
</script>

<h1>Bienvenido</h1>
<a href="/">Back</a>
<div>
	{#await data.test}
		Loading...
	{:then value}
		<div class="">
			{#each value as val (val.categoria_id)}

				<ul>
					<li><p>{val.categoria_name}</p>
						<pre>{JSON.stringify(val.productos,null,2)}</pre>
					</li>

				</ul>
	

			{/each}
		</div>
	{:catch error}
		{error.message}
	{/await}
</div>

<a href="/">Back</a>

<style>
	
	a,h1 {
		text-align: center;
	}
	/*.bg {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		align-items: center;
		margin-right: 5px;
		padding: 5px;
	}*/

	a{
		display:block;
	}
</style>
