---
layout: post
title: "Consistency vs. Coherence in Belief Systems"
permalink: /blog/2026/consistency-coherence-en/
---

**Consistency** and **coherence** describe different requirements for maintaining a reliable belief system.

- **Consistency:** Beliefs should not logically contradict one another.
- **Coherence:** Beliefs should be accepted or rejected according to their supporting justifications.

A belief system can be consistent without being coherent. Avoiding contradictions does not guarantee that every accepted belief is properly supported.

## 1. An Example from Truth Maintenance Systems

The following example is adapted from Peter Gärdenfors' *Knowledge in Flux* (1988, p. 34), illustrating how a Truth Maintenance System (TMS) maintains beliefs through justification dependencies.

In a TMS, each node has one of two statuses:

- **IN:** The belief is currently accepted because its justification is satisfied.
- **OUT:** The belief is not currently accepted because its justification is not satisfied.

Importantly, **OUT does not necessarily mean false**. It means the system does not currently have sufficient justification to accept the belief.


<figure>
    <img src="https://d2acbkrrljl37x.cloudfront.net/MatrixFigures/Research/justification_system.webp" />
</figure>


### Initial Belief State

| Node | Belief | Status |
| --- | --- | --- |
| N1 | Oscar is not guilty of defamation. | **IN** |
| N2 | The accused should have the benefit of the doubt. | **IN** |
| N3 | Oscar called the queen a harlot. | **OUT** |
| N4 | The witness's report may be assumed correct. | **IN** |
| N5 | The witness says he heard Oscar's remark. | **OUT** |

The justification rules are:

$$
N_3 \leftarrow \mathrm{IN}(N_4) \land \mathrm{IN}(N_5)
$$

$$
N_1 \leftarrow \mathrm{IN}(N_2) \land \mathrm{OUT}(N_3)
$$

Initially, **N3 is OUT** because N5 is OUT. Consequently, **N1 is IN** because N2 is IN and N3 is OUT.

### When New Evidence Arrives

Suppose the system now accepts the witness's statement, so **N5 changes from OUT to IN**.

Because the witness is already considered reliable (**N4 is IN**), the system now has a justification for accepting that Oscar made the remark. Therefore, **N3 changes from OUT to IN**.

This removes the justification for N1. The system previously accepted that Oscar was not guilty because he should receive the benefit of the doubt (**N2 is IN**) and the alleged remark had not been established (**N3 was OUT**). Once N3 becomes IN, that justification no longer holds, so **N1 changes from IN to OUT**.

**The system has withdrawn its acceptance of “Oscar is not guilty.” It has not thereby established that Oscar is guilty.** Retracting a belief and accepting its negation are different operations.

## 2. Why Consistency Is Not Enough

Consider a system that updates N5 and N3 to IN but leaves N1 as IN.

This violates the justification rule for N1. The system has failed to propagate the consequences of new evidence.

Alternatively, suppose the system places both N1 and N3 OUT, even though N2 remains IN. This avoids accepting both conclusions, but N1 should be IN under the specified justification rule.

The distinction is therefore:

| Consistency | Coherence |
| --- | --- |
| Are the accepted beliefs logically compatible? | Are their statuses justified? |
| Prevents contradictions | Preserves justification dependencies |
| Concerns the resulting set of beliefs | Concerns why beliefs are IN or OUT |

Coherence is thus more than checking for contradictions. It requires maintaining the relationships that determine which beliefs should be accepted.

The precise relationship between consistency and coherence depends on the formal system; satisfying justification dependencies does not automatically guarantee logical consistency.

## 3. Connection to Non-Monotonic Reasoning

Non-monotonic reasoning allows previously accepted beliefs to be retracted when new information changes their justifications.

$$
K_t \xrightarrow{\text{New Evidence}} K_{t+1}
$$

A successful update must determine:

1. **What to accept:** Beliefs whose justifications become satisfied.
2. **What to retract:** Beliefs whose justifications become invalid.
3. **What to preserve:** Beliefs whose justifications remain valid.

This distinction is especially relevant to language models. A model may answer individual questions correctly while failing to maintain coherent dependencies across its evolving knowledge.

**Consistency asks whether beliefs can coexist. Coherence asks whether their acceptance and rejection are justified.**

The central challenge of non-monotonic reasoning is therefore not merely changing beliefs, but maintaining a coherent belief system as information evolves.

---

**Reference:** Gärdenfors, P. (1988). *Knowledge in Flux: Modeling the Dynamics of Epistemic States*. MIT Press, p. 34.
