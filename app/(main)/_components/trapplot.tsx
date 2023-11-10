import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';

interface TrapezoidalRulePlotProps {
  x: number[]; // Array of x values
  y: number[]; // Array of y values
  a: number; // Lower limit of integration
  b: number; // Upper limit of integration
  result: number; // Result of the trapezoidal rule
}

const TrapezoidalRulePlot: React.FC<TrapezoidalRulePlotProps> = ({ x, y, a, b, result }) => {
  useEffect(() => {
    // console.log(x, y, a, b, result);
    const data = [
      {
        type: 'scatter',
        mode: 'lines',
        x: x,
        y: y,
        name: 'Function',
      },
      {
        type: 'scatter',
        mode: 'markers',
        x: [a, b],
        y: [0, 0],
        marker: {
          color: 'red',
          size: 10,
        },
        name: 'Integration Limits',
      },
      {
        type: 'scatter',
        mode: 'lines',
        x: [a, b],
        y: [0, 0],
        line: {
          color: 'green',
          dash: 'dash',
        },
        name: 'Area under Curve',
      },
    ];

    // Layout configuration
    const layout = {
      title: 'Trapezoidal Rule',
      xaxis: {
        title: 'x',
      },
      yaxis: {
        title: 'f(x)',
      },
      shapes: [
        // Highlight the area under the curve
        {
          type: 'rect',
          x0: a,
          x1: b,
          y0: 0,
          y1: result,
          fillcolor: 'rgba(0,100,80,0.2)',
          line: {
            width: 0,
          },
        },
      ],
    };

    // Display the plot
    Plotly.newPlot('trapezoidalRulePlot', data as Plotly.Data[], layout as Partial<Plotly.Layout>);
  }, [x, y, a, b, result]);

  return <div id="trapezoidalRulePlot" />;
};

export default TrapezoidalRulePlot;
