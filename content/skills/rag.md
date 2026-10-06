---
title: Retrieval-Augmented Generation (RAG)
domain: ai
level: intermediate
hours: 25–40
brief: "RAG lets a language model answer from your own documents: retrieve the most relevant passages, put them in the prompt, and have the model answer - with citations."
prereqs:
  - llm-apis
  - vector-databases
learn:
  - topic: Why RAG
    detail: Models don't know your private or recent data; retrieval gives it to them at question time.
  - topic: Chunking
    detail: Split documents into passages that keep their meaning - by heading, not every 500 characters.
  - topic: Embeddings
    detail: Turn text into vectors so similar meanings sit close together.
  - topic: Retrieval
    detail: Vector search, keyword search (BM25) and hybrid search.
  - topic: Re-ranking
    detail: Re-score the top results for relevance before sending them to the model.
  - topic: Grounded prompts and citations
    detail: Instruct the model to answer only from context and cite sources.
  - topic: Evaluation
    detail: Measure retrieval quality and answer faithfulness separately.
  - topic: Keeping it fresh
    detail: Re-index changed documents automatically.
resources:
  - title: "LangChain: Build a RAG app"
    url: https://python.langchain.com/docs/tutorials/rag/
    provider: LangChain
    type: docs
    cost: free
    official: true
  - title: LlamaIndex documentation
    url: https://docs.llamaindex.ai/en/stable/
    provider: LlamaIndex
    type: docs
    cost: free
    official: true
  - title: pgvector
    url: https://github.com/pgvector/pgvector
    provider: pgvector
    type: docs
    cost: free
    official: true
  - title: Introducing Contextual Retrieval
    url: https://www.anthropic.com/news/contextual-retrieval
    provider: Anthropic
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

Ask a model about your company's refund policy and it will guess. RAG first searches your documents for the relevant passages, then hands them to the model with the question: "answer using only this." Code Journey's own CJ AI is built this way.
