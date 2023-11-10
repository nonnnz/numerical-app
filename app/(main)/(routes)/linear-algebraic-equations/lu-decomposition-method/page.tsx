"use client";

import React, { useState } from 'react';
import { Parser } from "expr-eval";
import clsx from "clsx";
import * as math from "mathjs";
import katex from "katex";
import Matrix from '@/app/(main)/_components/matrix';
import { Settings, Plus,  Minus} from "lucide-react";
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

const LU = () => {
    const [error, setError] = useState(0.000001);
    // const [maxIteration, setMaxIteration] = useState(9999);
    const [runTime, setRunTime] = useState<number | null>(null);
    const [result, setResult] = useState<number[]>([]);
    const [array, setArray] = useState<any[]>([]);
    const [sol, setSol] = useState<any[]>([]);

    const luDecompose = () => {
        function separateMatrix(matrix: string[][]): { matrixA: number[][]; vectorB: number[] } {
            const numRows = matrix.length;
            const numCols = matrix[0].length;
          
            let matrixA: number[][] = [];
            let vectorB: number[] = [];
          
            for (let i = 0; i < numRows; i++) {
              const rowA: number[] = [];
              for (let j = 0; j < numCols - 1; j++) {
                const value = matrix[i][j] !== '' ? parseFloat(matrix[i][j]) || 0 : 0;
                rowA.push(value);
              }
              matrixA.push(rowA);
          
              const lastColumnValue = matrix[i][numCols - 1] !== '' ? parseFloat(matrix[i][numCols - 1]) || 0 : 0;
              vectorB.push(lastColumnValue || 0);
            }
          
            return { matrixA, vectorB };
        }
        function decompose(a: number[][], l: number[][], u: number[][]) {
            const n = a.length;
        
            for (let i = 0; i < n; i++) {
                // Lower
                for (let k = i; k < n; k++) {
                    let sum = 0;
                        for (let j = 0; j < i; j++) {
                            sum += l[k][j] * u[j][i];
                        }
                    l[i][k] = 0;
                    l[k][i] = a[k][i] - sum;
                    console.log(`L(${k + 1}, ${i + 1}) ${a[i][k]} + (${sum})`);
                    solution.push({matrixA: math.clone(l), matrixB: math.clone(u)});
                }
        
                // Upper
                for (let k = i; k < n; k++) {
                    if (i === k) {
                        u[i][i] = 1;
                    } else {
                        let sum = 0;
                        for (let j = 0; j < i; j++) {
                        sum += l[i][j] * u[j][k];
                        }
                        u[k][i] = 0;
                        u[i][k] = (a[i][k] - sum) / l[i][i];
                        console.log(`U(${i + 1}, ${k + 1}) (${a[i][k]} + (${sum})) / ${l[i][i]}`);
                    }
                    solution.push({matrixA: math.clone(l), matrixB: math.clone(u)});
                }
            }
        }
        
        function forwardSubstitution(l: number[][], y: number[], b: number[]) {
            const n = l.length;
            y[0] = b[0] / l[0][0];
        
            for (let i = 1; i < n; i++) {
                let sum = 0;
                for (let j = 0; j < i; j++) {
                sum += l[i][j] * y[j];
                }
                y[i] = (b[i] - sum) / l[i][i];
            }
        }
    
        function backwardSubstitution(u: number[][], y: number[], x: number[]) {
            const n = u.length;
            x[n - 1] = y[n - 1] / u[n - 1][n - 1];
        
            for (let i = n - 2; i >= 0; i--) {
                let sum = 0;
                for (let j = i + 1; j < n; j++) {
                sum += u[i][j] * x[j];
                }
                x[i] = (y[i] - sum) / u[i][i];
            }
        }
        
        let solution: any[] = [];
        let array: any[] = [];
        const max_zero = 1e-14;

        let { matrixA, vectorB } = separateMatrix(matrix);
        const startTime = performance.now();
        const n = matrixA.length;
        const l: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
        const u: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
        const y: number[] = Array(n).fill(0);
        const x: number[] = Array(n).fill(0);
    
        decompose(matrixA, l, u);
        forwardSubstitution(l, y, vectorB);
        backwardSubstitution(u, y, x);
        x.forEach((value, i) => { x[i] = removeZero(value); });
        y.forEach((value, i) => { y[i] = removeZero(value); });

        array.push({x:x, y:y});
        const endTime = performance.now();
        setRunTime(endTime - startTime);
        console.log(math.clone(x));
        setSol(solution);
        setArray(array);
        setResult(x);
    };

    const handleGetSample = () => {
        const newMatrix = [
            ["-2","3","1", "9"], 
            ["3", "4", "-5", "0"], 
            ["1", "-2", "1", "-4"], 
        ];
        setMatrix(newMatrix);
    };

    const handleClear = () => {
        const newMatrix = [
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
        ];
        setMatrix(newMatrix);
        setResult([]);
        setArray([]);
        setSol([]);
    };

    const [matrix, setMatrix] = useState<string[][]>([
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
    ]);

    const [dimension, setDimension] = useState<number>(3);

    const handleDimensionChange = (newDimension: number) => {
        setDimension(newDimension);
        const newMatrix = Array.from({ length: newDimension }, () => Array.from({ length: newDimension + 1}, () => ''));
        
        setMatrix(newMatrix);
        console.log(newMatrix);
    };

    const handleIncrementDimension = () => {
        handleDimensionChange(dimension + 1);
    };

    const handleDecrementDimension = () => {
        if (dimension > 1) {
            handleDimensionChange(dimension - 1);
        }
    };

    // Function to handle arrow key navigation
    const handleArrowKeyNavigation = (i: number, j: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          if (j + 1 < matrix[0].length) {
            // Focus on the next cell in the same row
            const nextInput = document.getElementById(`input-${i}-${j + 1}`);
            if (nextInput) {
              nextInput.focus();
            } else if (i + 1 < matrix.length) {
              // Focus on the first cell of the next row
              const nextInput = document.getElementById(`input-${i + 1}-0`);
              if (nextInput) {
                nextInput.focus();
              }
            }
          }
        } else if (e.key === 'ArrowLeft' && j > 0 && !e.shiftKey) {
        // Focus on the cell to the left
        const prevInput = document.getElementById(`input-${i}-${j - 1}`);
        if (prevInput) {
            prevInput.focus();
        }
        } else if (e.key === 'ArrowRight' && j + 1 < matrix[0].length && !e.shiftKey) {
        // Focus on the cell to the right
        const nextInput = document.getElementById(`input-${i}-${j + 1}`);
        if (nextInput) {
            nextInput.focus();
        }
        } else if (e.key === 'ArrowUp' && i > 0 && !e.shiftKey) {
        // Focus on the cell above
        const aboveInput = document.getElementById(`input-${i - 1}-${j}`);
        if (aboveInput) {
            aboveInput.focus();
        }
        } else if (e.key === 'ArrowDown' && i + 1 < matrix.length && !e.shiftKey) {
        // Focus on the cell below
        const belowInput = document.getElementById(`input-${i + 1}-${j}`);
        if (belowInput) {
            belowInput.focus();
        }
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
                        <CardTitle>LU Decomposition Method</CardTitle>
                        <CardDescription>
                            Find the solution of a system of linear equations using LU Decomposition Method
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
                <div className="rounded-md border bg-card w-min">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {matrix[0].map((_, i) => (
                                    <TableCell key={i} style={{ width: 40 }} className='text-center'>
                                        {i === matrix[0].length - 1 ? 'b' : `x${i+1}`}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {matrix.map((row, i) => (
                                <TableRow key={i}  >
                                    {row.map((cell, j) => (
                                        <TableCell key={j} style={{ width: 40 }}>
                                            <Input
                                                className='w-10 h-8 text-center'
                                                type="text"
                                                pattern="-?[0-9]*"
                                                value={cell}
                                                placeholder='0'
                                                onChange={(e) => {

                                                    const inputValue = e.target.value;
                                                    // Use a regular expression to allow only numeric characters
                                                    const numericValue = inputValue.replace(/[^-0-9]/g, '');
                                                    const newMatrix = [...matrix];
                                                    newMatrix[i][j] = numericValue;
                                                    setMatrix(newMatrix)
                                                }}
                                                onKeyUp={(e) => handleArrowKeyNavigation(i, j, e)}
                                                id={`input-${i}-${j}`}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Button variant="secondary" size="icon" className="m-4" onClick={handleIncrementDimension}><Plus className='w-4 h-4'/></Button>
                <Button variant="secondary" size="icon" onClick={handleDecrementDimension}><Minus className='w-4 h-4'/></Button>
                {/* <textarea value={matrix.map((row) => row.join(' ')).join('\n')} onChange={handleMatrixChange} /> */}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleClear}>Clear</Button>
                    <div className="flex items-center">
                        <Button className="mr-4" variant="secondary" onClick={handleGetSample}>Get Sample</Button>
                        <Button onClick={luDecompose}>Calculate</Button>
                    </div>
                </CardFooter>
            </Card>
            
            {result.length > 0 ? (
                <>
                    <div className='flex flex-row gap-4 '>
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Result</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {result.map((x, i) => (
                                <div key={i} className="text-2xl font-bold">{`x${i+1} = ${removeZero(x)}`}</div>
                            ))}
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
                    </div>
                    <Card className='w-full md:w-[705px] xl:w-[1214px]'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Solution by LU Decomposition Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {sol.map((row, i) => (
                                <div key={i} className="flex flex-col p-4">
                                    <div className='flex flex-row gap-x-1 items-center'>
                                        <div>L =</div>
                                        <Matrix matrix={row.matrixA} />
                                        <div>U =</div>
                                        <Matrix matrix={row.matrixB}/>
                                    </div>
                                </div>
                            ))}
                            {array.map((row, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    {row.y.map((item:number, id:number) => (
                                    <div key={id}>
                                        {`y${id + 1} = `}
                                        {item}
                                    </div>
                                    ))}
                                    {row.x.map((item:number, id:number) => (
                                    <div key={id}>
                                        {`x${id + 1} = `}
                                        {item}
                                    </div>
                                    ))}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </>
            ) : (<></>)}
        </div>
    );
};
export default LU;


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
