import React, { useEffect } from "react";
// import Plotly from "plotly.js-dist-min";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface TrapezoidalRulePlotProps {
  x: number[]; // Array of x values
  y: number[]; // Array of y values
  a: number; // Lower limit of integration
  b: number; // Upper limit of integration
  result: number; // Result of the trapezoidal rule
}

const TrapezoidalRulePlot: React.FC<TrapezoidalRulePlotProps> = ({
  x,
  y,
  a,
  b,
  result,
}) => {
  const data: any = [
    {
      type: "scatter",
      mode: "lines",
      x: x,
      y: y,
      name: "Function",
    },
    {
      type: "scatter",
      mode: "markers",
      x: [a, b],
      y: [0, 0],
      marker: {
        color: "red",
        size: 10,
      },
      name: "Integration Limits",
    },
    {
      type: "scatter",
      mode: "lines",
      x: [a, b],
      y: [0, 0],
      line: {
        color: "green",
        dash: "dash",
      },
      name: "Area under Curve",
    },
  ];

  const layout: any = {
    title: "Trapezoidal Rule",
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
        x0: a,
        x1: b,
        y0: 0,
        y1: result,
        fillcolor: "rgba(0,100,80,0.2)",
        line: {
          width: 0,
        },
      },
    ],
  };

  return (
    <div>
      <h2>Trapezoidal Rule Visualization</h2>
      <Plot
        data={data}
        layout={layout}
        style={{ width: "100%", height: "500px" }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default TrapezoidalRulePlot;
