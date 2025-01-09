"use client";

import React, { useState, useEffect } from "react";
import { Parser } from "expr-eval";
import clsx from "clsx";
import * as math from "mathjs";
import katex from "katex";
import Matrix from "@/app/(main)/_components/matrix";
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

const MultipleLinearRegression = () => {
  const [error, setError] = useState(0.00001);
  const [maxIteration, setMaxIteration] = useState(9999);
  const [runTime, setRunTime] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [array, setArray] = useState<any[]>([]);
  const [sol, setSol] = useState<any[]>([]);
  // const [findMt, setFindMt] = useState<string>('Linear');
  const [find, setFind] = useState<string>("");
  const [findArr, setFindArr] = useState<string[]>(["", "", ""]);
  // useEffect(() => {
  //     console.log(findMt);
  // }, [findMt]);

  const multipleLinearRegression = () => {
    let solution: any[] = [];
    let array: any[] = [];
    const max_zero = 1e-14;

    const startTime = performance.now();
    let x: number[][] = math
      .clone(x_in)
      .map((row) => row.map((value) => parseFloat(value)));
    let y: number[] = y_in.map((value) => parseFloat(value));
    const pfind: number[] = findArr.map((value) => parseFloat(value));
    // let n = x.length;
    let result: number = 0;

    const m = x.length; // order
    const n = x[0].length;
    const a = new Array(m + 1)
      .fill(null)
      .map(() => new Array(m + 2).fill(null));

    for (let i = 0; i <= m; i++) {
      let sumP = 0;

      for (let l = 0; l < n; l++) {
        if (i > 0) {
          sumP += x[i - 1][l] * x[i - 1][l];
        }
      }

      if (i > 0) {
        a[i][i] = sumP;
      } else {
        a[i][i] = n;
      }

      for (let j = 0; j < i; j++) {
        let sum = 0;

        for (let l = 0; l < n; l++) {
          if (j > 0) {
            sum += x[i - 1][l] * x[j - 1][l];
          } else {
            sum += x[i - 1][l];
          }
        }

        a[i][j] = sum;
        a[j][i] = sum;
      }

      let sum = 0;

      for (let l = 0; l < n; l++) {
        if (i > 0) {
          sum += y[l] * x[i - 1][l];
        } else {
          sum += y[l];
        }
      }

      a[i][m + 1] = sum;
    }

    console.log(a);

    var rref = require("rref");
    const mt = rref(a);

    console.log(mt);

    const eq = [];
    for (let i = 0; i < m + 1; i++) {
      eq.push(mt[i][m + 1]);
    }

    console.log(math.clone(eq), m);

    let ans = 0;
    for (let i = 0; i < m + 1; i++) {
      if (i > 0) ans += eq[i] * pfind[i - 1];
      else ans += eq[i];
    }

    result = ans;

    // const mt = math.matrix(a);

    // console.log(mt);
    // const { rref } = math;
    // const [m_rref] = rref(mt); // reduced row echelon form
    // const rrefNumeric = math.evaluate(m_rref);
    // console.log(rrefNumeric);

    // const eq = [];
    // for (let i = 1; i <= m + 1; i++) {
    //     eq.push(rrefNumeric[(m + 1) * i + (i - 1)]);
    //     console.log(`a[${i - 1}] = ${removeZero(eq[i - 1])}`);
    // }

    // let ans = 0;
    // for (let i = 0; i <= m; i++) {
    //     ans += eq[i] * Math.pow(find, i);
    // }
    // console.log(removeZero(ans));

    array.push({ iter: n });
    result = removeZero(result);

    const endTime = performance.now();
    setRunTime(endTime - startTime);
    setSol(solution);
    setArray(array);
    setResult(result);
  };

  const [x_in, setX_in] = useState<string[][]>(() => {
    const [initialRows, initialCols] = [3, 3];
    return Array(initialRows)
      .fill(null)
      .map(() => Array(initialCols).fill(""));
  });

  const [y_in, setY_in] = useState<string[]>(() => {
    const initialRows = 3;
    return Array(initialRows).fill("");
  });

  const handleGetSample = () => {
    setFind("65");
    const newx_in = [
      ["1", "0", "2", "3", "4", "2", "1"],
      ["0", "1", "4", "2", "1", "3", "6"],
      ["1", "3", "1", "2", "5", "3", "4"],
    ];
    const newy_in = ["4", "-5", "-6", "0", "-1", "-7", "-20"];
    const newfind = ["1", "6", "4"];

    // Ensure x_in and y_in are updated according to the new dimension
    setX_in(newx_in);
    setY_in(newy_in);
    setFindArr(newfind);

    // Adjust dimension according to the new sample data
    setDimension([newx_in.length, newx_in[0].length]); // Update dimension to match the rows in newx_in
    console.log(newx_in.length);
    console.log(newy_in.length);
  };

  const handleClear = () => {
    // Set x_in and y_in to match the default size
    const newx_in = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    const newy_in = ["", "", ""];

    setX_in(newx_in);
    setY_in(newy_in);
    setResult(null);
    setArray([]);
    setSol([]);
    setDimension([3, 3]); // Ensure the dimension is in sync with the x_in length
    setFind("");
    setFindArr(["", "", ""]);
  };

  //   const [dimension, setDimension] = useState<number>(3);

  //   const handleDimensionChange = (newDimension: number) => {
  //     setDimension(newDimension);
  //     const newX_in = Array.from({ length: newDimension }, (_, i) => {
  //       if (i < dimension) {
  //         return x_in[i];
  //       } else {
  //         return Array.from({ length: newDimension }, () => "");
  //       }
  //     });
  //     const newY_in = Array.from({ length: newDimension }, () => "");

  //     setX_in(newX_in);
  //     setY_in(newY_in);
  //   };

  //   const handleIncrementDimension = () => {
  //     handleDimensionChange(dimension + 1);
  //   };

  //   const handleDecrementDimension = () => {
  //     if (dimension > 1) {
  //       handleDimensionChange(dimension - 1);
  //     }
  //   };
  const [dimension, setDimension] = useState<[number, number]>([3, 3]);

  const handleDimensionChange = (newDimension: number) => {
    setDimension([newDimension, dimension[1]]);
  };

  const handleIncrementDimension = () => {
    handleDimensionChange(dimension[0] + 1);
  };

  const handleDecrementDimension = () => {
    if (dimension[0] > 1) {
      handleDimensionChange(dimension[0] - 1);
    }
  };

  // Effect to update x_in and y_in when dimension changes
  useEffect(() => {
    const numRows = dimension[0];
    const numCols = dimension[1];
    console.log(dimension);

    // Adjust x_in to match the new dimension
    // const newX_in = Array.from({ length: numRows }, (_, i) => {
    //   if (i < x_in.length) {
    //     return x_in[i].slice(0, numCols); // Ensure each row has numCols columns
    //   } else {
    //     return Array.from({ length: numCols }, () => ""); // Add new rows if needed
    //   }
    // });

    // const newX_in = Array(numRows)
    //   .fill(null)
    //   .map(() => Array(numCols).fill(""));
    const newX_in = Array.from({ length: numRows }, (_, i) => {
      if (i < x_in.length) {
        return x_in[i].slice(0, numCols); // Ensure each row has numCols columns
      } else {
        return Array.from({ length: numCols }, () => ""); // Add new rows if needed
      }
    });

    // normalize newX_in make sure it has the same number of columns
    newX_in.forEach((row) => {
      while (row.length < numCols) {
        row.push("");
      }
    });

    // Adjust y_in to match the new number of rows (numRows)
    // const newY_in = Array(numRows).fill(""); // Empty values for y_in
    // const newY_in = Array.from({ length: numRows }, (_, i) => {
    //   if (i < y_in.length) {
    //     return y_in[i];
    //   } else {
    //     return "";
    //   }
    // });
    const newY_in = y_in;
    newY_in.forEach((col) => {
      while (newY_in.length < numCols) {
        newY_in.push("");
      }
    });

    const new_find = findArr;
    new_find.forEach((col) => {
      while (new_find.length < numRows) {
        new_find.push("");
      }
    });
    if (new_find.length > numRows) {
      new_find.splice(numRows, new_find.length - numRows);
    }
    if (newY_in.length > numCols) {
      newY_in.splice(numCols, newY_in.length - numCols);
    }
    setX_in(newX_in);
    setY_in(newY_in);
    setFindArr(new_find);

    console.log("Dimensions:", numRows, "x", numCols);
    console.log("New x_in:", newX_in);
    console.log("New y_in:", newY_in);
    console.log(x_in, y_in);
  }, [dimension]); // Trigger when dimension changes

  const [dimensionV, setDimensionV] = useState<number>(3);

  const handleDimensionChangeV = (newDimension: number) => {
    // setDimensionV(newDimension);
    // const newX_in = Array.from(Array(dimension), () =>
    //   new Array(dimensionV).fill("")
    // );
    // // console.log(newX_in, dimension, dimensionV);

    // const newY_in = Array.from({ length: newDimension }, () => "");

    // setX_in(newX_in);
    // setY_in(newY_in);
    setDimension([dimension[0], newDimension]);
  };

  const handleIncrementDimensionV = () => {
    handleDimensionChangeV(dimension[1] + 1);
  };

  const handleDecrementDimensionV = () => {
    if (dimension[1] > 1) {
      handleDimensionChangeV(dimension[1] - 1);
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
            <CardTitle>Multiple Linear Regression</CardTitle>
            <CardDescription>
              find the value of f({find}) using Multiple Linear Regression
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
                  {/* <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="maxiter">Max Iteration</Label>
                                        <Input
                                            id="maxiter"
                                            defaultValue={maxIteration}
                                            className="col-span-2 h-8"
                                            onChange={(e) => setMaxIteration(parseFloat(e.target.value))}
                                        />
                                    </div> */}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-card w-full mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell style={{ width: 40 }} className="text-center">
                    index
                  </TableCell>
                  {x_in.map((row, i) => (
                    <TableCell style={{ width: 40 }} className="text-center">
                      x{i + 1}
                    </TableCell>
                  ))}
                  <TableCell style={{ width: 40 }} className="text-center">
                    y
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {x_in[0].map((row, i) => (
                  <>
                    <TableRow key={i}>
                      <TableCell style={{ width: 40 }} className="text-center">
                        {i + 1}
                      </TableCell>
                      {x_in.map((col, j) => (
                        <TableCell style={{ width: 40 }}>
                          <Input
                            className=" w-full h-8 text-center"
                            type="text"
                            pattern="-?[0-9]*"
                            value={x_in[j][i]}
                            placeholder="0"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Use a regular expression to allow only numeric characters
                              const numericValue = inputValue.replace(
                                /[^-0-9]/g,
                                ""
                              );
                              const newx_in = [...x_in];
                              newx_in[j][i] = numericValue;
                              setX_in(newx_in);
                            }}
                          />
                        </TableCell>
                      ))}
                      <TableCell style={{ width: 40 }}>
                        <Input
                          className="w-full h-8 text-center"
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
          <div className="flex justify-start p-4">
            <div className="p-4 ">
              <Button
                variant="secondary"
                size="icon"
                className="mr-4"
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
            </div>

            <div className="flex flex-col ml-4 gap-4">
              <Button
                variant="secondary"
                size="icon"
                className=""
                onClick={handleIncrementDimensionV}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleDecrementDimensionV}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* <textarea value={matrix.map((row) => row.join(' ')).join('\n')} onChange={handleMatrixChange} /> */}
          <div className="flex flex-col w-auto gap-4">
            <div className="flex flex-col space-y-1.5 w-[180px]">
              <Label htmlFor="find">Find</Label>
              {findArr.map((row, i) => (
                <Input
                  id="find"
                  placeholder="e.g., 1"
                  value={findArr[i]}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Use a regular expression to allow only numeric characters
                    const numericValue = inputValue.replace(/[^-0-9]/g, "");
                    const newy_in = [...findArr];
                    newy_in[i] = numericValue;
                    setFindArr(newy_in);
                  }}
                />
              ))}
            </div>
            {/* <Select onValueChange={(selectedValue) => {
                    setFindMt(selectedValue);
                    // console.log(findMt);
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Linear" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Linear">Linear</SelectItem>
                            <SelectItem value="Quadratic">Quadratic</SelectItem>
                            <SelectItem value="Cubic">Cubic</SelectItem>
                        </SelectContent>
                    </Select> */}
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
            <Button onClick={multipleLinearRegression}>Calculate</Button>
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
            {/* <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Iterations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{array[array.length-1].iter}</div>
                        </CardContent>
                        </Card> */}
          </div>
        </>
      )}
    </div>
  );
};
export default MultipleLinearRegression;

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
