"use client";

import React, { useState, useEffect } from "react";
import { Parser } from "expr-eval";
import clsx from "clsx";
import * as math from "mathjs";

import { Settings, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

const NewtonsDividedDifferences = () => {
  const [error, setError] = useState(0.00001);
  const [maxIteration, setMaxIteration] = useState(9999);
  const [runTime, setRunTime] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [array, setArray] = useState<any[]>([]);
  const [sol, setSol] = useState<any[]>([]);
  const [findMt, setFindMt] = useState<string>("Linear");
  const [find, setFind] = useState<string>("");
  useEffect(() => {
    console.log(findMt);
    resetMt();
  }, [findMt]);

  const newtonsDividedDiff = () => {
    let solution: any[] = [];
    let array: any[] = [];
    const max_zero = 1e-14;

    function dividedDifference(
      x: number[],
      y: number[],
      i: number,
      j: number
    ): number {
      if (i === j) {
        return y[i];
      } else {
        return (
          (dividedDifference(x, y, i + 1, j) -
            dividedDifference(x, y, i, j - 1)) /
          (x[j] - x[i])
        );
      }
    }

    const startTime = performance.now();
    let x: number[] = x_in.map((value) => parseFloat(value));
    let y: number[] = y_in.map((value) => parseFloat(value));
    let n = x.length;
    let result: number = 0;

    for (let i = 0; i < n; i++) {
      let temp = dividedDifference(x, y, 0, i);
      for (let j = 0; j < i; j++) {
        temp *= parseFloat(find) - x[j];
      }
      result += temp;
    }

    array.push({ iter: n });
    result = removeZero(result);

    const endTime = performance.now();
    setRunTime(endTime - startTime);
    console.log(math.clone(x));
    setSol(solution);
    setArray(array);
    setResult(result);
  };

  const [x_in, setX_in] = useState<string[]>(["", ""]);
  const [y_in, setY_in] = useState<string[]>(["", ""]);

  const handleGetSample = () => {
    setFind("42235");
    if (findMt === "Linear") {
      const newx_in = ["0", "80000"];
      const newy_in = ["9.81", "9.5682"];
      setX_in(newx_in);
      setY_in(newy_in);
      setDimension(2);
    } else if (findMt === "Quadratic") {
      const newx_in = ["0", "40000", "80000"];
      const newy_in = ["9.81", "9.6879", "9.5682"];
      setX_in(newx_in);
      setY_in(newy_in);
      setDimension(3);
    } else {
      const newx_in = ["0", "20000", "40000", "60000", "80000"];
      const newy_in = ["9.81", "9.7487", "9.6879", "9.6879", "9.5682"];

      setX_in(newx_in);
      setY_in(newy_in);
      setDimension(5);
    }
  };

  const resetMt = () => {
    if (findMt === "Linear") {
      setDimension(2);
      handleDimensionChange(2);
    } else if (findMt === "Quadratic") {
      setDimension(3);
      handleDimensionChange(3);
    } else {
      setDimension(4);
      handleDimensionChange(4);
    }
  };

  const handleClear = () => {
    const newx_in = ["", ""];
    const newy_in = ["", ""];
    setX_in(newx_in);
    setY_in(newy_in);
    setResult(null);
    setArray([]);
    setSol([]);
    setFindMt("Linear");
    setDimension(2);
    setFind("");
  };

  const [dimension, setDimension] = useState<number>(3);

  const handleDimensionChange = (newDimension: number) => {
    setDimension(newDimension);
    const newX_in = Array.from({ length: newDimension }, () => "");
    const newY_in = Array.from({ length: newDimension }, () => "");

    setX_in(newX_in);
    setY_in(newY_in);
  };

  const handleIncrementDimension = () => {
    if (findMt === "Linear" && dimension + 1 > 2) {
      alert("Linear can only have 2 dimension");
      return;
    } else if (findMt === "Quadratic" && dimension + 1 > 3) {
      alert("Quadratic can only have 3 dimension");
      return;
    }
    handleDimensionChange(dimension + 1);
  };

  const handleDecrementDimension = () => {
    if (findMt === "Linear" && dimension + 1 > 2) {
      alert("Linear can only have 2 dimension");
      return;
    } else if (findMt === "Quadratic" && dimension + 1 > 3) {
      alert("Quadratic can only have 3 dimension");
      return;
    }
    if (dimension > 1) {
      handleDimensionChange(dimension - 1);
    }
  };

  function removeZero(value: number) {
    const deci = calculateDecimalPlaces(error);
    const c = Math.pow(10, deci);
    return Math.round(value * c) / c;
  }

  return (
    <div className="h-full flex-1 flex-col  items-center space-y-4 p-8 md:flex">
      <Card className="w-full md:w-[705px] xl:w-[1214px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-2">
            <CardTitle>Newton's Divided-Differences</CardTitle>
            <CardDescription>
              find the value of f({find}) using Newton's Divided-Differences
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Configuration </h4>
                  <p className="text-sm text-muted-foreground">
                    Configure the settings
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="error">Error</Label>
                    <Input
                      id="error"
                      defaultValue={error}
                      className="col-span-2 h-8"
                      onChange={(e) => setError(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxiter">Max Iteration</Label>
                    <Input
                      id="maxiter"
                      defaultValue={maxIteration}
                      className="col-span-2 h-8"
                      onChange={(e) =>
                        setMaxIteration(parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-card w-min mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell style={{ width: 40 }} className="text-center">
                    index
                  </TableCell>
                  <TableCell style={{ width: 40 }} className="text-center">
                    x
                  </TableCell>
                  <TableCell style={{ width: 40 }} className="text-center">
                    y
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {x_in.map((row, i) => (
                  <>
                    <TableRow key={i}>
                      <TableCell style={{ width: 40 }} className="text-center">
                        {i + 1}
                      </TableCell>
                      <TableCell style={{ width: 40 }}>
                        <Input
                          className="w-auto h-8 text-center"
                          type="text"
                          pattern="-?[0-9]*"
                          value={x_in[i]}
                          placeholder="0"
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Use a regular expression to allow only numeric characters
                            const numericValue = inputValue.replace(
                              /[^-0-9]/g,
                              ""
                            );
                            const newx_in = [...x_in];
                            newx_in[i] = numericValue;
                            setX_in(newx_in);
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ width: 40 }}>
                        <Input
                          className="w-auto h-8 text-center"
                          type="text"
                          pattern="-?[0-9]*"
                          value={y_in[i]}
                          placeholder="0"
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Use a regular expression to allow only numeric characters
                            const numericValue = inputValue.replace(
                              /[^-0-9]/g,
                              ""
                            );
                            const newy_in = [...y_in];
                            newy_in[i] = numericValue;
                            setY_in(newy_in);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="m-4"
            onClick={handleIncrementDimension}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleDecrementDimension}
          >
            <Minus className="w-4 h-4" />
          </Button>
          {/* <textarea value={matrix.map((row) => row.join(' ')).join('\n')} onChange={handleMatrixChange} /> */}
          <div className="flex flex-col w-auto gap-4">
            <div className="flex flex-col space-y-1.5 w-[180px]">
              <Label htmlFor="find">Find</Label>
              <Input
                id="find"
                placeholder="e.g., 42235"
                value={find}
                onChange={(e) => setFind(e.target.value)}
              />
            </div>
            <Select
              onValueChange={(selectedValue) => {
                setFindMt(selectedValue);
                // console.log(findMt);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Linear" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Linear">Linear</SelectItem>
                <SelectItem value="Quadratic">Quadratic</SelectItem>
                <SelectItem value="Polynomial">Polynomial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <div className="flex items-center">
            <Button
              className="mr-4"
              variant="secondary"
              onClick={handleGetSample}
            >
              Get Sample
            </Button>
            <Button onClick={newtonsDividedDiff}>Calculate</Button>
          </div>
        </CardFooter>
      </Card>

      {result !== null && (
        <>
          <div className="flex flex-row gap-4 ">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{`${result}`}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Time Elapsed
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <div className="text-2xl font-bold">
                  {runTime?.toFixed(2)} ms
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Iterations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {array[array.length - 1].iter}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
export default NewtonsDividedDifferences;

function calculateDecimalPlaces(value: number) {
  const stringValue = value.toString();
  const decimalIndex = stringValue.indexOf(".");
  if (decimalIndex !== -1) {
    // If the value has a decimal point, count the digits after it
    return stringValue.length - decimalIndex - 1;
  } else {
    // If the value is an integer, return 0
    return 0;
  }
}
