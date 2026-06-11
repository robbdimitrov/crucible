<script lang="ts">
    import { Search, CircleCheck, ChevronRight } from '@lucide/svelte';
    import { getSnippet } from '$lib/utils';
    import type { Idea } from '$lib/types';
    import SegmentedControl from './SegmentedControl.svelte';

    let {
        activeTab = $bindable(),
        selectedIdea = $bindable(),
        inboxIdeas,
        vaultIdeas,
        displayIdeas,
        selectIdea
    }: {
        activeTab: string;
        selectedIdea: Idea | null;
        inboxIdeas: Idea[];
        vaultIdeas: Idea[];
        displayIdeas: Idea[];
        selectIdea: (idea: Idea) => void;
    } = $props();
</script>

<div class="{selectedIdea ? 'hidden lg:flex' : 'flex'} w-full lg:w-95 flex-none glass-panel rounded-4xl flex-col border border-white/20 shadow-xl overflow-hidden h-full relative">
    <div class="p-4 border-b border-white/10 shrink-0 bg-base-100/30 backdrop-blur-md">
        <SegmentedControl 
            bind:selected={activeTab}
            options={[
                { id: 'inbox', label: 'Prospects', badge: inboxIdeas.length },
                { id: 'vault', label: 'Validated', badge: vaultIdeas.length }
            ]}
            onchange={(id) => {
                if (id === 'inbox') {
                    if (inboxIdeas.length > 0) selectIdea(inboxIdeas[0]); else selectedIdea = null;
                } else {
                    if (vaultIdeas.length > 0) selectIdea(vaultIdeas[0]); else selectedIdea = null;
                }
            }}
        />
    </div>
    
    <div class="overflow-y-auto p-4 flex flex-col gap-3 grow scroll-smooth pb-6">
        {#if displayIdeas.length === 0}
            <div class="flex-1 flex flex-col items-center justify-center text-center p-6 py-16 opacity-70">
                <div class="w-16 h-16 rounded-full bg-base-200/60 shadow-inner flex items-center justify-center mb-4">
                    {#if activeTab === 'inbox'}
                        <Search class="w-8 h-8 text-base-content opacity-40" />
                    {:else}
                        <CircleCheck class="w-8 h-8 text-base-content opacity-40" />
                    {/if}
                </div>
                <h3 class="font-bold text-lg mb-1">{activeTab === 'inbox' ? 'No Prospects Yet' : 'Vault is Empty'}</h3>
                <p class="text-xs text-base-content/60 leading-relaxed max-w-[200px] mb-6">
                    {#if activeTab === 'inbox'}
                        Start by digging for new startup ideas to evaluate.
                    {:else}
                        Validate prospects from your inbox to move them here.
                    {/if}
                </p>
                {#if activeTab === 'vault'}
                    <button class="btn btn-outline btn-sm rounded-full px-5 border-white/10 hover:bg-base-200" onclick={() => activeTab = 'inbox'}>
                        View Prospects
                    </button>
                {/if}
            </div>
        {/if}
        {#each displayIdeas as idea (idea.id)}
            <div 
                role="button"
                tabindex="0"
                class="p-5 rounded-2xl cursor-pointer transition-all border text-left {selectedIdea?.id === idea.id ? 'bg-base-100/80 border-primary/30 shadow-md translate-x-1' : 'glass-card border-transparent hover:border-white/10 hover:bg-base-100/40'}"
                onclick={() => selectIdea(idea)}
                onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectIdea(idea); }}
            >
                <h3 class="font-bold text-base leading-tight mb-2 {activeTab === 'vault' ? 'text-success' : ''}">{idea.title}</h3>
                <p class="text-xs text-base-content/60 line-clamp-2 leading-relaxed">{getSnippet(idea.content)}</p>
                <div class="mt-4 flex justify-between items-center text-[10px] text-base-content/40 font-medium uppercase tracking-wider">
                    <span>{idea.dateStr}</span>
                    <ChevronRight class="w-4 h-4 {selectedIdea?.id === idea.id ? 'text-primary' : 'opacity-0'} transition-opacity" />
                </div>
            </div>
        {/each}
    </div>
</div>
