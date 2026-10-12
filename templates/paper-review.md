---
title: "{{title}}"
description: "One line: what the reader will understand after reading this."
pubDate: {{date}}
topic: {{topic}}
type: paper-review
tags: []
source:
  kind: paper
  title: "Full title of the paper"
  authors: "First Author et al."
  venue: "Conference, journal or lab"
  year: {{year}}
  url: "https://arxiv.org/abs/0000.00000"
  # code: "https://github.com/org/repo"
tldr: "Two sentences, plain words: what the paper does and why it matters."
takeaways:
  - "First thing to remember."
  - "Second thing to remember."
draft: true
---

Open with the hook: what the paper is, who wrote it, and why you picked it. Two or three sentences.

## Why this paper matters

The problem it addresses and why the existing answers fall short.

## The core idea

> [!KEY]
> The one idea a reader should leave with, in a sentence or two.

Explain it with an analogy before the math.

## How it works

<!--
  To add a figure: put the image in this post's folder, then remove these comment
  markers. The text in quotes becomes the caption under the image.

  ![Describe the diagram for someone who cannot see it](./figure-1.png "Caption: what to notice in this figure")
-->

Inline math looks like $W \in \mathbb{R}^{d \times d}$, and display math like this:

$$
\mathcal{L}(\theta) = -\sum_{t} \log p_\theta(x_t \mid x_{<t})
$$

## What the experiments show

The setup, the headline numbers, and whether they support the claim.

## Limitations and open questions

> [!NOTE]
> Where the evidence is thin, or what the paper does not test.

## My take

What you think, what you would try next, and who should read the paper.
