<script lang="ts">
    import { page } from '$app/state';
    import { FlaskConical, Home } from '@lucide/svelte';
</script>

<div class="min-h-screen flex items-center justify-center p-4 lg:p-8">
    <div class="glass-panel max-w-lg w-full p-10 lg:p-14 rounded-[2.5rem] flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
        <div class="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center text-error mb-8 shadow-inner border border-error/20">
            <FlaskConical class="w-12 h-12 opacity-80" />
        </div>
        
        <h1 class="text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-linear-to-br from-base-content to-base-content/40">
            {page.status}
        </h1>
        
        <h2 class="text-2xl font-extrabold mb-4 tracking-tight">
            {#if page.status === 404}
                Dead End
            {:else}
                System Failure
            {/if}
        </h2>
        
        <p class="text-base-content/60 mb-10 leading-relaxed text-lg">
            {#if page.status === 404}
                We dug deep, but this prospect doesn't exist. It might have been discarded, or you've wandered into uncharted territory.
            {:else}
                {page.error?.message || "An unexpected anomaly occurred in the crucible. The error has been logged."}
            {/if}
        </p>
        
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
        <a href="/" class="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Home class="w-5 h-5 mr-2" /> Return to Crucible
        </a>
    </div>
</div>
