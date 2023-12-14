<script>
	import UlMenuAdmin from "./UlMenuAdmin.svelte";

</script>
<div id="app" class="relative gap-2 pl-2 pr-2 pb-2 pt-0 h-screen">
	<menu class="[grid-area:menu] border-b-2 w-full sticky top-0 z-10">
		<slot name="menu" />
	</menu>
	
	<aside class="[grid-area:aside] flex-col flex overflow-y-auto border-r">
		<UlMenuAdmin />
	</aside>

	<main class="[grid-area:main] border-l p-5 bg-slate-100 rounded-2xl mx-2 overflow-y-auto">
		<slot />
	</main>

	<footer class="[grid-area:footer] border bg-transparent">FOOTER</footer>
</div>

<style>
	#app {
		display: grid;
		grid-template-areas:
			'menu menu menu'
			'aside main main'
			'footer footer footer';
		grid-template-columns: minmax(100px, 0.35fr) 1fr 1fr;
		grid-template-rows: auto 1fr auto;
	}

</style>
