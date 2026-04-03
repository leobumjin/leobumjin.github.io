---
layout: distill
title: 'NMR -Description Logic'
description: Nonmonotonic Reasoning
gradient: linear-gradient(135deg, #0064e1 0%, #5bd3ff 100%)
hover-gradient: linear-gradient(135deg, #00c6fb 0%, #005bea 100%)
background_color: rgb(187, 255, 92)
date: 2025-09-03
---

### Introduction to Description Logic (DL)

- **Description Logic (DL)** is a family of formal knowledge representation languages.  
- It is used to describe the structure of a domain in terms of **concepts (classes)**, **roles (properties/relations)**, and **individuals (objects)**.  
- DL forms the logical foundation of ontology languages such as **OWL (Web Ontology Language)**.

**Basic Example:**
- Concepts: `Student`, `Professor`  
- Role: `hasAdvisor`  
- Assertion:  




### ALCF in Description Logic

1. **Recap: ALC**  
   - `ALC` is a core Description Logic that supports:  
     - Boolean constructors: `⊓`, `⊔`, `¬`  
     - Quantifiers on roles: `∀R.C`, `∃R.C`  

2. **F: Functional Roles**  
   - The `F` extension adds **functionality restrictions**.  
   - A role declared as functional can relate an individual to **at most one** filler


### Number Restrictions in Description Logic

1. **Unqualified Number Restrictions (N)**  
   - Restrict only the **number of role fillers**, without specifying their type.  
   - **Syntax:** `≤ n R`, `≥ n R`  
   - **Example:**  
     ```
     Person ⊑ ≤ 2 hasChild
     ```
     → A person can have at most two children (regardless of what kind of children they are).  

2. **Qualified Number Restrictions (Q)**  
   - Restrict the **number of role fillers of a specific concept**.  
   - **Syntax:** `≤ n R.C`, `≥ n R.C`  
   - **Example:**  
     ```
     Person ⊑ ≤ 2 hasChild.Doctor
     ```
     → A person can have at most two children who are doctors (other types of children are unrestricted).  

3. **Relationship between N and Q**  
   - `N` is a **special case** of `Q`:  
     ```
     ≤ n R   ≡   ≤ n R.⊤
     ```
   - Because of this, many modern Description Logic systems (e.g., OWL 2 DL) directly support **Q** as the general form.  


👉 In short:  
- **N** = “how many?” (unqualified)  
- **Q** = “how many of type X?” (qualified)  
- Therefore, **N ⊂ Q**.


---


## Paper List for DL

| A non-monotonic Description Logic for reasoning about typicality | Giodano, 2013 | 
| A Description Logic Framework for Commonsense Conceptual Combination Integrating Typicality, Probabilities and Cognitive Heuristics | Lieto, 2018 | 
| Defeasible Reasoning in Description Logics: An Overview on DL^N | 