'use client'

import React, { Component, useState } from 'react';
// Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
// import {  TablePagination, tablePaginationClasses as classes, styled} from '@mui/material';
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

interface BisectionProps {}

interface BisectionState {
    XL: string;
    XR: string;
    func: string;
    er: string;
    page: number;
    setPage: number;
    rowsPerPage: number;
    setRowsPerPage: number;
}

class Bisection extends Component<BisectionProps, BisectionState> {
  constructor(props: BisectionProps) {
    super(props);
    this.state = { XL: '', XR: '', func: '' , er: '', page: 0, setPage:0 ,rowsPerPage: 5, setRowsPerPage: 5};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  BisectionCalcFunction(XL: string, XR: string, Funct: string, er: string) {
    const parser = new Parser();
    function fx(x: number) {
        try {
            const expr = parser.parse(Funct);
            console.log("fx = "+expr.evaluate({ x: (x) }));
            return expr.evaluate({ x: x });
        } catch (error) {
            console.error(error);
            return NaN;
        }
    }
  
    var xl = parseInt(XL);
    const es = parseFloat(er);
    const arr = [];
    var xmold;
    var xm = xl;
    var xr = parseInt(XR);
    var iter = 0;
    var ea = 1;
    console.log(es);
    while(ea > es) {
        if(es == 0) break;
        xmold = xm;
        xm = (xl + xr) / 2;

        ea = Math.abs((xm - xmold) / xm) * 100;

        if(fx(xm) * fx(xr) > 0) xr = xm;
        else xl = xm;
        iter++;
        arr[iter] = ({iter:iter,x:xm, y:fx(xm),error:ea});
    }
    console.log(arr);

    function getPerc(num: number) {
      return Math.round(num*1000000)/1000000;;
    }

    const { page, setPage } = this.state;
    const {rowsPerPage, setRowsPerPage} = this.state;
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arr.length) : 0;

    const lastPage = () => {
        const newPage = Math.max(0, Math.ceil(arr.length / rowsPerPage) - 1);
        this.setState({ page: newPage });
        }
    console.log(lastPage);
    const handleChangePage = (event: any, newPage: any) => {
        this.setState({ page: newPage });
      };
    
    const handleChangeRowsPerPage = (event: any) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        this.setState({
          rowsPerPage: newRowsPerPage,
          page: 0, // Reset page to 0 when changing rows per page
        });
      };

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

    return (
      <div className="rounded-md border bg-card w-full md:w-[705px] xl:w-[1214px]">
        <Table className="" >
          <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">Iter</TableHead>
                <TableHead className="">X</TableHead>
                <TableHead className="">Y</TableHead>
                <TableHead className="">Error (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(rowsPerPage > 0
                ? arr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : arr
            ).map((item, index) => (
              <TableRow key={item.x}>
                <TableCell className="" style={{ width: 120 }}>{item.iter}</TableCell>
                <TableCell className="" style={{ width: 120 }}>{getPerc(item.x)}</TableCell>
                <TableCell className="" style={{ width: 120 }}>{getPerc(item.y)}</TableCell>
                <TableCell className="" style={{ width: 120 }}>{getPerc(item.error)}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
            <TableRow style={{ height: 41 * emptyRows }}>
              <td colSpan={3} aria-hidden />
            </TableRow>
            )}
          </TableBody>
          <tfoot>
            <TableRow className=" ">
            <CustomTablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                colSpan={3}
                                count={arr.length}
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
    );
  }


  handleSubmit(event: React.FormEvent) {
    const { XL, XR, func , er} = this.state;
    const xm = this.BisectionCalcFunction(XL, XR, func, er);
    event.preventDefault();
  }

  handleClear(event: React.FormEvent) {
    return;
  }

  handleGetSample(event: React.ChangeEvent<HTMLInputElement>) {
    return;
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.value } as Pick<BisectionState, keyof BisectionState>);
  }

  render() {
    const { XL, XR, func, er } = this.state;
    const resultTable = this.BisectionCalcFunction(XL, XR, func, er);

    return (
      <div className="h-full flex-1 flex-col  items-center space-y-4 p-8 md:flex">
        <Card className="w-full md:w-[705px] xl:w-[1214px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className='space-y-2'>
                        <CardTitle>Bisection Method</CardTitle>
                        <CardDescription>
                            Find the root of the equation using Bisection Method
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="func">Function</Label>
                            <Input 
                                id="func" 
                                name="func"
                                placeholder="FUNCTION"
                                value={this.state.func}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="XL">Lower Limit</Label>
                            <Input
                            name="XL"
                            placeholder="XL"
                            value={this.state.XL}
                            onChange={this.handleChange}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="XR">Upper Limit</Label>
                            <Input
                            name="XR"
                            placeholder="XR"
                            value={this.state.XR}
                            onChange={this.handleChange}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="er">Error</Label>
                            <Input
                              name="er"
                              placeholder="ERROR"
                              value={this.state.er}
                              onChange={this.handleChange}
                            />
                        </div>
                    </div>
                </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={this.handleClear}>Clear</Button>
                    <div className="flex items-center">
                        <Button className="mr-4" variant="secondary" onClick={this.handleGetSample}>Get Sample</Button>
                        <Button onClick={this.handleSubmit}>Calculate</Button>
                    </div>
                </CardFooter>
            </Card>
        <div className='py-4'>
            {resultTable}
        </div>
      </div>
    );
  }
}

export default Bisection;
