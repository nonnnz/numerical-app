"use client";

import React, { useState } from 'react';
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

const TaylorSeries = () => {
    const [functionExpression, setFunctionExpression] = useState('');
    const [x0, setX0] = useState('');
    const [x, setX] = useState('');
    const [error, setError] = useState(0.000001);
    const [maxIteration, setMaxIteration] = useState(9999);
    const [runTime, setRunTime] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [exactValue, setExactValue] = useState<number | null>(null);
    const [array, setArray] = useState<any[]>([]);

    
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [emptyRows, setEmptyRows] = useState(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - array.length) : 0);

    const taylorSeries = () => {
        const startTime = performance.now();
        const parser = new Parser();
        function f(x: number) {
            const expr = parser.parse(functionExpression);
            return expr.evaluate({ x: x });
        }

        // function df(x: number) {
        //             const df = math.derivative(functionExpression, 'x').evaluate({ x: x }) ;
        //             // const expr = parser.parse(df);
        //             return df;
        //         }

        let array: any[] = [];
        let x_ = parseFloat(x);
        let x0_ = parseFloat(x0);
        let sum = f(x0_);
        let true_error = f(x_);
        let iter = 0;
        let ea = 1;
        let et = math.abs((true_error - sum) / true_error) * 100;
        let n=1;
        let df = math.derivative(functionExpression, 'x');
        array.push({iter: iter, y: sum.toFixed(calculateDecimalPlaces(error)), et: et.toFixed(calculateDecimalPlaces(error))});
        while(et > error && iter < maxIteration) {
            // console.log(df.evaluate({ x: x0_ }));
            // console.log(Math.pow((x_-x0_),n));
            sum += Math.pow((x_-x0_),n) / math.factorial(n) * df.evaluate({ x: x0_ });
            if (isNaN(sum)) break;
            n++;
            iter++;
            et = math.abs((true_error - sum) / true_error) * 100;
            array.push({iter: iter, y: sum.toFixed(calculateDecimalPlaces(error)), et: et.toFixed(calculateDecimalPlaces(error))});

            df = math.derivative(df, 'x');
        }
        const endTime = performance.now();
        if (isNaN(sum)) {
            alert("Error! Infinite loop detected. Please try again");
        }
        setRunTime(endTime - startTime);
        setPage(Math.ceil(array.length / rowsPerPage) - 1);
        setResult(sum);
        setExactValue(true_error);
        setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - array.length) : 0)
        setArray(array);
        console.log(array);
        console.log(page);
        console.log(emptyRows);

    };

    const handleGetSample = () => {
        setFunctionExpression('log(x)');
        setX('4');
        setX0('3');
    };

    const handleClear = () => {
        setFunctionExpression('');
        setRunTime(null);
        setResult(null);
        setX0('');
        setX('');
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="h-full flex-1 flex-col  items-center space-y-4 p-8 md:flex">
            <Card className="w-full md:w-[705px] xl:w-[1214px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className='space-y-2'>
                        <CardTitle>Taylor series</CardTitle>
                        <CardDescription>
                            Find the f(x) using Taylor series
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
                            <Label htmlFor="x">Value of x</Label>
                            <Input 
                                id="x" 
                                placeholder="e.g., 2" 
                                value={x}
                                onChange={(e) => setX(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="lowerLimit">Initial guess of x0</Label>
                            <Input
                            id="x0"
                            type="number"
                            placeholder="Initial guess"
                            value={x0}
                            onChange={(e) => setX0(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleClear}>Clear</Button>
                    <div className="flex items-center">
                        <Button className="mr-4" variant="secondary" onClick={handleGetSample}>Get Sample</Button>
                        <Button onClick={taylorSeries}>Calculate</Button>
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
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Iterations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{array[array.length-1].iter}</div>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Exact Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{exactValue?.toFixed(calculateDecimalPlaces(error))}</div>
                        </CardContent>
                        </Card>
                    </div>
                    <div className="rounded-md border bg-card w-full md:w-[705px] xl:w-[1214px]">
                        <Table className="" aria-label="custom pagination table">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Iteration</TableHead>
                                <TableHead className="">f(x)</TableHead>
                                <TableHead className="">true error (%)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(rowsPerPage > 0
                            ? array.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : array
                            ).map((row, index) => (
                            <TableRow key={row.iter}>
                                <TableCell className=" ">{row.iter}</TableCell>
                                <TableCell className=" " style={{ width: 120 }}>
                                {row.y}
                                </TableCell>
                                <TableCell className=" " style={{ width: 120 }}>
                                {row.et}
                                </TableCell>
                            </TableRow>
                            ))}

                            {emptyRows > 0 && (
                            <TableRow style={{ height: 34 * emptyRows }}>
                                <TableCell className=" " colSpan={3} aria-hidden />
                            </TableRow>
                            )}
                        </TableBody>
                        <tfoot>
                            <TableRow className=" ">
                            <CustomTablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                colSpan={3}
                                count={array.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                select: {
                                    "aria-label": "rows per page",
                                },
                                actions: {
                                    showFirstButton: true,
                                    showLastButton: true,
                                },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            </TableRow>
                        </tfoot>
                        </Table>
                    </div>
                </>
            )}
        </div>
    );
};
export default TaylorSeries;

const resolveSlotProps = (fn: any, args: any) =>
  typeof fn === "function" ? fn(args) : fn;

const CustomTablePagination = React.forwardRef<
  HTMLTableCellElement,
  TablePaginationProps
>((props, ref) => {
  return (
    <TablePagination
      ref={ref}
      {...props}
      className={clsx("CustomTablePagination p-1.5", props.className)}
      slotProps={{
        ...props.slotProps,
        select: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.select,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx(
              "p-0.5 border border-solid border-slate-200 dark:border-slate-800 rounded-3xl bg-transparent hover:bg-slate-20 hover:dark:bg-slate-800 focus:outline-0 focus:shadow-outline-purple-xs",
              resolvedSlotProps?.className
            ),
          };
        },
        actions: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.actions,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx(
              "p-0.5 border border-solid border-slate-200 dark:border-slate-800 rounded-3xl text-center [&>button]:my-0 [&>button]:mx-2 [&>button]:border-transparent [&>button]:rounded-sm [&>button]:bg-transparent [&>button:hover]:bg-slate-50 [&>button:hover]:dark:bg-slate-800 [&>button:focus]:outline-0 [&>button:focus]:shadow-outline-purple-xs",
              resolvedSlotProps?.className
            ),
          };
        },
        spacer: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.spacer,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx("hidden", resolvedSlotProps?.className),
          };
        },
        toolbar: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.toolbar,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx(
              "flex flex-col items-start gap-2.5 md:flex-row md:items-center",
              resolvedSlotProps?.className
            ),
          };
        },
        selectLabel: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.selectLabel,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx("m-0", resolvedSlotProps?.className),
          };
        },
        displayedRows: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.displayedRows,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx("m-0 md:ml-auto", resolvedSlotProps?.className),
          };
        },
      }}
    />
  );
});

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