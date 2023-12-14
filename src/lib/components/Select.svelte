<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    interface department{
        departamento:string,
        codigo:string
    }

    interface cities {
        ciudad: string;
    }

    let valor:string|null
    export let departamentos:department[] = [];
    export let ciudades:cities[] = []
    

    function cambia(){
        dispatch("cambio",{dato:valor})
    }
</script>

<select name="" id="" bind:value={valor} on:change={cambia}>
    {#if departamentos !== null && departamentos.length >0}
        <option value="" selected></option>
        {#each departamentos as departamento, i }
            <option value="{departamento.departamento}">{departamento.departamento}</option>
        {/each}
    {/if}

    {#if ciudades !== null && ciudades.length >0}
        <option></option>
        {#each ciudades as ciudad, i }
            <option value="{ciudad.ciudad}">{ciudad.ciudad}</option>
        {/each}
    {/if}

</select>