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

const JacobiIteration = () => {
    const [error, setError] = useState(0.001);
    const [maxIteration, setMaxIteration] = useState(9999);
    const [runTime, setRunTime] = useState<number | null>(null);
    const [result, setResult] = useState<number[]>([]);
    const [array, setArray] = useState<any[]>([]);
    const [sol, setSol] = useState<any[]>([]);

    const jacobi = () => {
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
        
        let solution: any[] = [];
        let array: any[] = [];
        const max_zero = 1e-14;

        let { matrixA, vectorB } = separateMatrix(matrix);
        const startTime = performance.now();
        const n = matrixA.length;
        let x: number[] = InitialX.map(value => value === '' ? 0 : parseFloat(value));
        let x_new: number[] = new Array(n).fill(0);
        let ea: number = 1;
        let k: number = 1;
        console.log(x);
        
        while (ea > error && k < maxIteration) {
            k++;
            // Reset ea for checking max ea
            ea = 0;
        
            for (let i = 0; i < n; i++) {
              let sum = vectorB[i];
              for (let j = 0; j < n; j++) {
                if (i !== j) {
                  sum -= matrixA[i][j] * x[j];
                }
              }
              x_new[i] = sum / matrixA[i][i];
        
              const ea_t = Math.abs((x_new[i] - x[i]) / x_new[i]) * 100;
        
              // Update max ea
              if (ea_t > ea) {
                ea = ea_t;
              }
            }
        
            for (let i = 0; i < n; i++) {
              x[i] = x_new[i];
            }
            console.log(`Iteration ${k}: ${x}`);
            array.push({iter:k});
        }
        
        const endTime = performance.now();
        setRunTime(endTime - startTime);
        console.log(math.clone(x));
        setSol(solution);
        setArray(array);
        setResult(x);
    };

    const handleGetSample = () => {
        const newMatrix = [
            ["5","2","0", "0", "12"], 
            ["2", "5", "2", "0", "17"], 
            ["0", "2", "5", "2", "14"], 
            ["0", "0", "2", "5", "7"]
        ];
        setMatrix(newMatrix);
        setInitialX(['0', '0', '0', '0']);
        setDimension(4);
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
        setInitialX(['', '', '']);
        setDimension(3);
    };

    const [matrix, setMatrix] = useState<string[][]>([
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
    ]);

    const [InitialX, setInitialX] = useState<string[]>(['', '', '']);

    const [dimension, setDimension] = useState<number>(3);

    const handleDimensionChange = (newDimension: number) => {
        setDimension(newDimension);
        const newMatrix = Array.from({ length: newDimension }, () => Array.from({ length: newDimension + 1}, () => ''));
        const newInitialX = Array.from({ length: newDimension }, () => '');
        
        setInitialX(newInitialX);
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
                        <CardTitle>Jacobi Iteration Method</CardTitle>
                        <CardDescription>
                            Find the solution of a system of linear equations using Jacobi Iteration Method
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
                                            onChange={(e) => setMaxIteration(parseFloat(e.target.value))}
                                        />
                                    </div>
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
                <div className='mt-4'><Label>Initial gauss / Start value</Label></div>
                <div className="rounded-md border bg-card w-min mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {InitialX.map((_, i) => (
                                    <TableCell key={i} style={{ width: 40 }} className='text-center'>
                                        {`x${i+1}`}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                {InitialX.map((cell, j) => (
                                    <TableCell key={j} style={{ width: 40 }}>
                                        <Input
                                            className='w-10 h-8 text-center'
                                            type="text"
                                            pattern="-?[0-9]*"
                                            value={InitialX[j]}
                                            placeholder='0'
                                            onChange={(e) => {

                                                const inputValue = e.target.value;
                                                // Use a regular expression to allow only numeric characters
                                                const numericValue = inputValue.replace(/[^-0-9]/g, '');
                                                const newInitialX = [...InitialX];
                                                newInitialX[j] = numericValue;
                                                setInitialX(newInitialX)
                                            }}
                                        />
                                    </TableCell>
                                    ))}
                            </TableRow>
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
                        <Button onClick={jacobi}>Calculate</Button>
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
            ) : (<></>)}
        </div>
    );
};
export default JacobiIteration;


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