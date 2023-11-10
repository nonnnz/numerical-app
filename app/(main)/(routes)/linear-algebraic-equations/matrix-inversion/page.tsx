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

const MatrixInversion = () => {
    const [error, setError] = useState(0.000001);
    // const [maxIteration, setMaxIteration] = useState(9999);
    const [runTime, setRunTime] = useState<number | null>(null);
    const [result, setResult] = useState<number[]>([]);
    const [array, setArray] = useState<any[]>([]);
    const [sol, setSol] = useState<any[]>([]);

    const matrixInv = () => {
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
        function generateIdentityMatrix(size: number): number[][] {
            const identityMatrix: number[][] = [];
          
            for (let i = 0; i < size; i++) {
              const row: number[] = [];
              for (let j = 0; j < size; j++) {
                row.push(i === j ? 1 : 0);
              }
              identityMatrix.push(row);
            }
          
            return identityMatrix;
        }
        const startTime = performance.now();
        let { matrixA, vectorB } = separateMatrix(matrix);
        let idv = generateIdentityMatrix(matrixA.length);
        console.log(idv);
        console.log(math.clone(matrixA));
        const n = matrixA.length;
        let A = math.clone(matrixA);
        let solution: any[] = [];
        let array: any[] = [];
        const max_zero = 1e-14;
        solution.push({matrixA: math.clone(A), matrixB: math.clone(idv)});
        // Forward Elimination
        for (let k = 0; k < n - 1; k++) {
            for (let i = k + 1; i < n; i++) {
                const factor = A[i][k] / A[k][k];
                for (let j = k; j < n; j++) {
                    A[i][j] = A[i][j] - factor * A[k][j];
                    A[i][j] = math.abs(A[i][j]) < max_zero ? 0 : A[i][j];
                }

                for(let j = 0; j < n; j++) {
                    idv[i][j] = idv[i][j] - factor * idv[k][j];
                    idv[i][j] = math.abs(idv[i][j]) < max_zero ? 0 : idv[i][j];
                }
                solution.push({matrixA: math.clone(A), matrixB: math.clone(idv)});
            }
        }

        // back eli
        for (let k = n - 1; k > 0; k--) {
            for (let i = k - 1; i >= 0; i--) {
                const factor = A[i][k] / A[k][k];
                for (let j = k; j >= 0; j--) {
                    A[i][j] = A[i][j] - factor * A[k][j];
                    A[i][j] = math.abs(A[i][j]) < max_zero ? 0 : A[i][j];
                }
                for(let j = 0; j < n; j++) {
                    idv[i][j] = idv[i][j] - factor * idv[k][j];
                    idv[i][j] = math.abs(idv[i][j]) < max_zero ? 0 : idv[i][j];
                }
                solution.push({matrixA: math.clone(A), matrixB: math.clone(idv)});
            }
        }

        // normalize to 1
        for (let i = 0; i < n; i++) {
            const factor = A[i][i];
            A[i][i] = A[i][i] / factor; 
            for (let j = 0; j < n; j++) {
                idv[i][j] = idv[i][j] / factor;
                // idv[i][j] = removeZero(idv[i][j]); // remove trailing zeros
            }
            solution.push({matrixA: math.clone(A), matrixB: math.clone(idv)});
        }

        // substitute
        let x: number[] = math.multiply(idv, vectorB) as number[];
        x = x.map((value) => removeZero(value));
        
        const endTime = performance.now();
        setRunTime(endTime - startTime);
        console.log(math.clone(x));
        setSol(solution);
        setArray(x);
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
                        <CardTitle>Matrix Inversion</CardTitle>
                        <CardDescription>
                            Find the solution of a system of linear equations using Matrix Inversion
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
                        <Button onClick={matrixInv}>Calculate</Button>
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
                            <CardTitle>Solution by Matrix Inversion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {sol.map((row, i) => (
                                <div key={i} className="flex flex-col p-4">
                                    <div className='flex flex-row gap-x-1 items-center'>
                                        <Matrix matrix={row.matrixA} size={2} />
                                        <div></div>
                                        <Matrix matrix={row.matrixB} size={3}/>
                                    </div>
                                </div>
                            ))}
                            {array.map((row, i) => (
                                <div key={i} className="flex flex-row gap-4">
                                        <div className="">{`x${i+1} = `}</div>
                                        <div className="">{`${row}`}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </>
            ) : (<></>)}
        </div>
    );
};
export default MatrixInversion;


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
