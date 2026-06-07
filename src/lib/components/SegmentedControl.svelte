<script lang="ts">
    export type Option = { id: string; label: string; badge?: string | number };
    let {
        options,
        selected = $bindable(),
        onchange,
        class: className = ''
    }: {
        options: Option[];
        selected: string;
        onchange?: (id: string) => void;
        class?: string;
    } = $props();

    function select(id: string) {
        if (selected !== id) {
            selected = id;
            if (onchange) onchange(id);
        }
    }
</script>

<div class="flex bg-base-200/50 rounded-xl p-1 {className}">
    {#each options as option (option.id)}
        <button 
            type="button"
            class="flex-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all {selected === option.id ? 'bg-base-100 shadow-sm text-base-content' : 'text-base-content/60 hover:text-base-content'}"
            onclick={() => select(option.id)}
        >
            {option.label}
            {#if option.badge !== undefined}
                <span class="ml-1 opacity-50 text-xs">({option.badge})</span>
            {/if}
        </button>
    {/each}
</div>
