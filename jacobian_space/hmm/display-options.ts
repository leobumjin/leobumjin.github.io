export const DISPLAY_LABELS = {
  hidden: "Hidden state",
  belief: "Bayesian belief",
  observed: "Observed token",
  prediction: "Next-token distribution",
  fourier: "Fourier representation",
};
export type DisplayOptions = Record<keyof typeof DISPLAY_LABELS, boolean>;
export const DEFAULT_DISPLAY: DisplayOptions = {
  hidden: true,
  belief: true,
  observed: true,
  prediction: true,
  fourier: true,
};

export type BeliefView = "prior" | "posterior" | "prediction";
