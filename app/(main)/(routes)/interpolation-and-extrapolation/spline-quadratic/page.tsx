"use client";
import React, { useState, useEffect } from "react";
import * as math from "mathjs";
import { Button } from "@/components/ui/button";
import { useConvexAuth, useQuery } from "convex/react";
import { quadraticInterpolation } from "@/components/quadratic";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
// var Plotly = require("plotly.js-dist-min");

const SplineQuad = () => {
  const { user } = useUser();
  const create = useMutation(api.iterpolation.create);
  const iterpolation = useQuery(api.iterpolation.get);

  const [xin, setXin] = useState<string[]>(["", "", "", "", ""]);
  const [yin, setYin] = useState<string[]>(["", "", "", "", ""]);
  const [find, setFind] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [dataPlot, setDataPlot] = useState<any>([]);
  const [plot, setPlot] = useState<any>([]);
  const [dimension, setDimension] = useState<number>(5);
  const sample = () => {
    setXin(["2", "4", "6", "8", "10"]);
    setYin(["9.5", "8", "10.5", "39.5", "72.5"]);
    setFind("4.5");
    setDimension(5);
  };
  const Save = () => {
    const xJsonString = JSON.stringify(xin);
    const yJsonString = JSON.stringify(yin);
    const promise = create({
      x: xJsonString,
      y: yJsonString,
      find: find,
      result: result,
      type: "spline-quadratic",
    });
  };

  const onCreate = (re: string) => {
    //   const xJsonString = JSON.stringify(xin);
    //   const yJsonString = JSON.stringify(yin);
    //   const promise = create({
    //     x: xJsonString,
    //     y: yJsonString,
    //     find: find,
    //     result: re,
    //     type: "spline-quadratic",
    //   });
    // };
  };
  useEffect(() => {
    setDimensionFunc();
  }, [dimension]);

  const cal = () => {
    console.log("tset");
    if (!find) return alert("please enter find value");

    let data = [];
    // let pointx = x ? x.split(' ').map((e) => parseFloat(e)) : [];
    // let pointy = y ? y.split(' ').map((e) => parseFloat(e)) : [];
    let pointx = xin.map((e) => (parseFloat(e) ? parseFloat(e) : 0));
    let pointy = yin.map((e) => (parseFloat(e) ? parseFloat(e) : 0));
    if (pointx.length != pointy.length)
      return alert("x and y must be the same length");
    // const spline = quadraticInterpolation(data);
    for (let i = 0; i < pointx.length; i++) {
      data.push({ x: pointx[i], y: pointy[i] });
    }
    console.log(data);
    const dfind = parseFloat(find);
    const spline = quadraticInterpolation(data);
    console.log(spline);
    function eq(f: number): any {
      var sum;
      for (let i = 0; i < pointx.length; i++) {
        if (pointx[i] <= f && f <= pointx[i + 1]) {
          sum = spline[i].a * Math.pow(f, 2) + spline[i].b * f + spline[i].c;
          return sum;
        }
      }
    }
    let _result = eq(dfind);
    console.log(_result);
    let arr = [];
    for (let i = pointx[0]; i <= pointx[pointx.length - 1]; i += 0.003) {
      arr.push({ x: i, y: eq(i) });
    }
    setPlot(arr);
    setResult(_result.toString());
    setDataPlot(data);
    onCreate(_result.toString());
  };

  const setDimensionFunc = () => {
    if (!dimension) return;
    else if (dimension < 2) return;
    const newsize = [];
    for (let i = 0; i < dimension; i++) {
      newsize.push("");
    }
    setXin(newsize);
    setYin(newsize);
  };

  const [chartData, setChartData] = useState<any[]>([]); // Chart data state

  // Update the chart data whenever `result` changes
  useEffect(() => {
    const trace1 = {
      x: dataPlot.map((e: any) => parseFloat(e.x)),
      y: dataPlot.map((e: any) => parseFloat(e.y)),
      mode: "markers",
      type: "scatter",
      name: "Original Data",
    };

    const trace2 = {
      x: plot.map((e: any) => parseFloat(e.x)),
      y: plot.map((e: any) => parseFloat(e.y)),
      mode: "lines",
      type: "scatter",
      name: "Plot",
    };

    const findTrace = {
      x: [parseFloat(find)],
      y: [result],
      mode: "markers",
      type: "scatter",
      marker: { color: "red" },
      name: "Find Value",
    };

    setChartData([trace1, trace2, findTrace]);
  }, [result, dataPlot, plot, find]);

  const layout = {
    title: "Interpolation Plot",
    responsive: true,
    paper_bgcolor: "#111111",
    font: { color: "#ffffff" },
  };

  const deleteFunction = useMutation(api.iterpolation.remove);

  const handleDelete = (id: string) => {
    console.log(id);
    deleteFunction({ id: id as Id<"iterpolation"> });
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Find the selected item from the dropdown
  const selectedItem = iterpolation?.find((e: any) => e._id === selectedId);

  return (
    <div className="flex flex-col p-8 justify-center">
      <div className="space-y-4">
        {/* Dropdown */}
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => setSelectedId(e.target.value)}
          value={selectedId || ""}
        >
          <option selected value="" disabled>
            Select an item
          </option>
          {iterpolation?.map((e: any) => (
            <option key={e._id} value={e._id}>
              x: {e.x}, y: {e.y}, find: {e.find}, result: {e.result}, date:{" "}
              {new Date(e._creationTime).toUTCString()}
            </option>
          ))}
        </select>

        {/* Action Buttons */}
        <div className="flex pb-4 space-x-4">
          <Button
            onClick={() => {
              if (selectedItem) {
                console.log(selectedItem);
                setXin(JSON.parse(selectedItem.x));
                setYin(JSON.parse(selectedItem.y));
                setFind(selectedItem.find);
                setResult(selectedItem.result);
              }
            }}
          >
            Get
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (selectedId) {
                handleDelete(selectedId);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 border md:w-[750px] bg-[#111111] rounded p-4">
        <h1>Spline Quadratic</h1>
        {/* <div>x</div>
                <input type="text" placeholder='1 2 3 4' value={x} onChange={(e) => setX(e.target.value)}/>
                <div>y</div>
                <input type="text" placeholder='5 6 7 8' value={y} onChange={(e) => setY(e.target.value)} /> */}
        <div>find</div>
        <input
          type="text"
          placeholder="1"
          value={find}
          onChange={(e) => setFind(e.target.value)}
        />
        <div>set n</div>
        <input
          type="text"
          placeholder="1"
          value={dimension}
          onChange={(e) => {
            setDimension(parseFloat(e.target.value));
          }}
        />
        <table>
          <tbody>
            <tr>
              <th>index</th>
              <th>x</th>
              <th>y</th>
            </tr>
            {xin.map((e, i) => (
              <tr className="text-center">
                <td>{i + 1}</td>
                <td>
                  <input
                    type="text"
                    value={xin[i]}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(/[^-0-9.]/g, "");
                      const newx_in = [...xin];
                      newx_in[i] = numericValue;
                      setXin(newx_in);
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={yin[i]}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(/[^-0-9.]/g, "");
                      const newyin = [...yin];
                      newyin[i] = numericValue;
                      setYin(newyin);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button onClick={cal}>calculate</Button>
        {/* <Button onClick={callPlot}>plot</Button> */}
        <Button onClick={Save}>Save</Button>
        <Button onClick={sample}>get example</Button>
      </div>
      <div className="flex flex-col mt-4 space-y-4 border w-min bg-[#111111] rounded p-4">
        <h1>Result</h1>
        <div>{result}</div>
      </div>
      <div className="flex flex-col mt-4 space-y-4 border w-full bg-[#111111] rounded p-4">
        <h1>Plot</h1>
        <Plot
          data={chartData}
          layout={layout}
          style={{ width: "100%", height: "500px" }}
          config={{ responsive: true }}
        />
        {/* <div id="plot"></div> */}
      </div>
    </div>
  );
};

export default SplineQuad;
