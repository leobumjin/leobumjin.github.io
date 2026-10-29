import { redirect } from "next/navigation";

export const metadata = {
  title: "Jacobian Lens — Interactive Demo",
  description:
    "계산 그래프에서 Jacobian 평균과 Logit Lens를 비교하는 인터랙티브 데모",
};

export default function JacobianSpacePage() {
  redirect("/slides/jacobian-space");
}
