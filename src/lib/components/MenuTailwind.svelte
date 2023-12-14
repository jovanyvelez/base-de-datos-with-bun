 <script lang="ts">
    import { cart  } from '$lib/stores/stores';

	interface categories {
		id:string,
		name: string
	}

	$: items = $cart.length;
    
    import Hamburguer from "./Hamburguer.svelte";
    import Close from "./Close.svelte";
    let showHamburguer = true;
    let show = "hidden"
    let change = ()=>{
        showHamburguer = !showHamburguer;
        showHamburguer ? show = "hidden":show=""
    }
 </script>


<nav class="p-5 bg-white shadow md:flex md:items-center md:justify-between">
    <div class="flex justify-between items-center text-blue-800 font-extrabold">
        <span class="text-2xl font-[Poppins]">
            <img class="inline h-12" src="https://res.cloudinary.com/dqlbbx7ud/image/upload/v1695397092/tienda/Logo_rbmsi8.svg" alt="Logo">
            Ecommerce
        </span>

        <span class="cursor-pointer md:hidden mx-2">
            {#if showHamburguer}
                <button on:click={change}><Hamburguer /></button>
            {:else}
                <button on:click={change}><Close /></button>
            {/if}
        </span>

    </div>
    <div>
    <ul class={`md:flex md:items-center md:py-0 py-4 transition-all ease-in duration-500 md:opacity-100 ${show}`}>
        <li class="mx-4 my-6 md:my-0">
            <a class="text-xl hover:text-cyan-500 duration-500" href="/">HOME</a>
        </li>
        <li class="mx-4 my-6 md:my-0">
            <a class="text-xl hover:text-cyan-500 duration-500" href="/">ABOUT</a>
        </li>
        <li class="mx-4 my-6 md:my-0">
            <a class="text-xl hover:text-cyan-500 duration-500" href="/">CONTACT</a>
        </li>

    </ul>
</div>
<div>
    
    <button class={`md:block bg-cyan-400 text-white rounded-md font-[Poppins] duration-500 px-6 py-2 mx-4 hover:bg-cyan-500 md:opacity-100 ${show}`}>
        Get Started
    </button>
    </div>
</nav>