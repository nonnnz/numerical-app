"use client";

import React, { useState, useEffect } from 'react';
import { Parser } from "expr-eval";
import clsx from "clsx";
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
} from "@/components/ui/popover"
import { parse } from 'path';

const DividedDifferences = () => {
    const [functionExpression, setFunctionExpression] = useState('');
    const [x0, setX0] = useState('');
    const [_x, setX] = useState('');
    const [error, setError] = useState(0.000001);
    const [maxIteration, setMaxIteration] = useState(9999);
    const [runTime, setRunTime] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [array, setArray] = useState<any[]>([]);
    const [lowerLimit, setLowerLimit] = useState('');
    const [upperLimit, setUpperLimit] = useState('');
    const [numSubintervals, setNumSubintervals] = useState('');
    const [_h, seth] = useState('');
    const [trueError, setTrueError] = useState<number | null>(null);
    const [exact, setExact] = useState<number | null>(null);
    const [method1, setMethod1] = useState('forward divided differences O(h)');
    const [method2, setMethod2] = useState('forward divided differences O(h^2)');
    const [derivativeOrder, setDerivativeOrder] = useState('1st derivative');
    
    function removeZero(value: number) {
        const deci = calculateDecimalPlaces(error);
        const c = Math.pow(10,deci);
        return Math.round(value*c)/c;
    }

    const dividedDifferences = () => {
        console.log(functionExpression);
        const parser = new Parser();
        function f(x: number) {
            const expr = parser.parse(functionExpression);

            // console.log(x+" "+expr);
            return math.evaluate(expr.toString(), {x:x});
        }


        const x = parseFloat(_x);
        const h = parseFloat(_h);
        const startTime = performance.now();

        let result=0;

        const trueValue = math.derivative(functionExpression, 'x').evaluate({x:x});
        if(derivativeOrder === '1st derivative') {
            if(method1 === 'forward divided differences O(h)') {
                result = (f(x+h)-f(x))/h;
            } else if(method1 === 'backward divided differences O(h)') {
                result = (f(x)-f(x-h))/h;
            } else if(method1 === 'central divided differences O(h^2)') {
                result = (f(x+h)-f(x-h))/(2*h);
            } else if(method1 === 'forward divided differences O(h^2)') {
                result = (-3*f(x)+4*f(x+h)-f(x+2*h))/(2*h);
            } else if(method1 === 'backward divided differences O(h^2)') {
                result = (3*f(x)-4*f(x-h)+f(x-2*h))/(2*h);
            }
        } else if(derivativeOrder === '2nd derivative') {
            if(method2 === 'forward divided differences O(h)') {
                result = (f(x+2*h)-2*f(x+h)+f(x))/(h*h);
            } else if(method2 === 'backward divided differences O(h)') {
                result = (f(x)-2*f(x-h)+f(x-2*h))/(h*h);
            } else if(method2 === 'central divided differences O(h^2)') {
                result = (f(x+h)-2*f(x)+f(x-h))/(h*h);
            } else if(method2 === 'forward divided differences O(h^2)') {
                result = (-2*f(x)+5*f(x+h)-4*f(x+2*h)+f(x+3*h))/(h*h);
            } else if(method2 === 'backward divided differences O(h^2)') {
                result = (2*f(x)-5*f(x-h)+4*f(x-2*h)-f(x-3*h))/(h*h);
            } else if(method2 === 'central divided differences O(h^4)') {
                result = (-f(x+2*h)+16*f(x+h)-30*f(x)+16*f(x-h)-f(x-2*h))/(12*h*h);
            }
        }

        const et = (math.abs((trueValue - result))/trueValue) * 100;
        console.log(et);
        const endTime = performance.now();
        setResult(removeZero(result));
        setRunTime(endTime - startTime);
        setTrueError(removeZero(et));
        setExact(removeZero(trueValue));

    };

    const handleGetSample = () => {
        setFunctionExpression('e^x');
        setX('2');
        seth('0.25');
    };

    const handleClear = () => {
        setFunctionExpression('');
        setX('');
        seth('');
        setResult(null);
    };

    return (
        <div className="h-full flex-1 flex-col  items-center space-y-4 p-8 md:flex">
            <Card className="w-full md:w-[705px] xl:w-[1214px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className='space-y-2'>
                        <CardTitle>Divided-Differences</CardTitle>
                        <CardDescription>
                            Find the numerical derivative of a function using divided-differences
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
                            <Label htmlFor="x">x</Label>
                            <Input 
                                id="x" 
                                type='number'
                                placeholder="e.g., 2" 
                                value={_x}
                                onChange={(e) => setX(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="h">h</Label>
                            <Input 
                                id="h"
                                type='number'
                                placeholder="e.g., 8" 
                                value={_h}
                                onChange={(e) => seth(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
                <div className='flex flex-col mt-4 gap-y-4'>
                <Select
                    onValueChange={(selectedValue) => {
                        setDerivativeOrder(selectedValue);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="1st derivative" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1st derivative">1st derivative</SelectItem>
                        <SelectItem value="2nd derivative">2nd derivative</SelectItem>
                    </SelectContent>
                </Select>
                {derivativeOrder === '1st derivative' && (
                    <Select
                        onValueChange={(selectedValue) => {
                            setMethod1(selectedValue);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="forward divided differences O(h)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="forward divided differences O(h)">
                                forward divided differences O(h)
                            </SelectItem>
                            <SelectItem value="backward divided differences O(h)">
                                backward divided differences O(h)
                            </SelectItem>
                            <SelectItem value="central divided differences O(h^2)">
                                central divided differences O(h^2)
                            </SelectItem>
                            <SelectItem value="forward divided differences O(h^2)">
                                forward divided differences O(h^2)
                            </SelectItem>
                            <SelectItem value="backward divided differences O(h^2)">
                                backward divided differences O(h^2)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                )}
                {derivativeOrder === '2nd derivative' && (
                    <Select
                        onValueChange={(selectedValue) => {
                            setMethod2(selectedValue);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="forward divided differences O(h)" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="forward divided differences O(h)">
                                forward divided differences O(h)
                            </SelectItem>
                            <SelectItem value="backward divided differences O(h)">
                                backward divided differences O(h)
                            </SelectItem>
                            <SelectItem value="central divided differences O(h^2)">
                                central divided differences O(h^2)
                            </SelectItem>
                            <SelectItem value="forward divided differences O(h^2)">
                                forward divided differences O(h^2)
                            </SelectItem>
                            <SelectItem value="backward divided differences O(h^2)">
                                backward divided differences O(h^2)
                            </SelectItem>
                            <SelectItem value="central divided differences O(h^4)">
                                central divided differences O(h^4)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                )}
                </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleClear}>Clear</Button>
                    <div className="flex items-center">
                        <Button className="mr-4" variant="secondary" onClick={handleGetSample}>Get Sample</Button>
                        <Button onClick={dividedDifferences}>Calculate</Button>
                    </div>
                </CardFooter>
            </Card>
            
            {result !== null && (
                <>
                    <div className='flex flex-row gap-4 '>
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Result</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{result.toFixed(calculateDecimalPlaces(error))}</div>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Time Elapsed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{runTime?.toFixed(2)} ms</div>
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
                            <CardTitle className="text-sm font-medium">Exact Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{exact?.toFixed(calculateDecimalPlaces(error))}</div>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">True error (%)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{trueError?.toFixed(calculateDecimalPlaces(error))}</div>
                        </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};
export default DividedDifferences;

function calculateDecimalPlaces(value: number) {
    const stringValue = value.toString();
    const decimalIndex = stringValue.indexOf('.');
    if (decimalIndex !== -1) {
      // If the value has a decimal point, count the digits after it
      return stringValue.length - decimalIndex - 1;
    } else {
      // If the value is an integer, return 0
      return 0;
    }
}