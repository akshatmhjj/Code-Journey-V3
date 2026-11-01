/** Pure graph traversals for the prep visuals. The graph is undirected, with neighbours listed in alphabetical order. */

export const GRAPH: Record<string, string[]> = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"],
};

/** Breadth-first search: a queue, visiting the nearest nodes first. */
export function bfsOrder(start: string, graph = GRAPH): string[] {
  const seen = new Set([start]);
  const queue = [start];
  const order: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of graph[node]) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}

/** Depth-first search: go as deep as possible before backtracking. */
export function dfsOrder(start: string, graph = GRAPH): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  const visit = (node: string) => {
    seen.add(node);
    order.push(node);
    for (const next of graph[node]) {
      if (!seen.has(next)) visit(next);
    }
  };
  visit(start);
  return order;
}
