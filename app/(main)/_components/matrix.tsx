import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from "katex";

interface MatrixProps {
  matrix: number[][];
  variant?: 'normal' | "bracket" | 'italic';
  size?: number;
}
  

  const Matrix: React.FC<MatrixProps> = ({ matrix, variant, size}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      console.log(size);
      // console.log('Variant:', variant); 
      if (containerRef.current) {
        let latex = ``;
        if (Array.isArray(matrix) && matrix.length > 0 && Array.isArray(matrix[0])) {
          if (variant === 'bracket') {
            // console.log("bracket");
            latex = `\\left(\\begin{matrix}
              ${matrix.map(row => row.join(' & ')).join(' \\\\ ')}
            \\end{matrix}\\right)`;
          }else if(size === 2) {
            latex = `\\Biggl(\\space\\space\\begin{matrix}
              ${matrix.map(row => row.join(' & ')).join(' \\\\ ')}
            \\end{matrix}\\Biggm|`;
          } else if(size === 3) {
            latex = `\\begin{matrix}
              ${matrix.map(row => row.join(' & ')).join(' \\\\ ')}
            \\end{matrix}\\space\\space\\Biggr)`;
          } else {
            // console.log("normal");
            latex = `\\begin{bmatrix}
            ${matrix.map(row => row.join(' & ')).join(' \\\\ ')}
            \\end{bmatrix}`;
          }
        }
        else {
          if (size === 3) {
            latex = `\\begin{matrix}${matrix.join(' \\\\ ')}\\end{matrix}\\space\\space\\Biggr)`;
          } else {
            latex = `\\begin{bmatrix}${matrix.join(' \\\\ ')}\\end{bmatrix}`;
          }
          // `\\left(\\begin{matrix}${matrix.join(' \\\\ ')}\\end{matrix}\\right)`;
          
        }
  
        katex.render(latex, containerRef.current, { throwOnError: false });
      }
    }, [matrix, variant, size]);
  
    return <div ref={containerRef} />;
  };
  
  export default Matrix;
