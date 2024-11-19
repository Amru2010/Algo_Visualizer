import React, { useState, useEffect } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/astar';

import './PathfindingVisualizer.css';

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [startNode, setStartNode] = useState({ row: 10, col: 15 });
  const [finishNode, setFinishNode] = useState({ row: 10, col: 75 });
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, []);

  useEffect(() => {
  let interval;
  if (isTiming) {
    interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1); 
    }, 1000);
  } else {
    clearInterval(interval);
  }
  return () => clearInterval(interval);
}, [isTiming]); 


  const startTimer = () => {
    setTimer(0);
    setIsTiming(true);
  };

  const stopTimer = () => {
    setIsTiming(false);
  };

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          stopTimer();
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  };
  const animateAStar = (visitedNodesInOrder, nodesInShortestPathOrder) => {
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder); // Call shortest path animation
      }, 10 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
      if (nodeElement && !node.isStart && !node.isFinish) {
        nodeElement.className = 'node node-visited'; 
      }
    }, 10 * i); 
  }
};

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  };

  const visualizeDijkstra = () => {
    startTimer();
    const startNodeObj = grid[startNode.row][startNode.col];
    const finishNodeObj = grid[finishNode.row][finishNode.col];

    const visitedNodesInOrder = dijkstra(grid, startNodeObj, finishNodeObj);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeObj);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const visualizeAStar = () => {
  const startNodeObj = grid[startNode.row][startNode.col];
  const finishNodeObj = grid[finishNode.row][finishNode.col];

  const visitedNodesInOrder = aStar(grid, startNodeObj, finishNodeObj); // Use A* function
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeObj);

  animateAStar(visitedNodesInOrder, nodesInShortestPathOrder);
};


  const handleReset = () => {
    // Create the initial grid and reset the visited status of all nodes
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
    setStartNode({ row: 10, col: 15 });
    setFinishNode({ row: 10, col: 75 });
    setTimer(0);

    // Reset the visualization of the grid, clearing the colors for visited nodes and path nodes
    resetNodeColors();
  };

  // Helper function to reset the colors of the nodes (i.e., reset to unvisited state)
  const resetNodeColors = () => {
  // Loop through each node in the grid and reset its class name
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);

      // Reset to default 'node' class (unvisited state)
      if (nodeElement) {
        nodeElement.className = 'node';
      }

      // Apply specific classes to start and finish nodes
      if (node.isStart) {
        if (nodeElement) {
          nodeElement.classList.add('node-start'); // Green start node
        }
      } else if (node.isFinish) {
        if (nodeElement) {
          nodeElement.classList.add('node-finish'); // Red finish node
        }
      }
    }
  }
};


  const handleSetStartNode = (row, col) => {
    setStartNode({ row, col });
  };

  const handleSetFinishNode = (row, col) => {
    setFinishNode({ row, col });
  };

  return (
    <>
      <div className="button-container">
        <button className="button" onClick={visualizeDijkstra}>Visualize Dijkstra's Algorithm</button>
        <button className="button" onClick={visualizeAStar}>Visualize A-Star Algorithm</button>
        <button className="button" onClick={handleReset}>Reset</button>
      </div>
      <div className="timer-container">
        <p>Elapsed Time: {timer}s</p>
      </div>
      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.map((node, nodeIdx) => {
              const { row, col, isFinish, isStart, isWall } = node;
              return (
                <Node
                  key={nodeIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                  row={row}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 40; row++) {
    const currentRow = [];
    for (let col = 0; col < 100; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === 10 && col === 15, 
    isFinish: row === 10 && col === 75, 
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default PathfindingVisualizer;
