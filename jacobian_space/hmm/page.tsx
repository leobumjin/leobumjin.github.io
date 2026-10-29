import HMMDemo from "./hmm-demo";
export const metadata = {
  title: "HMM Generation & Bayesian Belief Tracking",
  description:
    "Seeded HMM 생성과 정확한 Bayes filter, predictive Fourier mode를 비교하는 인터랙티브 데모",
};
export default function HMMPage() {
  return <HMMDemo />;
}
