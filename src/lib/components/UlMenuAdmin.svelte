<script>
    import Inicio_Icon from "./iconos/Inicio-icon.svelte";
    import Clientes_Icon from "./iconos/Clientes-icon.svelte";
    import Productos_Icon from "./iconos/Productos-icon.svelte";
    import Categorias_Icon from "./iconos/Categorias-icon.svelte";
    import Pedidos_Icon from "./iconos/Pedidos-icon.svelte";
    import ItemMenuAdmin from "./ItemMenuAdmin.svelte";
</script>

<ul >
    <ItemMenuAdmin ref="/administrator">
        <Inicio_Icon slot="icon"/> Inicio
    </ItemMenuAdmin>
    
    <ItemMenuAdmin ref="/adm/clientes">
        <Clientes_Icon slot="icon"/> Clientes
    </ItemMenuAdmin>

    <ItemMenuAdmin ref="/administrator/mainProducts/1">
        <Productos_Icon slot="icon"/> Productos
    </ItemMenuAdmin>

    <ItemMenuAdmin ref="/administrator/mainCategories">
        <Categorias_Icon slot="icon"/> Categorias
    </ItemMenuAdmin>

    <ItemMenuAdmin ref="/administrator">
        <Pedidos_Icon slot="icon"/> Pedidos
    </ItemMenuAdmin>
</ul>