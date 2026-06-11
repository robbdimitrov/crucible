# AGENTS.md

## Mission

Crucible is an idea operating system: a structured pipeline for turning rough business concepts into rigorously evaluated opportunities. It is not a notes folder. It helps a human or an LLM **capture** ideas, **evaluate** them ruthlessly, and **promote** only the strongest into agent-ready specs.

## Source of truth

Read these before making meaningful changes:

- `README.md` — purpose and stage-based workflow
- `frameworks/generator.md` — generating raw ideas and niches
- `frameworks/validator.md` — the canonical idea-evaluation standard
- `frameworks/spec-builder.md` — shaping a validated idea into a technical spec

On conflict, prefer the more specific document: validator → generator → spec-builder → README → file-local context.

## Layout

- `src/` — the SvelteKit app (the interactive Crucible shell)
- `frameworks/` — the AI prompts that define generation, validation, and spec-building
- `ideas/prospects/` — raw and reshaped ideas
- `ideas/validated/` — ideas that passed deep validation
- `ideas/specs/` — technical specs attached to validated ideas

`ideas/` content is gitignored by design — never commit generated ideas.

## The frameworks are the core logic

`frameworks/` holds the reusable prompts that power the app. When editing them:

- Prefer durable, operational guidance over one-off commentary.
- Generation frameworks should bias toward boring B2B workflows, real pain, clear buyers, and a hyper-specific wedge.
- Validation frameworks must demand real evidence, honest verdicts (pursue / reshape / kill), structural moat analysis, and AI-era durability.
- Keep a single source of truth. Improve the canonical framework instead of forking near-duplicates.

## Evaluation order

When evaluating an idea: apply hard kill tests first, then the weighted score, then AI-age relevance, then moat reality, then classify honestly. A score without reasoning is low quality; an explanation without a verdict is incomplete. Do not let a polished writeup rescue a weak business.

## Writing guidelines

Markdown. Short sections, descriptive headings, bullets over paragraphs, tables only when comparison matters, direct language over hedging. Use project-relative links, never machine-specific absolute paths. Avoid fluff, motivational filler, consultant jargon, and fake precision. Every document should be skimmable in under a minute.

## Code conventions

- Keep AI/provider calls isolated in `src/routes/+page.server.ts`.
- Keep pure logic (parsing, slugifying) in `src/lib/` with unit tests alongside (`*.test.ts`).
- Run `npm run check`, `npm run lint`, and `npm test` before finishing.

## Quality bar

Before finishing, check that the output improves clarity, preserves truth, sharpens decisions, reduces duplication, and matches the repo's stage and purpose. If not, revise it.
