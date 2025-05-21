export function generateDirectedGraph(width, depth) {
  const graph = {};
  let nodeCount = 1;

  function createNodeName(index) {
    return 'N' + index;
  }

  function addChildren(parent, currentDepth) {
    if (currentDepth >= depth) return;
    graph[parent] = [];

    for (let i = 0; i < width; i++) {
      const child = createNodeName(nodeCount++);
      graph[parent].push(child);
      addChildren(child, currentDepth + 1);
    }
  }

  const root = createNodeName(0);
  addChildren(root, 0);

  // Ensure all nodes have entries
  Object.values(graph).flat().forEach(child => {
    if (!graph.hasOwnProperty(child)) {
      graph[child] = [];
    }
  });

  return { graph, start: root };
}
