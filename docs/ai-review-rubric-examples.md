# AI Review Rubric Examples

These examples calibrate the AI paper review score. The score evaluates evidence in the written note, not intelligence or true understanding.

## Seed: 0-39

Very shallow note. Mostly copied title, abstract, or metadata. No own explanation.

Example note pattern:

```md
This paper is about vision-language models.
It proposes a new method and has good results.
Need to read later.
```

Why this stays low:

- No problem framing in the reader's own words.
- No method structure.
- No formula or experiment takeaway.
- No critique, question, or retrieval plan.
- Confidence should be `low` because the note gives little evidence.

Typical next action:

- Add one paragraph explaining the problem and why the paper matters.

## Developing: 40-59

Basic summary. Some understanding is visible, but method, experiments, or questions are missing.

Example note pattern:

```md
The paper tries to make VLM grounding more reliable.
The main idea is to add an auxiliary signal during training.
I think this matters for robust multimodal agents.
```

Why this is developing:

- Problem and core idea are partly visible.
- Method detail is still vague.
- No exact experiment/result supports the claim.
- No weakness or next review question.

Typical next action:

- Add input, output, training objective, and the result that best supports the claim.

## Solid: 60-74

Clear problem and core idea. Some method detail. Limited critical thinking.

Example note pattern:

```md
Problem: the model learns broad image-text correlation but fails on local grounding.
Core idea: use region-level supervision to force token-to-region alignment.
Method: image encoder + text encoder, then contrastive alignment at global and region level.
Main result: the grounding benchmark improves over the baseline, but I need to inspect whether the gain comes from extra data.
Question: would this still help if the region proposals are noisy?
```

Why this is solid:

- Own explanation is present.
- Method has structure.
- One experiment takeaway is identified.
- Critical thinking exists but is limited.
- Formula and research connection may still be shallow.

Typical next action:

- Explain the loss/formula in plain language and connect the paper to a concrete project or research question.

## Strong: 75-89

Good method explanation, formula interpretation, experiment takeaway, and research connection.

Example note pattern:

```md
The objective combines global image-text contrastive loss with a region-token alignment term.
The extra term changes the training signal: the model cannot succeed only by matching image-level captions.
The strongest evidence is the ablation where removing region alignment reduces grounding accuracy while keeping retrieval mostly stable.
Weakness: the paper may rely on proposal quality, so it is unclear how it behaves in open-world scenes.
Connection: this could become a retrieval module for my paper-reading visual index.
Next action: reproduce the ablation with noisy proposals.
```

Why this is strong:

- Formula/objective is interpreted, not copied.
- Method and experiment are connected.
- Weakness is specific.
- Research connection and next action are concrete.

Typical next action:

- Add a small reproduction plan or implementation sketch.

## Excellent: 90-100

The note supports reconstructing the paper from memory. It explains formulas and experiments, critiques assumptions, and identifies next research actions.

Example note pattern:

```md
Closed-book reconstruction:
Input is image regions R and text tokens T. The model optimizes global contrastive loss plus token-region alignment.
The alignment term rewards high similarity for matched token-region pairs and suppresses distractor regions.
If this term is removed, the model can still retrieve captions but loses spatial grounding; the ablation table supports this.
Assumption: the training data contains region labels that are reliable enough to supervise alignment.
Failure mode: noisy or missing region labels could teach wrong grounding.
Research action: implement the loss on a small subset and test with synthetic region corruption.
Retrieval questions:
1. What does the auxiliary loss prevent?
2. Which ablation proves the region term matters?
3. What assumption would break the method?
```

Why this is excellent:

- The paper can be reconstructed from the note.
- Formula, experiment, and critique are integrated.
- Assumptions and failure modes are explicit.
- Next research action is testable.

Typical next action:

- Turn the reproduction sketch into a small experiment or implementation note.

## Pass 1 Calibration

A pass1 note should not be punished for missing pass3-level derivations if it does its job:

- Problem.
- Claim.
- Relevance.
- Decision to continue or stop.
- Questions for pass2.

A clear pass1 note can score in the solid range. It should not score strong or excellent unless it contains unusually strong evidence for method, experiment, and critique.

## Vague Note Warning

Do not over-score notes that sound confident but lack evidence.

High-scoring notes must show specific evidence:

- Named method components.
- Plain-language formula explanation.
- Experiment or ablation that supports the claim.
- Critical limitation.
- Retrieval question or next action.
