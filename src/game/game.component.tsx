import React, { useState } from "react";
import { emojis } from "./game.emojis";

import "./game.styles.css";

interface IPoint {
  row: number;
  col: number;
  value: string;
}

enum Level {
  Easy = 4,
  Medium = 6,
  Hard = 8,
}

const generateGrids = (size: number) => {
  const arraySize = (size * size) / 2;
  // get the possible emojis
  const emojisList = emojis.slice(0, arraySize);
  // duplicate values to create matches, and shuffle the values
  const arrayValues = [...emojisList, ...emojisList].sort((a, b) => 0.5 - Math.random());
  const grid = [];

  for (let i = 0; i < size; i++) {
    const row = arrayValues.slice(i * size, i * size + size);
    grid.push(row);
  }

  return grid;
};

const generateCoveredGrid = (size: number) => {
  return Array(size)
    .fill(0)
    .map((x) => Array(size).fill(true));
};

export const Game = () => {
  const [grid, setGrid] = useState<Array<string[]>>();
  const [gridCovered, setGridCovered] = useState<Array<boolean[]>>([]);
  const [previousClick, setPreviousClick] = useState<IPoint | undefined>();
  const [completed, setCompleted] = useState<boolean>(false);

  const handleSetGrid = (level: number) => {
    setGrid(generateGrids(level));
    setGridCovered(generateCoveredGrid(level));
  };

  const handleClick = (rowNumber: number, cellNumber: number, value: string) => {
    if (!gridCovered[rowNumber][cellNumber]) return;

    const newGridCovered = [...gridCovered];
    newGridCovered[rowNumber][cellNumber] = false;
    setGridCovered(newGridCovered);

    if (!previousClick) {
      setPreviousClick({
        row: rowNumber,
        col: cellNumber,
        value: value,
      });
      return false;
    }

    const currentPoint: IPoint = {
      row: rowNumber,
      col: cellNumber,
      value: value,
    };

    if (currentPoint.value !== previousClick.value) {
      setTimeout(() => {
        newGridCovered[rowNumber][cellNumber] = true;
        newGridCovered[previousClick.row][previousClick.col] = true;
        setGridCovered([...newGridCovered]);
      }, 1000);
    }

    setPreviousClick(undefined);

    const completed = gridCovered.flat().every((cell) => !cell);
    setCompleted(completed);

    if (completed) {
      // restar the level and go back to choose level screen
      setGrid(undefined);
    }
  };

  return (
    <>
      {!grid && (
        <div className="choose-level-container">
          <div className="title-label">
            <h3>Choose Level</h3>
          </div>
          <div className="level-buttons">
            <button onClick={() => handleSetGrid(Level.Easy)}>Easy</button>
            <button onClick={() => handleSetGrid(Level.Medium)}>Medium</button>
            <button onClick={() => handleSetGrid(Level.Hard)}>Hard</button>
          </div>
        </div>
      )}

      {grid && (
        <div className="game-container">
          {grid.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`cell ${gridCovered[rowIndex][cellIndex] ? "covered" : ""}`}
                  onClick={() => handleClick(rowIndex, cellIndex, cell)}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
