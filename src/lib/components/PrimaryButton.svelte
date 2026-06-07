<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    let {
        class: className = '',
        children,
        ...rest
    }: {
        class?: string;
        children?: Snippet;
    } & HTMLButtonAttributes = $props();
</script>

<button 
    class="btn btn-primary rounded-full shadow-lg shadow-primary/20 disabled:shadow-none transition-all {className}"
    {...rest}
>
    {#if children}
        {@render children()}
    {/if}
</button>
