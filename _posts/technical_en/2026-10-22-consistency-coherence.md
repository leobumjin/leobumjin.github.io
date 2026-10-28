---
layout: post
title: "Consistency vs. Foundations vs. Coherence in Belief Systems"
mini-title: How Beliefs Change
permalink: /blog/2026/consistency-coherence-en/
---

**Consistency, foundations, and coherence** represent three different perspectives on how a belief system should be maintained and revised. Although they are closely related, they impose different requirements on the acceptance, preservation, and retraction of beliefs.

## 1. Consistency: Avoiding Contradictions

**Consistency** requires that a belief system does not contain logical contradictions. A set of beliefs \(K\) is consistent if it is possible for all beliefs in \(K\) to be true simultaneously.

For example, a belief system containing both "Tweety can fly" and "Tweety cannot fly" is logically inconsistent.

However, consistency alone does not determine which beliefs should be accepted or preserved. A belief system may remain consistent even after arbitrarily removing beliefs that could have been retained.

Thus, **consistency constrains which beliefs can coexist, but does not determine how beliefs should change.**

## 2. Foundations: Maintaining Justified Beliefs

The **foundations approach** maintains that beliefs should be accepted only when they have satisfactory justifications or reasons.

For example, consider the following beliefs:

- A: Tweety is a bird.
- A → B: Birds can fly.
- B: Tweety can fly.

If A is retracted, B loses its original justification. Under the foundations approach, B should also be retracted unless another valid justification supports it.

This approach emphasizes the dependency between beliefs and their supporting reasons. Belief revision therefore involves tracking how changes in justifications affect other beliefs.

Truth Maintenance Systems (TMS) exemplify this approach by explicitly maintaining justification dependencies. <citation key="doyle1992foundationscoherence"></citation>

Thus, **foundations require that accepted beliefs remain supported by valid justifications.**

### A Justification-Based Example

Consider the example from *Knowledge in Flux* (p. 34), involving an accusation of defamation against Oscar.

An early system for tracking such dependencies was Jon Doyle's **Truth Maintenance System (TMS)**, introduced in 1979 and also known as a **Reason Maintenance System (RMS)**. It maintains accepted beliefs and their supporting reasons, rather than establishing objective truth about the external world.

In a justification-based TMS, each proposition has one of two statuses:

- **IN:** The proposition is currently accepted into the belief set.
- **OUT:** The proposition is not currently accepted into the belief set.

**OUT does not mean false.** It means that the proposition is not accepted under the current justification structure.

<figure>
  <img src="https://d2acbkrrljl37x.cloudfront.net/MatrixFigures/Research/justification_system.webp" alt="Oscar example showing the justification dependencies between beliefs N1 through N5" />
</figure>

The initial belief state is:

| Node | Belief | Status |
|---|---|---|
| N1 | Oscar is not guilty of defamation. | **IN** |
| N2 | The accused should have the benefit of the doubt. | **IN** |
| N3 | Oscar called the queen a harlot. | **OUT** |
| N4 | The witness's report may be assumed correct. | **IN** |
| N5 | The witness says he heard Oscar's remark. | **OUT** |

The justification conditions are:

$$
N_3 \leftarrow \mathrm{IN}(N_4) \land \mathrm{IN}(N_5)
$$

$$
N_1 \leftarrow \mathrm{IN}(N_2) \land \mathrm{OUT}(N_3)
$$

Initially, **N3 is OUT** because N5 is OUT. Consequently, **N1 is IN** because N2 is IN and N3 is OUT.

Notice that the system does not establish Oscar's innocence as an objective fact. It accepts the conclusion because the available justification conditions are satisfied.

This is a simplified model of evidential reasoning, not a complete account of legal guilt or innocence.

### Updating the Example

Now suppose the witness's statement becomes accepted, changing **N5 from OUT to IN**.

Because the witness is already considered reliable (**N4 is IN**), the system now has a justification for accepting that Oscar made the remark. Therefore, **N3 changes from OUT to IN**.

This removes the justification for N1. The system previously accepted that Oscar was not guilty because he should receive the benefit of the doubt (**N2 is IN**) and the alleged remark had not been established (**N3 was OUT**). Once N3 becomes IN, that justification no longer holds, so **N1 changes from IN to OUT**.

$$
\underbrace{N_5:\mathrm{OUT}\rightarrow\mathrm{IN}}_{\text{New evidence}}
\Rightarrow
\underbrace{N_3:\mathrm{OUT}\rightarrow\mathrm{IN}}_{\text{Acceptance}}
\Rightarrow
\underbrace{N_1:\mathrm{IN}\rightarrow\mathrm{OUT}}_{\text{Retraction}}
$$

**The system has withdrawn its acceptance of “Oscar is not guilty.” It has not thereby established that Oscar is guilty.** Retracting a belief and accepting its negation are different operations.

More importantly, **N2 remains IN**. The principle of giving the accused the benefit of the doubt has not changed; only the evidential conditions supporting the previous conclusion have changed.

This illustrates a fundamental property of non-monotonic reasoning: **new information can invalidate a conclusion without invalidating the principles or other beliefs from which it was previously derived.**

## 3. Coherence: Preserving Beliefs Through Minimal Change

The **coherence approach** focuses on maintaining a logically coherent belief system while minimizing unnecessary changes.

Unlike the foundations approach, coherence does not require a belief to retain its original justification. Instead, it considers whether that belief can be preserved within the revised belief system.

Return to the Tweety example. Withdrawing A as a premise need not require withdrawing B in a theory that does not track derivational pedigrees. For a deductively closed belief set, contraction must also prevent A from being rederived from any remaining premises; it is not just deleting an entry. What is retained depends on the specified contraction or revision policy.

Consequently, the coherence approach favors preserving B when doing so is compatible with the required revision and the overall belief system.

The AGM theory of belief revision exemplifies this approach through formal principles governing rational belief change. <citation key="doyle1992foundationscoherence"></citation>

In this context, coherence can be understood through three central requirements:

1. **Revision Success:** The requested belief change must be achieved.
2. **Consistency:** The revised belief system should remain logically consistent.
3. **Minimal Change:** Existing beliefs should be preserved as much as possible.

These principles summarize the central intuition of coherence-based belief revision, although they do not constitute the complete formal AGM postulates. Consistency preservation also assumes that the incoming information is itself consistent.

Thus, **coherence emphasizes preserving the existing belief system while satisfying new informational requirements.**

## 4. Comparison

| Perspective | Central Question | Primary Requirement |
|---|---|---|
| **Consistency** | Can these beliefs coexist without contradiction? | Logical consistency |
| **Foundations** | Does each accepted belief have a valid justification? | Justification maintenance |
| **Coherence** | Which beliefs can be preserved while satisfying the required change? | Consistency and minimal change |
{: .belief-comparison-table }

These perspectives address different aspects of belief maintenance.

Consistency concerns the logical compatibility of beliefs. Foundations concern the validity of the reasons supporting beliefs. Coherence concerns the rational preservation of beliefs during revision.

Importantly, **foundations and coherence are not necessarily mutually exclusive**. A belief revision system may require valid justifications while also minimizing unnecessary changes among the belief states that satisfy those requirements.

## 5. Implications for Non-Monotonic Reasoning

These distinctions are particularly important for non-monotonic reasoning, where previously accepted conclusions may need to be withdrawn when new information becomes available.

A consistent belief system is not necessarily justification-preserving, and a justification-preserving revision is not necessarily minimal with respect to the original belief set.

For example, retracting a premise may invalidate the justification of a derived belief without logically establishing that the derived belief is false.

A foundations-based system may retract that belief because its support has disappeared. A coherence-based system may preserve it to avoid unnecessary information loss.

Therefore, **the central challenge of non-monotonic belief revision is not merely to eliminate contradictions, but to determine which beliefs must change and which beliefs should remain invariant under a specified revision semantics.**

### Source Note

The foundations–coherence distinction follows Jon Doyle's chapter *Reason maintenance and belief revision: Foundations versus coherence theories*, in Peter Gärdenfors (Ed.), *Belief Revision* (Cambridge University Press, 1992), pp. 29–51. [DOI: 10.1017/CBO9780511526664.002](https://doi.org/10.1017/CBO9780511526664.002). Cambridge's 21 September 2009 date refers to online publication, not the original print year.

The Oscar example is adapted from Gärdenfors, P. (1988), *Knowledge in Flux: Modeling the Dynamics of Epistemic States*, MIT Press, p. 34.
