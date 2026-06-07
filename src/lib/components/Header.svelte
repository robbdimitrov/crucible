<script lang="ts">
    import { FlaskConical, Sparkles } from '@lucide/svelte';
    import PrimaryButton from './PrimaryButton.svelte';

    let { isDigModalOpen = $bindable() }: { isDigModalOpen: boolean } = $props();
</script>

<header class="fixed top-6 left-1/2 -translate-x-1/2 max-w-7xl w-[calc(100%-2rem)] z-50 navbar glass-panel-heavy rounded-full px-4 py-2 shadow-2xl border border-white/20 transition-all">
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href="/" class="flex-1 flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
        <div class="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content shadow-lg shrink-0">
            <FlaskConical class="w-5 h-5" />
        </div>
        <h1 class="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-base-content to-base-content/60 truncate">Crucible</h1>
    </a>
    <div class="flex-none gap-2">
        <PrimaryButton class="btn-sm px-4" onclick={() => isDigModalOpen = true}>
            <Sparkles class="w-4 h-4 mr-1" />
            Dig for Ideas
        </PrimaryButton>
    </div>
</header>
