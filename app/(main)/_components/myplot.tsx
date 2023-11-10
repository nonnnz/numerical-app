import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist-min'
import { config } from 'process';
import math from 'mathjs';
import { Parser } from "expr-eval";

interface MyPlotComponentProps {
    x: number[];
    y: number[];
    xProblem?: number[];
    yProblem?: number[];
    func: string;
}

const MyPlotComponent: React.FC<MyPlotComponentProps> = ({ x, y, xProblem, yProblem, func }) => {
  useEffect(() => {
    const data:any = [{
        x: x,
        y: y,
        type: 'scatter',
        name: 'Data',
    }];

    if (xProblem && yProblem) {
        data.push({
          x: xProblem,
          y: yProblem,
          type: 'scatter',
          name: 'Problem Function',
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
        mode: 'lines',
        type: 'scatter',
        name: 'Function',
    });

    Plotly.newPlot('plot', data, {}, { responsive: true });
  }, [x, y, xProblem, yProblem, func]);

  return <div id="plot"/>;
};

export default MyPlotComponent;