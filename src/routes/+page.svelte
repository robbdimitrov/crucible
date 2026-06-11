<script lang="ts">
    import { onMount } from 'svelte';
    import { marked } from 'marked';
    import DOMPurify from 'dompurify';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { FlaskConical, LoaderCircle, Sparkles, Search, CircleCheck, ChevronLeft, X, CodeXml, Microscope, Trash2, Copy } from '@lucide/svelte';
    import type { Idea } from '$lib/types';
    import Header from '$lib/components/Header.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import PrimaryButton from '$lib/components/PrimaryButton.svelte';
    import SegmentedControl from '$lib/components/SegmentedControl.svelte';

    let { data }: { data: { ideas: { prospects: Idea[], validated: Idea[] } } } = $props();
    let ideas = $derived(data.ideas);
    
    let inboxIdeas: Idea[] = $derived(ideas.prospects);
    let vaultIdeas: Idea[] = $derived(ideas.validated);

    let isGenerating = $state(false);
    let isValidating = $state(false);
    let isDraftingSpec = $state(false);
    let isDigModalOpen = $state(false);
    
    let nicheInput = $state('');
    let selectedIdea: Idea | null = $state(null);
    let activeTab = $state('inbox'); // 'inbox' or 'vault'
    let viewMode = $state('business'); // 'business' or 'spec'
    let displayIdeas: Idea[] = $derived(activeTab === 'inbox' ? inboxIdeas : vaultIdeas);

    let isCopied = $state(false);

    async function copyContent() {
        if (!selectedIdea) return;
        const textToCopy = viewMode === 'spec' ? selectedIdea.specContent : selectedIdea.content;
        if (!textToCopy) return;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            isCopied = true;
            addToast('📋 Copied to clipboard', 'info');
            setTimeout(() => isCopied = false, 2000);
        } catch {
            addToast('Failed to copy', 'error');
        }
    }

    // Idiomatic Svelte Action for DOM manipulation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function resetScroll(node: HTMLElement, _deps: unknown[]) {
        return {
            update() {
                node.scrollTop = 0;
            }
        };
    }

    let toasts: { id: number, message: string, type: string }[] = $state([]);
    let toastId = 0;
    function addToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
        const id = toastId++;
        toasts.push({ id, message, type });
        setTimeout(() => {
            toasts = toasts.filter(t => t.id !== id);
        }, 3000);
    }

    onMount(() => {
        const urlTab = page.url.searchParams.get('tab');
        if (urlTab === 'inbox' || urlTab === 'vault') activeTab = urlTab;

        const urlView = page.url.searchParams.get('view');
        if (urlView === 'business' || urlView === 'spec') viewMode = urlView;

        const urlId = page.url.searchParams.get('id');
        if (urlId) {
            const allIdeas = [...ideas.prospects, ...ideas.validated];
            const idea = allIdeas.find((i: Idea) => i.id === urlId || i.id === urlId.replace(/^raw-/, 'prospects-').replace(/^evaluated-/, 'prospects-').replace(/^prospects-/, 'validated-'));
            if (idea) {
                if (idea.stage === 'validated') {
                    activeTab = 'vault';
                } else {
                    activeTab = 'inbox';
                }
                selectIdea(idea);
            }
        }
    });

    $effect(() => {
        const url = new URL(page.url);
        if (activeTab) url.searchParams.set('tab', activeTab);
        
        url.searchParams.set('view', viewMode);

        if (selectedIdea) {
            url.searchParams.set('id', selectedIdea.id);
        } else {
            url.searchParams.delete('id');
        }

        
        if (url.toString() !== page.url.toString()) {
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            goto(url, { replaceState: true, keepFocus: true, noScroll: true });
        }
    });

    /** @param {Idea} idea */
    async function selectIdea(idea: Idea) {
        let rawHtml = await marked.parse(idea.content);
        let safeHtml = DOMPurify.sanitize(rawHtml);
        
        let specHtml = null;
        if (idea.specContent) {
            let specRaw = await marked.parse(idea.specContent);
            specHtml = DOMPurify.sanitize(specRaw);
        }
        
        selectedIdea = { ...idea, htmlContent: safeHtml, specHtml };
        
        viewMode = 'business';
    }

    // Hotkeys
    /** @param {KeyboardEvent} e */
    function handleKeydown(e: KeyboardEvent) {
        const target = e.target as HTMLElement;
        const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
        if (e.key === 'Escape') {
            isDigModalOpen = false;
            return;
        }
        if (isTyping) return;
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (displayIdeas.length === 0) return;
            
            if (!selectedIdea) {
                selectIdea(displayIdeas[0]);
                return;
            }
            
            const currentIndex = displayIdeas.findIndex(i => i.id === selectedIdea!.id);
            if (e.key === 'ArrowDown' && currentIndex < displayIdeas.length - 1) {
                selectIdea(displayIdeas[currentIndex + 1]);
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                selectIdea(displayIdeas[currentIndex - 1]);
            }
        }
        
        if (e.key === '/') { 
            e.preventDefault(); 
            isDigModalOpen = true; 
            setTimeout(() => {
                const el = document.querySelector('textarea[name="niche"]') as HTMLElement;
                el?.focus();
            }, 50); 
        }
    }


    
    const hints = [
        "Booking + waivers for escape rooms",
        "Royalty splits for indie musicians",
        "Inventory for board game cafés",
        "Dispatch for mobile car detailers"
    ];
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="min-h-screen flex flex-col relative bg-transparent overflow-hidden h-screen">
    <!-- Header -->
    <Header bind:isDigModalOpen />

    <main class="pt-28 pb-6 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1 flex gap-6 overflow-hidden h-full">
        
        <!-- LEFT SIDEBAR: THE INDEX -->
        <Sidebar
            bind:activeTab
            bind:selectedIdea
            {inboxIdeas}
            {vaultIdeas}
            {displayIdeas}
            {selectIdea}
        />

        <!-- RIGHT CANVAS: THE CRUCIBLE -->
        <div class="{!selectedIdea ? 'hidden lg:flex' : 'flex'} flex-1 glass-panel rounded-[2.5rem] flex-col border border-white/20 shadow-2xl overflow-hidden bg-base-100/40 h-full relative">
            {#if selectedIdea}
                <!-- Action Bar -->
                <div class="py-3 lg:py-6 border-b border-white/10 shrink-0 bg-base-100/60 backdrop-blur-xl flex justify-between items-center gap-2 z-10 overflow-x-auto hide-scrollbar">
                    <!-- Left side: Back & Tabs -->
                    <div class="flex items-center gap-2 shrink-0 pl-3 lg:pl-6">
                        <button class="btn btn-circle btn-ghost btn-sm lg:hidden -ml-2 shrink-0" onclick={() => selectedIdea = null}>
                            <ChevronLeft class="w-5 h-5" />
                        </button>
                        {#if activeTab === 'vault'}
                            <SegmentedControl 
                                class="shrink-0"
                                bind:selected={viewMode}
                                options={[
                                    { id: 'business', label: 'Business Plan' },
                                    { id: 'spec', label: 'Tech Spec' }
                                ]}
                            />
                        {:else}
                            <div class="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center text-warning shrink-0">
                                <Search class="w-4 h-4" />
                            </div>
                            <span class="font-bold text-warning uppercase tracking-wider text-sm hidden sm:inline">Raw Prospect</span>
                        {/if}
                    </div>
                    
                    <!-- Right side: Actions -->
                    <div class="flex items-center gap-1 lg:gap-3 shrink-0 pr-3 lg:pr-6">
                        <form method="POST" action="?/deleteForever" use:enhance={({ cancel }) => {
                            if (!confirm('Are you sure you want to discard this idea? This cannot be undone.')) {
                                cancel();
                                return;
                            }
                            const idToDiscard = selectedIdea!.id;
                            return async ({ update }) => {
                                await update();
                                addToast('🗑️ Prospect discarded', 'info');
                                if (selectedIdea?.id === idToDiscard) selectedIdea = null;
                            };
                        }}>
                            <input type="hidden" name="filename" value={selectedIdea.filename} />
                            <input type="hidden" name="stage" value={selectedIdea.stage} />
                            <button class="btn btn-ghost btn-circle lg:w-auto lg:rounded-full lg:px-6 text-base-content/60 hover:text-error hover:bg-error/10 transition-colors" title="Discard">
                                <Trash2 class="w-5 h-5 lg:hidden" />
                                <span class="hidden lg:inline">Discard</span>
                            </button>
                        </form>
                        
                        {#if activeTab === 'inbox'}
                            <form method="POST" action="?/evaluateAI" use:enhance={() => {
                                isValidating = true;
                                const idToValidate = selectedIdea!.id;
                                return async ({ update, result }) => {
                                    await update();
                                    isValidating = false;
                                    
                                    if (result.type === 'failure') {
                                        addToast((result.data as { error?: string })?.error || 'Deep validation failed. Please retry in a moment.', 'error');
                                    } else if (result.type === 'success') {
                                        addToast('✨ Deep validation complete', 'success');
                                        if (selectedIdea?.id === idToValidate) {
                                            const updatedIdea = vaultIdeas.find((i: Idea) => i.filename === selectedIdea!.filename);
                                            if (updatedIdea) selectIdea(updatedIdea);
                                            activeTab = 'vault';
                                        }
                                    }
                                };
                            }}>
                                <input type="hidden" name="filename" value={selectedIdea.filename} />
                                <input type="hidden" name="stage" value={selectedIdea.stage} />
                                <PrimaryButton class="btn-sm lg:btn-md px-4 lg:px-6 flex items-center justify-center whitespace-nowrap" disabled={isValidating}>
                                    {#if isValidating}
                                        <LoaderCircle class="w-4 h-4 mr-1 lg:mr-2 animate-spin" /> <span class="hidden sm:inline">Deep Validating...</span><span class="sm:hidden">Thinking...</span>
                                    {:else}
                                        <Microscope class="w-4 h-4 mr-1 lg:mr-2" /> <span class="hidden sm:inline">Deep Validate</span><span class="sm:hidden">Validate</span>
                                    {/if}
                                </PrimaryButton>
                            </form>
                        {:else if activeTab === 'vault'}
                            <form method="POST" action="?/generateSpec" use:enhance={() => {
                                isDraftingSpec = true;
                                const idToSpec = selectedIdea!.id;
                                return async ({ update, result }) => {
                                    await update();
                                    isDraftingSpec = false;
                                    
                                    if (result.type === 'failure') {
                                        addToast((result.data as { error?: string })?.error || 'Tech spec drafting failed. Please retry in a moment.', 'error');
                                    } else if (result.type === 'success') {
                                        addToast('💻 Tech Spec drafted successfully', 'success');
                                        if (selectedIdea?.id === idToSpec) {
                                            const updatedIdea = vaultIdeas.find((i: Idea) => i.filename === selectedIdea!.filename);
                                            if (updatedIdea) selectIdea(updatedIdea);
                                            viewMode = 'spec';
                                        }
                                    }
                                };
                            }}>
                                <input type="hidden" name="filename" value={selectedIdea.filename} />
                                <input type="hidden" name="stage" value={selectedIdea.stage} />
                                <PrimaryButton class="btn-sm lg:btn-md px-4 lg:px-6 flex items-center justify-center whitespace-nowrap" disabled={isDraftingSpec}>
                                    {#if isDraftingSpec}
                                        <LoaderCircle class="w-4 h-4 mr-1 lg:mr-2 animate-spin" /> <span class="hidden sm:inline">Drafting Spec...</span><span class="sm:hidden">Drafting...</span>
                                    {:else if selectedIdea.specContent}
                                        <CodeXml class="w-4 h-4 mr-1 lg:mr-2" /> <span class="hidden sm:inline">Regenerate Spec</span><span class="sm:hidden">Regenerate</span>
                                    {:else}
                                        <CodeXml class="w-4 h-4 mr-1 lg:mr-2" /> <span class="hidden sm:inline">Draft Tech Spec</span><span class="sm:hidden">Draft Spec</span>
                                    {/if}
                                </PrimaryButton>
                            </form>
                        {/if}
                    </div>
                </div>

                <!-- Markdown Content -->
                <div class="relative grow flex flex-col overflow-hidden group/doc">
                    <!-- Subtle Premium Copy Button Overlay -->
                    <div class="absolute top-6 right-6 lg:top-8 lg:right-10 z-30 opacity-0 group-hover/doc:opacity-100 transition-all duration-300 pointer-events-none -translate-y-4 group-hover/doc:translate-y-0">
                        <button 
                            class="btn btn-circle bg-base-300/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10 pointer-events-auto tooltip tooltip-left hover:scale-110 hover:bg-base-300/60 hover:border-white/20 hover:shadow-primary/20 transition-all text-base-content/70 hover:text-base-content" 
                            data-tip={isCopied ? "Copied!" : "Copy document"}
                            onclick={copyContent}
                        >
                            {#if isCopied}
                                <CircleCheck class="w-5 h-5 text-success drop-shadow-md" />
                            {:else}
                                <Copy class="w-5 h-5 drop-shadow-sm" />
                            {/if}
                        </button>
                    </div>

                    <div class="p-10 lg:p-16 lg:pr-24 overflow-y-auto grow scroll-smooth pb-32" use:resetScroll={[selectedIdea?.id, viewMode]}>
                    {#if viewMode === 'spec'}
                        {#if selectedIdea.specHtml}
                            <div class="prose prose-base lg:prose-lg max-w-3xl mx-auto markdown-body bg-transparent">
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                                {@html selectedIdea.specHtml}
                            </div>
                        {:else}
                            <div class="flex flex-col items-center justify-center text-center p-8 opacity-50 h-full py-20">
                                <div class="opacity-20 mb-6">
                                    <CodeXml class="w-16 h-16 mx-auto" />
                                </div>
                                <h2 class="text-2xl font-bold mb-2">No Technical Spec</h2>
                                <p class="max-w-md mx-auto text-base-content/70">You haven't generated a technical specification for this prospect yet. Click the button above to draft one.</p>
                            </div>
                        {/if}
                    {:else}
                        <div class="prose prose-base lg:prose-lg max-w-3xl mx-auto markdown-body bg-transparent">
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html selectedIdea.htmlContent}
                        </div>
                    {/if}
                </div>
                </div>
            {:else}
                <!-- Empty State -->
                <div class="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                    <div class="opacity-20 mb-6">
                        <FlaskConical class="w-16 h-16" />
                    </div>
                    <h2 class="text-2xl font-bold mb-2">Nothing in the Crucible</h2>
                    <p class="max-w-md mx-auto text-base-content/70">Select a prospect from the index on the left to read it, or generate a new one to stress-test.</p>
                </div>
            {/if}
        </div>
    </main>
</div>

<!-- Toasts -->
<div class="toast toast-end z-50">
    {#each toasts as toast (toast.id)}
        <div class="alert {toast.type === 'error' ? 'alert-error' : toast.type === 'info' ? 'alert-info' : 'alert-success'} shadow-lg font-medium border-0 animate-in slide-in-from-right-4 fade-in duration-300">
            <span>{toast.message}</span>
        </div>
    {/each}
</div>

<!-- Modals -->
{#if isDigModalOpen}
    <div role="button" tabindex="0" class="modal-overlay" onclick={() => isDigModalOpen = false} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') isDigModalOpen = false; }}>
        <div role="presentation" class="w-full max-w-xl glass-panel-heavy rounded-[2.5rem] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.3)] border border-white/20 cursor-default" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
            <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Sparkles class="w-6 h-6" />
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold tracking-tight">Dig for Ideas</h3>
                        <p class="text-sm text-base-content/60">Generate a raw prospect using the strict VC framework.</p>
                    </div>
                </div>
                <button class="btn btn-ghost btn-circle btn-sm" onclick={() => isDigModalOpen = false} title="Close">
                    <X class="w-5 h-5" />
                </button>
            </div>
            
            <form method="POST" action="?/generateAI" class="flex flex-col gap-5" use:enhance={() => {
                isGenerating = true;
                return async ({ update, result }) => {
                    await update();
                    isGenerating = false;
                    
                    if (result.type === 'failure') {
                        addToast((result.data as { error?: string })?.error || 'Idea generation failed. Please retry in a moment.', 'error');
                    } else if (result.type === 'success') {
                        addToast('💡 Raw prospect generated', 'success');
                        isDigModalOpen = false;
                        nicheInput = '';
                        activeTab = 'inbox'; // Switch back to inbox to see new idea
                        
                        if (result.data?.ideaId) {
                            setTimeout(() => {
                                const newIdea = inboxIdeas.find((i: Idea) => i.id === result.data?.ideaId);
                                if (newIdea) selectIdea(newIdea);
                            }, 50);
                        }
                    }
                };
            }}>
                <div class="form-control w-full relative">
                    <textarea 
                        name="niche" 
                        class="textarea textarea-bordered w-full h-32 bg-base-100/50 backdrop-blur-md rounded-2xl text-base p-5 border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner" 
                        placeholder="E.g., membership software for climbing gyms..."
                        bind:value={nicheInput}
                        required
                    ></textarea>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-2">
                    {#each hints as hint (hint)}
                        <button type="button" class="badge badge-outline badge-sm py-3 px-3 hover:bg-base-200 cursor-pointer transition-colors" onclick={() => nicheInput = hint}>
                            {hint}
                        </button>
                    {/each}
                </div>
                
                <PrimaryButton type="submit" class="w-full rounded-2xl h-14 text-base font-bold" disabled={isGenerating}>
                    {#if isGenerating}
                        <LoaderCircle class="w-5 h-5 mr-2 animate-spin" /> Unearthing Prospect...
                    {:else}
                        Generate Prospect
                    {/if}
                </PrimaryButton>
            </form>
        </div>
    </div>
{/if}
