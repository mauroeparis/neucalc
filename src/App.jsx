import React, { useCallback, useEffect, useState } from 'react';
import { evaluate } from 'mathjs';

import './css/App.css';

function App() {
  const [keyDown, setKeyDown] = useState();
  const [equation, setEquation] = useState("0");
  const [error, setError] = useState(false);

  const noColorButtonStyle = `
    rounded-lg
    w-16 h-16 mx-3 md:mx-4
    focus:outline-none
    text-xl font-medium
  `;

  const numButtonStyle = val => {
    return `
      ${val === keyDown ? "neo-button-pressed" : "neo-button"}
      ${noColorButtonStyle} text-gray-600
    `
  };
  const SecButtonStyle = val => {
    return `
      ${val === keyDown ? "neo-button-pressed" : "neo-button"}
      ${noColorButtonStyle} text-gray-500
    `
  };
  const opButtonStyle = val => {
    return `
      ${val === keyDown ? "neo-button-pressed-op" : "neo-button"}
      ${noColorButtonStyle} bg-orange-500 text-gray-100
    `
  };
  const eqButtonStyle = val => {
    return `
      ${val === keyDown ? "neo-button-pressed-eq" : "neo-button"}
      ${noColorButtonStyle} bg-blue-500 text-gray-100
    `
  };

  const handleUserKeyDown = useCallback(event => {
    const { key } = event;
    setKeyDown(key);
    setError(false);
    if (key === "=" || key === "Enter") {
      event.preventDefault();
      try {
        setEquation(evaluate(equation));
      } catch {
        setError(true);
      }
    }
  }, [equation]);

  const handleUserKeyUp = useCallback(event => {
    setKeyDown(null);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyDown);
    window.addEventListener('keyup', handleUserKeyUp);

    return () => {
      window.removeEventListener('keydown', handleUserKeyDown);
      window.removeEventListener('keyup', handleUserKeyUp);
    };
  }, [handleUserKeyDown, handleUserKeyUp]);

  const CalcButton = ({ funClass, addStyle, val, customVal }) => {
    return (
      <button
        className={`${funClass(val)} ${addStyle}`}
        onMouseDown={() => {
          setKeyDown(val);
          if (val === "=") {
            try {
              setEquation(evaluate(equation));
            } catch {
              setError(true);
            }
          } else if (val === "AC") {
            setEquation(0);
          } else if (val === "+/-") {
            try {
              setEquation(evaluate(`-1 * (${equation})`));
            } catch {
              setError(true);
            }
          } else if (equation === "0") {
            setEquation(val);
          } else {
            setEquation(equation + val);
          }          
        }}
        onMouseUp={() => setKeyDown(null)}
      >
        {customVal ? customVal : val}
      </button>
    )
  }

  return (
    <div className="flex bg-gray-300 w-full h-screen">
      <div
        className="hidden sm:flex flex-col mt-6 md:mt-12 lg:mt-24 px-6 mx-auto"
      >
        <div className="flex justify-center mx-6">
          <textarea
            className={`
              neo-display
              self-center
              bg-gray-300 text-gray-700
              text-3xl font-semibold
              focus:outline-none
              w-full h-16 sm:h-40 pl-3 md:pl-6 pt-3 md:pt-6
              ${error ? "text-red-700" : ""}
            `}
            onChange={e => setEquation(e.target.value)}
            value={equation}
          >
          </textarea>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col">
            <div className="flex mt-5 md:mt-6">
              <CalcButton funClass={SecButtonStyle} val={"AC"} />
              <CalcButton funClass={SecButtonStyle} val={"+/-"} />
              <CalcButton funClass={SecButtonStyle} val={"%"} />
            </div>

            <div className="flex mt-5 md:mt-6">
              <CalcButton funClass={numButtonStyle} val={"7"} />
              <CalcButton funClass={numButtonStyle} val={"8"} />
              <CalcButton funClass={numButtonStyle} val={"9"} />
            </div>

            <div className="flex mt-5 md:mt-6">
              <CalcButton funClass={numButtonStyle} val={"4"} />
              <CalcButton funClass={numButtonStyle} val={"5"} />
              <CalcButton funClass={numButtonStyle} val={"6"} />
            </div>

            <div className="flex mt-5 md:mt-6">
              <CalcButton funClass={numButtonStyle} val={"1"} />
              <CalcButton funClass={numButtonStyle} val={"2"} />
              <CalcButton funClass={numButtonStyle} val={"3"} />
            </div>

            <div className="flex mt-5 md:mt-6">
              <CalcButton funClass={numButtonStyle} val={"0"} />
              <CalcButton funClass={numButtonStyle} val={"."} />
              <CalcButton funClass={eqButtonStyle} val={"="}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <CalcButton
              funClass={opButtonStyle}
              addStyle={"mt-5 md:mt-6"}
              val={"/"} customVal={"÷"}
            />
            <CalcButton
              funClass={opButtonStyle}
              addStyle={"mt-5 md:mt-6"}
              val={"*"} customVal={"×"}
            />
            <CalcButton
              funClass={opButtonStyle}
              addStyle={"mt-5 md:mt-6"}
              val={"-"}
            />
            <CalcButton
              funClass={opButtonStyle}
              addStyle={"h-40 mt-5 md:mt-6"}
              val={"+"}
            />
          </div>
        </div>
      </div>
      <div className="sm:hidden p-10">
        I'm sorry to inform you that this calculator is not available for
        small devices
      </div>
    </div>
  );
}

export default App;
