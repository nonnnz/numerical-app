"use client";

import React, { useState } from "react";
import { Parser } from "expr-eval";
import clsx from "clsx";
import MyPlotComponent from "@/app/(main)/_components/myplot";
import TrapezoidalRulePlot from "@/app/(main)/_components/trapplot";
import * as math from "mathjs";
import { Settings } from "lucide-react";
import {
  TablePagination,
  TablePaginationProps,
} from "@mui/base/TablePagination";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const TrapezoidalRule = () => {
  const [functionExpression, setFunctionExpression] = useState("");
  const [x0, setX0] = useState("");
  const [x, setX] = useState("");
  const [error, setError] = useState(0.000001);
  const [maxIteration, setMaxIteration] = useState(9999);
  const [runTime, setRunTime] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [array, setArray] = useState<any[]>([]);
  const [lowerLimit, setLowerLimit] = useState("");
  const [upperLimit, setUpperLimit] = useState("");
  const [numSubintervals, setNumSubintervals] = useState("");
  const [trueError, setTrueError] = useState<number | null>(null);
  const [exact, setExact] = useState<number | null>(null);

  function removeZero(value: number) {
    const deci = calculateDecimalPlaces(error);
    const c = Math.pow(10, deci);
    return Math.round(value * c) / c;
  }

  const trapezoidalCal = () => {
    console.log(functionExpression);
    const parser = new Parser();
    function f(x: number) {
      const expr = parser.parse(functionExpression);
      // console.log(x+" "+expr);
      return expr.evaluate({ x: x });
    }

    let arr: any[] = [];
    const lower = parseFloat(lowerLimit);
    const upper = parseFloat(upperLimit);
    const n = parseInt(numSubintervals);
    const startTime = performance.now();
    const h = (upper - lower) / n;
    // console.log(h);
    let sum = 0;

    for (let i = 1; i < n; i++) {
      const xi = lower + i * h;
      sum += f(xi);
      arr.push({ x: xi, y: f(xi) });
      console.log(arr);
    }

    // math.evaluate('integrate(4*x^5-3*x^4+x^3-6*x+2, x, 2, 8)')
    const result = (h / 2) * (f(lower) + f(upper) + 2 * sum);

    setResult(result);

    function integrate() {
      var h = (upper - lower) / 50000;
      let sum = 0;

      for (let i = 1; i < 50000; i++) {
        var xi = lower + i * h;
        sum += f(xi);
      }

      const result = (h / 2) * (f(lower) + f(upper) + 2 * sum);

      return result;
    }

    function getPerc(num: number, d: number) {
      return Math.round(num * d) / d;
    }
    setArray(math.clone(arr));
    console.log(math.clone(arr));
    console.log(array);
    const trueValue = integrate();
    const et = (math.abs(trueValue - result) / trueValue) * 100;
    console.log(et);
    const endTime = performance.now();
    setRunTime(endTime - startTime);
    setTrueError(removeZero(et));
    setExact(removeZero(trueValue));
  };

  const handleGetSample = () => {
    setFunctionExpression("4*x^5-3*x^4+x^3-6*x+2");
    setLowerLimit("2");
    setUpperLimit("8");
    setNumSubintervals("5");
  };

  const handleClear = () => {
    setFunctionExpression("");
    setLowerLimit("");
    setUpperLimit("");
    setNumSubintervals("");
    setResult(null);
  };

  return (
    <div className="h-full flex-1 flex-col  items-center space-y-4 p-8 md:flex">
      <Card className="w-full md:w-[705px] xl:w-[1214px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-2">
            <CardTitle>Trapezoidal Rule</CardTitle>
            <CardDescription>
              Find the integral of a function using the trapezoidal rule
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
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="functionExpression">Function</Label>
                <Input
                  id="functionExpression"
                  placeholder="e.g., log(x)"
                  value={functionExpression}
                  onChange={(e) => setFunctionExpression(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lower">Lower limit</Label>
                <Input
                  id="lower"
                  type="number"
                  placeholder="e.g., 2"
                  value={lowerLimit}
                  onChange={(e) => setLowerLimit(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="upper">Upper limit</Label>
                <Input
                  id="upper"
                  type="number"
                  placeholder="e.g., 8"
                  value={upperLimit}
                  onChange={(e) => setUpperLimit(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="upper">Number of subintervals</Label>
                <Input
                  id="sub"
                  type="number"
                  placeholder="e.g., 4"
                  value={numSubintervals}
                  onChange={(e) => setNumSubintervals(e.target.value)}
                />
              </div>
            </div>
          </form>
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
            <Button onClick={trapezoidalCal}>Calculate</Button>
          </div>
        </CardFooter>
      </Card>

      {result !== null && (
        <>
          <div>
            <div className="flex flex-row gap-4 ">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {result.toFixed(calculateDecimalPlaces(error))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Time Elapsed
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Exact Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {exact?.toFixed(calculateDecimalPlaces(error))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    True error (%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {trueError?.toFixed(calculateDecimalPlaces(error))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="rounded-md border bg-card w-full md:w-[705px] xl:w-[1214px]">
            <TrapezoidalRulePlot
              x={array.map((item) => item.x)}
              y={array.map((item) => item.y)}
              a={parseFloat(lowerLimit)}
              b={parseFloat(upperLimit)}
              result={result}
            />
          </div>
        </>
      )}
    </div>
  );
};
export default TrapezoidalRule;

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
