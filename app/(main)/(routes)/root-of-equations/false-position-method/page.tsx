"use client";

import React, { useState } from 'react';
import { Parser } from "expr-eval";
import clsx from "clsx";
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

const FalsePosMethod = () => {
    const [functionExpression, setFunctionExpression] = useState('');
    const [lowerLimit, setLowerLimit] = useState('');
    const [upperLimit, setUpperLimit] = useState('');
    const [error, setError] = useState(0.0001);
    const [maxIteration, setMaxIteration] = useState(9999);
    const [runTime, setRunTime] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [array, setArray] = useState<any[]>([]);

    
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [emptyRows, setEmptyRows] = useState(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - array.length) : 0);

    const falsePosMethod = () => {
        const startTime = performance.now();
        const parser = new Parser();
        function f(x: number) {
            const expr = parser.parse(functionExpression);
            return expr.evaluate({ x: x });
        }

        let array: any[] = [];
        let xl = parseFloat(lowerLimit);
        let xr = parseFloat(upperLimit);
        let x1 = xl;
        let x1old = 0;
        let iter = 0;
        let ea = 1;

        if (f(xl) * f(xr) >= 0) {
            alert("f(xl) and f(xr) must be opposite in sign.");
            return;
        }

        while(ea > error && iter < maxIteration) {
            x1old = x1;
    
            // step 1 find x1
            x1 = (xl * f(xr) - xr * f(xl) ) / (f(xr) - f(xl));
            iter++;
    
            // step 4 check Coverage criteria
            ea = Math.abs((x1 - x1old) / x1) * 100;

            array.push({
                iter: iter,
                x1: x1.toFixed(calculateDecimalPlaces(error)),
                xl: xl.toFixed(calculateDecimalPlaces(error)),
                xr: xr.toFixed(calculateDecimalPlaces(error)),
                y: f(x1).toFixed(calculateDecimalPlaces(error)),
                ea: ea.toFixed(calculateDecimalPlaces(error))
            });
            
            // if f(x1) is root
            if(f(x1) == 0) break;
            // step 2 compute product; step 3 set new
            if (f(x1) * f(xr) > 0) xr = x1;
            else xl = x1;
        }
        const endTime = performance.now();

        setRunTime(endTime - startTime);
        setPage(Math.ceil(array.length / rowsPerPage) - 1);
        setResult(x1);
        setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - array.length) : 0)
        setArray(array);
        console.log(array);
        console.log(page);
        console.log(emptyRows);

    };

    const handleGetSample = () => {
        setFunctionExpression('pow(x, 4) - 13');
        setLowerLimit('1.5');
        setUpperLimit('2.0');
    };

    const handleClear = () => {
        setFunctionExpression('');
        setLowerLimit('');
        setUpperLimit('');
        setRunTime(null);
        setResult(null);
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
                        <CardTitle>False-Position Method</CardTitle>
                        <CardDescription>
                            Find the root of the equation using False-Position Method
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
                                placeholder="e.g., 43 * x - 180" 
                                value={functionExpression}
                                onChange={(e) => setFunctionExpression(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="lowerLimit">Lower Limit</Label>
                            <Input
                            id="lowerLimit"
                            type="number"
                            placeholder="Lower Limit"
                            value={lowerLimit}
                            onChange={(e) => setLowerLimit(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="upperLimit">Upper Limit</Label>
                            <Input
                            id="upperLimit"
                            type="number"
                            placeholder="Upper Limit"
                            value={upperLimit}
                            onChange={(e) => setUpperLimit(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleClear}>Clear</Button>
                    <div className="flex items-center">
                        <Button className="mr-4" variant="secondary" onClick={handleGetSample}>Get Sample</Button>
                        <Button onClick={falsePosMethod}>Calculate</Button>
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
                    </div>
                    <div className="rounded-md border bg-card w-full md:w-[705px] xl:w-[1214px]">
                        <Table className="" aria-label="custom pagination table">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Iteration</TableHead>
                                <TableHead className="">xl</TableHead>
                                <TableHead className="">xr</TableHead>
                                <TableHead className="">x1</TableHead>
                                <TableHead className="">f(x)</TableHead>
                                <TableHead className="">error (%)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(rowsPerPage > 0
                            ? array.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : array
                            ).map((row) => (
                            <TableRow key={row.iter}>
                                <TableCell className=" ">{row.iter}</TableCell>
                                <TableCell className=" " style={{ width: 120 }}>
                                {row.xl}
                                </TableCell>
                                <TableCell className=" " style={{ width: 120 }}>
                                {row.xr}
                                </TableCell>
                                <TableCell className=" " style={{ width: 120 }}>
                                {row.x1}
                                </TableCell>
                                <TableCell className=" " style={{ width: 120 }}>
                                {row.y}
                                </TableCell>
                                <TableCell className=" " style={{ width: 120 }}>
                                {row.ea}
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
export default FalsePosMethod;

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