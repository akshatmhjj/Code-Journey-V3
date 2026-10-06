---
title: Vector Databases
domain: ai
level: intermediate
hours: 10–20
brief: Vector databases store embeddings and find the most similar ones fast - the search engine behind semantic search, recommendations and RAG.
prereqs:
  - llm-apis
learn:
  - topic: Embeddings
    detail: What a vector represents and how embedding models create them.
  - topic: Similarity
    detail: Cosine similarity, dot product and distance.
  - topic: Approximate nearest neighbour
    detail: HNSW and IVF indexes trade a little accuracy for a lot of speed.
  - topic: Metadata filtering
    detail: Search only within a user's documents or a date range.
  - topic: Hybrid search
    detail: Combine vectors with keyword search for better results.
  - topic: Choosing a store
    detail: pgvector in Postgres, or dedicated stores like Qdrant, Pinecone, Weaviate or Chroma.
resources:
  - title: pgvector
    url: https://github.com/pgvector/pgvector
    provider: pgvector
    type: docs
    cost: free
    official: true
  - title: Qdrant documentation
    url: https://qdrant.tech/documentation/
    provider: Qdrant
    type: docs
    cost: free
    official: true
  - title: Chroma documentation
    url: https://docs.trychroma.com/
    provider: Chroma
    type: docs
    cost: free
    official: true
  - title: What is a vector database?
    url: https://www.pinecone.io/learn/vector-database/
    provider: Pinecone
    type: article
    cost: free
checked: 2026-10-06
---

## In plain English

A normal database finds rows where name = "Priya". A vector database finds rows that *mean* something similar to your question, even with different words. That's what makes "search by meaning" possible.

## Start simple

If you already use PostgreSQL, the pgvector extension handles millions of vectors well. Reach for a dedicated store when you outgrow it.
