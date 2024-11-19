export function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0; // g(n): cost from the start node to this node
  startNode.heuristic = calculateEuclideanDistance(startNode, finishNode); // h(n): heuristic cost
  startNode.totalCost = startNode.distance + startNode.heuristic; // f(n) = g(n) + h(n)

  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByTotalCost(unvisitedNodes);

    const closestNode = unvisitedNodes.shift();

    // If we encounter a wall, skip it.
    if (closestNode.isWall) continue;

    // If the closest node is at a distance of infinity, stop. We're trapped.
    if (closestNode.totalCost === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // If we reached the finish node, return the visited nodes.
    if (closestNode === finishNode) return visitedNodesInOrder;

    updateUnvisitedNeighborsAStar(closestNode, grid, finishNode);
  }
}

function calculateEuclideanDistance(node, finishNode) {
  return Math.sqrt(
    Math.pow(node.row - finishNode.row, 2) +
      Math.pow(node.col - finishNode.col, 2),
  );
}

function sortNodesByTotalCost(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalCost - nodeB.totalCost);
}

function updateUnvisitedNeighborsAStar(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // g(n): Cost to reach the neighbor node
    const newDistance = node.distance + 1; // Assuming uniform edge weight of 1
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;

      // h(n): Heuristic cost (Euclidean distance to finish node)
      neighbor.heuristic = calculateEuclideanDistance(neighbor, finishNode);

      // f(n) = g(n) + h(n)
      neighbor.totalCost = neighbor.distance + neighbor.heuristic;

      // Set the path
      neighbor.previousNode = node;
    }
  }
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the aStar method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
