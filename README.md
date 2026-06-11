# Crucible

**An opinionated idea crucible.** Drop in a raw business concept and it stress-tests it like a hostile investment committee — then tells you to **pursue, reshape, or kill** it.

Generation is the on-ramp. Judgment is the point. Most "AI idea generators" spray plausible-sounding ideas at you; Crucible is built to *destroy* the weak ones with an evidence-backed VC memo, and only let the strong ones through.

[![Video Title](https://img.youtube.com/vi/3fKLLHzBjXo/maxresdefault.jpg)](https://www.youtube.com/watch?v=3fKLLHzBjXo)

## How it works

Ideas move through three stages, each driven by an editable AI framework in [`frameworks/`](frameworks):

1. **Generate** — `frameworks/generator.md` turns a niche into a sharp *raw prospect* (ICP, wedge, why-now, moat intuition). Anti-convergence rules push it away from the obvious "AI assistant for X."
2. **Validate** — `frameworks/validator.md` writes an *investment memo*: hard kill tests, three-tier evidence labeling (**VERIFIED / INFERRED / ASSUMPTION TO TEST**), a structured score, and an honest **PURSUE / RESHAPE / KILL** verdict.
3. **Spec** — `frameworks/spec-builder.md` converts a validated plan into an agent-ready technical implementation spec for the MVP wedge.

Ideas are plain markdown files under `ideas/` (`prospects/`, `validated/`, `specs/`), so your whole pipeline is greppable, diffable, and yours.

## Quick start

```bash
git clone <your-fork-url> crucible
cd crucible
npm install
cp .env.example .env   # add your GEMINI_API_KEY
npm run dev
```

Get a Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Then open the app, hit **Dig for Ideas**, and start putting concepts through the crucible.

## The frameworks are the product

The web app is a comfortable shell. The real value is in [`frameworks/`](frameworks) — three carefully tuned prompts that encode a strict, moat-aware, evidence-disciplined way of evaluating businesses. Fork them, sharpen them for your domain, and the whole pipeline changes behavior. PRs that improve them are very welcome.

## Bring your own model

Crucible uses Google's Gemini via `@google/genai` by default. The model is configurable with `GEMINI_MODEL`, and the AI calls are isolated in `src/routes/+page.server.ts` — swapping in another provider is a small, contained change.

## Privacy

Your ideas stay on your machine. `ideas/` is gitignored (except the folder markers), so nothing you generate is ever committed by accident.

## Tech

SvelteKit 2 · Svelte 5 · Tailwind 4 / daisyUI · `@google/genai`. No backend, no database, no accounts — single-player by design.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview the build
npm test         # run unit tests (vitest)
npm run lint     # eslint
npm run check    # svelte-check
```

## License

Licensed under the [MIT](LICENSE) License.
