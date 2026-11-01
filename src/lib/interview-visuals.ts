/** The ids of the pictures a prep concept or question can show. Content files refer to these; components/interview/registry.ts renders them. */
export const VISUAL_IDS = [
  "process-thread",
  "scheduling-gantt",
  "deadlock-cycle",
  "osi-stack",
  "tcp-handshake",
  "url-journey",
  "btree-lookup",
  "isolation-matrix",
  "inheritance-composition",
  "solid-cards",
  "big-o-chart",
  "binary-search",
  "graph-traversal",
] as const;

export type VisualId = (typeof VISUAL_IDS)[number];
