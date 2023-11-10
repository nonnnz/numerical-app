import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';

interface LagrangeInterpolationPlotProps {
  x: number[];
  y: number[];
  find?: number;
}

const LagrangeInterpolationPlot: React.FC<LagrangeInterpolationPlotProps> = ({ x, y, find }) => {
  useEffect(() => {
    // Lagrange Interpolating Polynomial
    const lagrangeInterpolation = (xi: number) => {
      let result = 0;
      for (let i = 0; i < x.length; i++) {
        let term = y[i];
        for (let j = 0; j < x.length; j++) {
          if (j !== i) {
            term = term * (xi - x[j]) / (x[i] - x[j]);
          }
        }
        result += term;
      }
      return result;
    };

    // Generate points for plotting
    const plotX = [];
    const plotY = [];
    const step = (Math.max(...x) - Math.min(...x)) / 100;
    for (let xi = Math.min(...x); xi <= Math.max(...x); xi += step) {
      plotX.push(xi);
      plotY.push(lagrangeInterpolation(xi));
    }

    // Plot data
    const data: any = [
      {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        name: 'Original Data',
      },
      {
        x: plotX,
        y: plotY,
        mode: 'lines',
        type: 'scatter',
        name: 'Lagrange Interpolating Polynomial',
      },
    ];

    // Add marker for 'find' value
    if (find !== undefined) {
        data.push({
          x: [find],
          y: [lagrangeInterpolation(find)],
          mode: 'markers',
          type: 'scatter',
          marker: { color: 'red' },
          name: 'Find Value',
        });
    }
    console.log(data);

    // Plot layout
    const layout = {
      title: 'Lagrange Interpolating',
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
    };

    Plotly.newPlot('lagrange-plot', data, layout, { responsive: true });
  }, [x, y, find]);

  return <div id="lagrange-plot" />;
};

export default LagrangeInterpolationPlot;