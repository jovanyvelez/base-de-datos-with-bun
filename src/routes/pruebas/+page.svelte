<script lang="ts">
    export let data;
</script>

{#await data.envio}
    <h1 class="text-center">Cargando...</h1>    
{:then respuesta } 
    <h1 class="text-center">{JSON.stringify(respuesta,null,2)}</h1>
{/await}

