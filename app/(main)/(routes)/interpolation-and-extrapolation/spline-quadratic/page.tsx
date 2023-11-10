"use client"
import React, {useState, useEffect} from 'react';
import * as math from 'mathjs';
import { Button } from "@/components/ui/button";
import { useConvexAuth, useQuery } from "convex/react";
import {quadraticInterpolation} from '@/components/quadratic';
import { cubicSplineInterpolation } from '@/components/cubic-spline-interpolation';
import Plotly from 'plotly.js-dist-min'
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react"
import { api } from "@/convex/_generated/api";

const SplineQuad = () => {
    const { user } = useUser();
    const create = useMutation(api.iterpolation.create);
    const iterpolation = useQuery(api.iterpolation.get);
    
    // const [x, setX] = useState<string>('2 4 6 8 10');
    // const [y, setY] = useState<string>('9.5 8 10.5 39.5 72.5');
    const [xin, setXin] = useState<string[]>(['', '', '', '', '']);
    const [yin, setYin] = useState<string[]>(['', '', '', '', '']);
    const [find, setFind] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [dataPlot, setDataPlot] = useState<any>([]);
    const [plot, setPlot] = useState<any>([]);
    const [dimension, setDimension] = useState<number>(5);
    const sample = () => {
        setXin(['2', '4', '6', '8', '10']);
        setYin(['9.5', '8', '10.5', '39.5', '72.5']);
        setFind('4.5');
        setDimension(5);
    }
    const onCreate = (re:string) => {
        const xJsonString = JSON.stringify(xin);
        const yJsonString = JSON.stringify(yin);
        const promise = create({ x: xJsonString, y: yJsonString, find: find, result: re, type: 'spline-quadratic' });
    }
    useEffect(() => {
        setDimensionFunc();
    }, [dimension]);
    const cal = () => {
        console.log('tset');
        if(!find) return alert('please enter find value');

        let data = [];
        // let pointx = x ? x.split(' ').map((e) => parseFloat(e)) : [];
        // let pointy = y ? y.split(' ').map((e) => parseFloat(e)) : [];
        let pointx = xin.map((e) => parseFloat(e) ? parseFloat(e) : 0);
        let pointy = yin.map((e) => parseFloat(e) ? parseFloat(e) : 0);
        if(pointx.length != pointy.length) return alert('x and y must be the same length');
        // const spline = quadraticInterpolation(data);
        for(let i = 0; i < pointx.length; i++){
            data.push({x:pointx[i], y:pointy[i]});
        }
        console.log(data);
        const dfind = parseFloat(find);
        const spline = quadraticInterpolation(data);
        console.log(spline);
        function eq (f: number):any {
            var sum;
            for(let i = 0; i < pointx.length; i++) {
                if(pointx[i] <= f && f <= pointx[i+1]) {
                    sum = spline[i].a * Math.pow(f, 2) + spline[i].b * f + spline[i].c;
                    return sum;
                }
            }
        }
        let _result = eq(dfind);
        console.log(_result);
        let arr = [];
        for(let i = pointx[0]; i <= pointx[pointx.length-1]; i+=0.003) {
            arr.push({x: i, y: eq(i)});
        }
        setPlot(arr);
        setResult(_result.toString());
        setDataPlot(data);
        onCreate(_result.toString());
    }

    const setDimensionFunc = () => {
        if(!dimension) return;
        else if (dimension < 2) return;
        const newsize = [];
        for(let i = 0; i < dimension; i++) {
            newsize.push('');
        }
        setXin(newsize);
        setYin(newsize);
    }
    

    const callPlot = () => {
        var trace1 = {
            x: dataPlot.map((e:any) => parseFloat(e.x)),
            y: dataPlot.map((e:any) => parseFloat(e.y)),
            mode: 'markers',
            type: 'scatter',
            name: 'Original Data',
          };

          var trace2 = {
            x: plot.map((e:any) => parseFloat(e.x)),
            y: plot.map((e:any) => parseFloat(e.y)),
            mode: 'lines',
            type: 'scatter',
            name: 'plot',
          }

          var data:any = [trace1, trace2];
          data.push({
            x: [parseFloat(find)],
            y: [result],
            mode: 'markers',
            type: 'scatter',
            marker: { color: 'red' },
            name: 'Find Value',
          });
          
          Plotly.newPlot('plot', data, {}, {responsive: true});
    }

    return ( 
        <div className='flex flex-col p-8 justify-center'>
            <div>
                {iterpolation?.map((e:any) => (
                    <div className='flex flex-row space-x-4'>
                        <div>{e.x}</div>
                        <div>{e.y}</div>
                        <div>{e.find}</div>
                        <div>{e.result}</div>
                        <Button onClick={(event) =>{
                            setXin(JSON.parse(e.x));
                            setYin(JSON.parse(e.y));
                            setFind(e.find);
                            setResult(e.result);
                        }}>Get</Button>
                    </div>
                )
                )}
            </div>
            <div className='flex flex-col space-y-4 border md:w-[750px] bg-[#111111] rounded p-4'>
                <h1>Spline Quadratic</h1>
                {/* <div>x</div>
                <input type="text" placeholder='1 2 3 4' value={x} onChange={(e) => setX(e.target.value)}/>
                <div>y</div>
                <input type="text" placeholder='5 6 7 8' value={y} onChange={(e) => setY(e.target.value)} /> */}
                <div>find</div>
                <input type="text" placeholder='1' value={find} onChange={(e) => setFind(e.target.value)} />
                <div>set n</div>
                <input type="text" placeholder='1' value={dimension} onChange={(e) => {
                    setDimension(parseFloat(e.target.value));
                    }} />
                <table>
                    <tbody>
                    <tr>
                        <th>index</th>
                        <th>x</th>
                        <th>y</th>
                    </tr>
                    {xin.map((e, i) => (
                        <tr className='text-center'>
                            <td>{i+1}</td>
                            <td><input type="text" 
                            value={xin[i]} onChange={(e) => {
                                const inputValue = e.target.value;
                                const numericValue = inputValue.replace(/[^-0-9.]/g, '');
                                const newx_in = [...xin];
                                newx_in[i] = numericValue;
                                setXin(newx_in);
                            }}/></td>
                            <td><input type="text" 
                            value={yin[i]} onChange={(e) => {
                                const inputValue = e.target.value;
                                const numericValue = inputValue.replace(/[^-0-9.]/g, '');
                                const newyin = [...yin];
                                newyin[i] = numericValue;
                                setYin(newyin);
                            }}/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <Button onClick={cal}>calculate</Button>
                <Button onClick={callPlot}>plot</Button>
                <Button onClick={sample}>get example</Button>
            </div>
            <div className='flex flex-col mt-4 space-y-4 border w-min bg-[#111111] rounded p-4'>
                <h1>Result</h1>
                <div>{result}</div>
            </div>
            <div className='flex flex-col mt-4 space-y-4 border w-full bg-[#111111] rounded p-4'>
                <h1>Plot</h1>
                <div id='plot'></div>
            </div>
        </div>
     );
}
 
export default SplineQuad;