<script lang="ts">
    export let ref:string;
</script>

<a href={ref}>
    <li class="my-1 p-1 rounded-lg flex">
        <div class="flex">
            <slot name="icon"/>
            <p class="opacity-70 pl-6 font-semibold"><slot/></p>
        </div>
    </li>
</a>