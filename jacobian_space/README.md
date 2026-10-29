# Jacobian Lens demos

Two interactive pages share the paper's notation and a white/burgundy theme.
The pages are demos, not a slide deck.

## Routes

- `/slides/jacobian-space`: graph, lens comparison, coherence experiments.
- `/slides/jacobian_space`: redirects to the route above.
- `/slides/jacobian_space/hmm`: HMM generation and Bayesian filtering.
- `/slides/jacobian-space/hmm`: alias for the same HMM demo.

## Structure

- `demo-page.tsx`, `demo-page.module.css`: page composition and shell.
- `graph/`: selection state, graph geometry, canvas, matrix and token readouts.
- `toy-transformer.ts`: deterministic two-block Transformer and forward-mode autodiff.
- `coherence.ts`: vector averaging, coherence factors and controlled response construction.
- `coherence-demo.tsx`, `averaging-explorer.tsx`: interactive vector experiments.
- `hmm/model.ts`: seeded generator, Bayes filter and replay/branching reducer.
- `hmm/use-hmm-simulation.ts`: playback timer and simulation controls.
- `hmm/charts/`: state ring, token distribution and Fourier charts.
- `hmm/parameter-controls.tsx`, `state-panels.tsx`, `fourier-panel.tsx`,
  `sequence-timeline.tsx`: HMM interface sections.
- `hmm/jacobian-explanation.tsx`: static explanation, independent of live simulation.
- `shared/`: common equation rendering and stable SVG coordinate formatting.

`deck.json` is the retained source for the earlier slides; the demos do not load it.

## Invariants

- Hidden vectors have width 4. Both lens routes use the same normalization and unembedding.
- NULL preserves the current prior. Reveal makes the current posterior a point mass.
- Fourier moments use the **next-state prediction**, not the current posterior.
- Predicted token probabilities include NULL with probability `1 - reveal`.
- History seeks pause playback. Forced observations branch from the selected frame.
- Keep numeric SVG/style attributes rounded to avoid cross-engine hydration differences.

## Checks

```sh
node --test scripts/test-jacobian-demo.cjs scripts/test-hmm-demo.cjs
npx tsc --noEmit
npx eslint app/slides/jacobian_space
```
