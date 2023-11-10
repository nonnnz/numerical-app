"use client";

import React, { useState, useEffect } from 'react';
import { Parser } from "expr-eval";
import clsx from "clsx";
import * as math from "mathjs";
import {quadraticInterpolation} from '@/components/quadratic';
import { cubicSplineInterpolation } from '@/components/cubic-spline-interpolation';
import katex from "katex";
import Matrix from '@/app/(main)/_components/matrix';
import { Settings, Plus,  Minus} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
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
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

const SplineInterpolation = () => {
    
    const [error, setError] = useState(0.00001);
    const [maxIteration, setMaxIteration] = useState(9999);
    const [runTime, setRunTime] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [array, setArray] = useState<any[]>([]);
    const [sol, setSol] = useState<any[]>([]);
    const [findMt, setFindMt] = useState<string>('Linear');
    const [find, setFind] = useState<string>('');
    useEffect(() => {
        console.log(findMt);
    }, [findMt]);

    const splineInterpolation = () => {
        let solution: any[] = [];
        let array: any[] = [];
        const max_zero = 1e-14;

        const startTime = performance.now();
        let x: number[] = x_in.map((value) => parseFloat(value));
        let y: number[] = y_in.map((value) => parseFloat(value));
        const pfind = parseFloat(find);
        let n = x.length;
        let result: number = 0;
        if(findMt === 'Linear') {
            for(let i = 0; i < n-1; i++) {
                if(x[i] <= pfind && pfind <= x[i+1]) {
                    result = y[i] + ((y[i+1] - y[i])/(x[i+1] - x[i])) * (pfind - x[i]);
                    break;
                }
            }
        } else if (findMt === 'Quadratic') {
            let data = [];
            for(let i = 0; i < n; i++) {
                data.push({x: x[i], y: y[i]});
            }
            const spline = quadraticInterpolation(data);
            // got a b c
            for(let i = 0; i<n;i++) {
                if(x[i] <= pfind && pfind <= x[i+1]) {
                    result = spline[i].a * Math.pow(pfind,2) + spline[i].b * pfind + spline[i].c;
                    break;
                }
            }
        } else if (findMt === 'Cubic') {
            let data = [];
            for(let i = 0; i < n; i++) {
                data.push({x: x[i], y: y[i]});
            }
            const spline = cubicSplineInterpolation(data);
            for(let i = 0; i<n;i++) {
                if(x[i] <= pfind && pfind <= x[i+1]) {
                    result = spline[i].a * Math.pow(pfind,2) + spline[i].b * pfind + spline[i].c;
                    break;
                }
            }

        }
        array.push({iter: n});
        result = removeZero(result);
        
        const endTime = performance.now();
        setRunTime(endTime - startTime);
        console.log(math.clone(x));
        setSol(solution);
        setArray(array);
        setResult(result);
    };

    const [x_in, setX_in] = useState<string[]>(['', '']);
    const [y_in, setY_in] = useState<string[]>(['', '']);

    const handleGetSample = () => {
        setFind('4.5');
        const newx_in = ['2', '4', '6', '8', '10'];
        const newy_in = ['9.5','8','10.5','39.5','72.5'];

        setX_in(newx_in);
        setY_in(newy_in);
        setDimension(5);
    };

    const resetMt = () => {
        if(findMt === 'Linear') {
            setDimension(2);
            handleDimensionChange(2);
        } else if (findMt === 'Quadratic') {
            setDimension(3);
            handleDimensionChange(3);
        } else {
            setDimension(4);
            handleDimensionChange(4);
        }
    };

    const handleClear = () => {
        const newx_in = ['', ''];
        const newy_in = ['', ''];
        setX_in(newx_in);
        setY_in(newy_in);
        setResult(null);
        setArray([]);
        setSol([]);
        setDimension(2);
        setFind('');
    };

    const [dimension, setDimension] = useState<number>(3);

    const handleDimensionChange = (newDimension: number) => {
        setDimension(newDimension);
        const newX_in = Array.from({ length: newDimension }, () => '');
        const newY_in = Array.from({ length: newDimension }, () => '');
        
        setX_in(newX_in);
        setY_in(newY_in);
    };

    const handleIncrementDimension = () => {
        handleDimensionChange(dimension + 1);
    };

    const handleDecrementDimension = () => {
        if (dimension > 1) {
            handleDimensionChange(dimension - 1);
        }
    };

    function removeZero(value: number) {
        const deci = calculateDecimalPlaces(error);
        const c = Math.pow(10,deci);
        return Math.round(value*c)/c;
    }


    return (
        <div className="h-full flex-1 flex-col  items-center space-y-4 p-8 md:flex">
            <Card className="w-full md:w-[705px] xl:w-[1214px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className='space-y-2'>
                        <CardTitle>Spline Interpolation</CardTitle>
                        <CardDescription>
                            
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
                <div className="rounded-md border bg-card w-min mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell style={{ width: 40 }} className='text-center'>
                                    index
                                </TableCell>
                                <TableCell style={{ width: 40 }} className='text-center'>
                                    x
                                </TableCell>
                                <TableCell style={{ width: 40 }} className='text-center'>
                                    y
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {x_in.map((row, i) => (
                                <>
                                    <TableRow key={i}>
                                        <TableCell style={{ width: 40 }} className='text-center'>
                                            {i+1}
                                        </TableCell>
                                        <TableCell style={{ width: 40 }}>
                                            <Input
                                                className='w-auto h-8 text-center'
                                                type="text"
                                                pattern="-?[0-9]*"
                                                value={x_in[i]}
                                                placeholder='0'
                                                onChange={(e) => {

                                                    const inputValue = e.target.value;
                                                    // Use a regular expression to allow only numeric characters
                                                    const numericValue = inputValue.replace(/[^-0-9]/g, '');
                                                    const newx_in = [...x_in];
                                                    newx_in[i] = numericValue;
                                                    setX_in(newx_in);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell style={{ width: 40 }}>
                                            <Input
                                                className='w-auto h-8 text-center'
                                                type="text"
                                                pattern="-?[0-9]*"
                                                value={y_in[i]}
                                                placeholder='0'
                                                onChange={(e) => {

                                                    const inputValue = e.target.value;
                                                    // Use a regular expression to allow only numeric characters
                                                    const numericValue = inputValue.replace(/[^-0-9]/g, '');
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
                <Button variant="secondary" size="icon" className="m-4" onClick={handleIncrementDimension}><Plus className='w-4 h-4'/></Button>
                <Button variant="secondary" size="icon" onClick={handleDecrementDimension}><Minus className='w-4 h-4'/></Button>
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
                    <Select onValueChange={(selectedValue) => {
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
                    </Select>
                </div>
                

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleClear}>Clear</Button>
                    <div className="flex items-center">
                        <Button className="mr-4" variant="secondary" onClick={handleGetSample}>Get Sample</Button>
                        <Button onClick={splineInterpolation}>Calculate</Button>
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
                                <div className="text-2xl font-bold">{`${result}`}</div>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Time Elapsed</CardTitle>
                        </CardHeader>
                        <CardContent className=''>
                            <div className="text-2xl font-bold">{runTime?.toFixed(2)} ms</div>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Iterations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{array[array.length-1].iter}</div>
                        </CardContent>
                        </Card>
                    </div>
                </>
            ) }
        </div>
    );
};
export default SplineInterpolation;


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