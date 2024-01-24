<script>
    import AddItem from "$lib/components/iconos/Add-icon.svelte";
</script>

<menu class="flex flex-col sm:flex-row  justify-between mx-16 items-center mb-10">
    <h1 class="text-3xl font-bold">E-products</h1>
    <button class="btn btn-primary"><AddItem    /> Agregar producto</button>
</menu>

<div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Nombre</h2>
      <p>cantidad: 12</p>
      <p>Precio: 12</p>
    </div>
    <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
  </div>