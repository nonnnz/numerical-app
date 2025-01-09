import React, { useEffect } from "react";
// import Plotly from 'plotly.js-dist-min'
import { config } from "process";
import math from "mathjs";
import { Parser } from "expr-eval";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface MyPlotComponentProps {
  x: number[];
  y: number[];
  xProblem?: number[];
  yProblem?: number[];
  func: string;
}

const MyPlotComponent: React.FC<MyPlotComponentProps> = ({
  x,
  y,
  xProblem,
  yProblem,
  func,
}) => {
  // useEffect(() => {
  //   const data: any = [
  //     {
  //       x: x,
  //       y: y,
  //       type: "scatter",
  //       name: "Data",
  //     },
  //   ];

  //   if (xProblem && yProblem) {
  //     data.push({
  //       x: xProblem,
  //       y: yProblem,
  //       type: "scatter",
  //       name: "Problem Function",
  //     });
  //   }

  //   const parser = new Parser();
  //   function f(x: number) {
  //     const expr = parser.parse(func);
  //     return expr.evaluate({ x: x });
  //   }
  //   // Generate points for plotting
  //   const plotX = [];
  //   const plotY = [];
  //   const step = (Math.max(...x) - Math.min(...x)) / 100;
  //   for (let xi = Math.min(...x); xi <= Math.max(...x); xi += step) {
  //     plotX.push(xi);
  //     plotY.push(f(xi));
  //   }
  //   console.log(step, Math.min(...x), Math.max(...x));
  //   data.push({
  //     x: plotX,
  //     y: plotY,
  //     mode: "lines",
  //     type: "scatter",
  //     name: "Function",
  //   });

  //   Plotly.newPlot("plot", data, {}, { responsive: true });
  // }, [x, y, xProblem, yProblem, func]);
  const data: any = [
    {
      x: x,
      y: y,
      type: "scatter",
      name: "Data",
    },
  ];

  if (xProblem && yProblem) {
    data.push({
      x: xProblem,
      y: yProblem,
      type: "scatter",
      name: "Problem Function",
    });
  }

  const parser = new Parser();
  function f(x: number) {
    const expr = parser.parse(func);
    return expr.evaluate({ x: x });
  }
  // Generate points for plotting
  const plotX = [];
  const plotY = [];
  const step = (Math.max(...x) - Math.min(...x)) / 100;
  for (let xi = Math.min(...x); xi <= Math.max(...x); xi += step) {
    plotX.push(xi);
    plotY.push(f(xi));
  }
  console.log(step, Math.min(...x), Math.max(...x));
  data.push({
    x: plotX,
    y: plotY,
    mode: "lines",
    type: "scatter",
    name: "Function",
  });

  const layout: any = {
    title: "Secant Method",
    xaxis: {
      title: "x",
    },
    yaxis: {
      title: "f(x)",
    },
    shapes: [
      // Highlight the area under the curve
      {
        type: "rect",
        x0: x,
        x1: y,
        y0: 0,
        // y1: result,
        fillcolor: "rgba(0,100,80,0.2)",
        line: {
          width: 0,
        },
      },
    ],
  };
  return (
    <div>
      <h2>Secant Method Visualization</h2>
      <Plot
        data={data}
        layout={layout}
        style={{ width: "100%", height: "500px" }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default MyPlotComponent;
