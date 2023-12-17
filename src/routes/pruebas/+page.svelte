<script>
	import { h3 } from 'lucia/middleware';


    export let data 
    const { productos } = data;

</script>

<h1>
    {data.productos.cantidad}
</h1>

<pre>{JSON.stringify(productos,null,2)}</pre>

