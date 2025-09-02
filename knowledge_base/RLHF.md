# Reinforcement Learning from Human Feedback (RLHF)

## Overview
- Machine learning technique that fine-tunes AI models
- Combines Reinforcement Learning (RL) and Human Feedback (HF)
- RL: Agent learns by maximizing rewards
- HF: Direct input from humans to define good outputs
- Suitable for tasks that are difficult to specify but easy to judge
- Human ranking of responses, ranging from simple pairwise comparisons to detailed ratings based on criteria (rubrics)

## Training Stages

### General Process
| Stage | Data Scale | Result | Key Notes |
|-------|------------|--------|-----------|
| **Pretraining** | ~300 billion - 30 trillion tokens | “Unaligned model” that is good at predicting next tokens but not particularly useful or easy to use effectively | Most compute-intensive phase (~98% of total); uses raw text corpora; enables emergent abilities in large models |
| **Supervised Fine-Tuning (SFT)** | ~10,000 - 100,000 datapoints (prompt-response pairs) | Aligned model that performs in a specific way, such as instruction following; may struggle with generalization due to limited data | Builds on pretrained model; uses high-quality, human-curated demonstrations; efficient but prone to overfitting |
| **RLHF** | ~100,000 - 1,000,000+ datapoints (preference comparison pairs) | Further aligned model that generalizes better due to more data | Builds on SFT model; trains reward model on human rankings, then optimizes policy (e.g., via PPO); human feedback is costly but captures nuanced preferences; alternatives like DPO emerging |

### Reward Model Architecture
- Initialized from the SFT language model it aims to improve
- Modified by:
  - Removing the language modeling head
  - Adding a linear classification layer to output a scalar reward score
- Input: Concatenated prompt-response pair

### Training with Reward Model
- Improves the SFT model by:
  - Rewarding responses with high reward scores
  - Ensuring responses do not deviate too much from the SFT model to maintain stability, prevent reward hacking, and avoid overfitting

## Recent Advancements
- Emphasis on quality over quantity (e.g., synthetic data)
- Direct Preference Optimization (DPO)
- Physics-Enabled RLHF
- RL with Verifiers
- Data-centric prompt strategies

## Rubrics
- Less opaque
- Generally results in higher quality data

## Future Directions
- Synthetic data
- RLHF for robotics
- Rubrics and tool usage
- Verifiable-reward training
- Trajectory/Step-wise RLHF (e.g., GRPO or other methods)