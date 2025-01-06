"use client";

import React, { useState, useEffect } from "react";

import { useConvexAuth, useQuery } from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Spinner } from "@/components/spinner";
import { Menu, X, ChevronDown } from "lucide-react";

export const Navbar = () => {
  const { user } = useUser();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // const handleNavToggle = () => {
  //   setMenuOpen(!menuOpen);
  // };

  // const handleSubMenuClick = (index: number) => {
  //   if (subMenuOpen === index) {
  //     setSubMenuOpen(null);
  //   } else {
  //     setSubMenuOpen(index);
  //   }
  // };

  // Handle scroll effect
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        if (window.scrollY > 0) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      // Cleanup function to remove event listener
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Hydration check to ensure that the client-side rendering is complete
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSubMenuClick = (index: number) => {
    if (subMenuOpen === index) {
      setSubMenuOpen(null);
    } else {
      setSubMenuOpen(index);
    }
  };

  // Don't render anything until client-side hydration is complete
  if (!isMounted) {
    return null;
  }

  const menu = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Root of Equations",
      href: "",
      spacing: true,
      submenu: true,
      submenuItems: [
        {
          label: "Graphical Method",
          href: "/root-of-equations/graphical-method",
        },
        {
          label: "Bisection Method",
          href: "/root-of-equations/bisection-method",
        },
        {
          label: "False-Position Method",
          href: "/root-of-equations/false-position-method",
        },
        {
          label: "One-Point Iteration Method",
          href: "/root-of-equations/one-point-iteration-method",
        },
        {
          label: "Newton's-Raphson Method",
          href: "/root-of-equations/newtons-raphson-method",
        },
        { label: "Secant Method", href: "/root-of-equations/secant-method" },
      ],
    },
    { label: "Taylor Series", href: "/taylor-series" },
    {
      label: "Linear Algebraic Equations",
      href: "",
      submenu: true,
      submenuItems: [
        {
          label: "Cramer's Rule",
          href: "/linear-algebraic-equations/cramers-rule",
        },
        {
          label: "Gauss Elimination Method",
          href: "/linear-algebraic-equations/gauss-elimination-method",
        },
        {
          label: "Gauss-Jordan Method",
          href: "/linear-algebraic-equations/gauss-jordan-method",
        },
        {
          label: "Matrix Inversion",
          href: "/linear-algebraic-equations/matrix-inversion",
        },
        {
          label: "LU Decomposition Method",
          href: "/linear-algebraic-equations/lu-decomposition-method",
        },
        {
          label: "Cholesky Decomposition Method",
          href: "/linear-algebraic-equations/cholesky-decomposition-method",
        },
      ],
    },
    {
      label: "Conjugate",
      href: "",
      submenu: true,
      submenuItems: [
        {
          label: "Jacobi Iteration Method",
          href: "/conjugate/jacobi-iteration-method",
        },
        {
          label: "Gauss-Seidel Iteration Method",
          href: "/conjugate/gauss-seidel-iteration-method",
        },
        {
          label: "Conjugate Gradient Method",
          href: "/conjugate/conjugate-gradient-method",
        },
      ],
    },
    {
      label: "Interpolation and Extrapolation",
      href: "",
      submenu: true,
      submenuItems: [
        {
          label: "Newton's Divided-Differences",
          href: "/interpolation-and-extrapolation/newtons-divided-differences",
        },
        {
          label: "Lagrange Interpolation",
          href: "/interpolation-and-extrapolation/lagrange-interpolation",
        },
        {
          label: "Spline Interpolation",
          href: "/interpolation-and-extrapolation/spline-interpolation",
        },
        {
          label: "Spline Quadratic [Database API]",
          href: "/interpolation-and-extrapolation/spline-quadratic",
        },
      ],
    },
    {
      label: "Least-Squares Regression",
      href: "",
      submenu: true,
      submenuItems: [
        {
          label: "Linear Regression",
          href: "/least-squares-regression/linear-regression",
        },
        {
          label: "Polynomial Regression",
          href: "/least-squares-regression/polynomial-regression",
        },
        {
          label: "Multiple Linear Regression",
          href: "/least-squares-regression/multiple-linear-regression",
        },
      ],
    },
    {
      label: "Numerical Integration and Differentiation",
      href: "",
      submenu: true,
      submenuItems: [
        {
          label: "Trapezoidal Rule",
          href: "/numerical-integration-and-differentiation/trapezoidal-rule",
        },
        {
          label: "Simpson's Rule",
          href: "/numerical-integration-and-differentiation/simpsons-rule",
        },
      ],
    },
    {
      label: "Differentiation and Ordinary Differential Equations",
      href: "",
      submenu: true,
      submenuItems: [
        {
          label: "Divided-Differences",
          href: "/differentiation-and-ordinary-differential-equations/divided-differences",
        },
      ],
    },
  ];

  return (
    <div className="flex-grow">
      <div
        className={cn(
          "z-50 bg-background dark:bg-[#191919] fixed top-0 flex items-center w-full p-6",
          scrolled && "border-b shadow-sm"
        )}
      >
        <div className="ml-auto justify-start w-full flex items-center gap-x-2">
          <Button variant="outline" size="icon" onClick={handleNavToggle}>
            <Menu className="h-4 w-4" />
          </Button>
          <a href="/">
            <Logo />
          </a>
        </div>

        <div className="ml-auto justify-end w-full flex items-center gap-x-2">
          {isLoading && <Spinner />}
          {!isAuthenticated && !isLoading && (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignInButton>
            </>
          )}
          {isAuthenticated && !isLoading && (
            <>
              <span className="hidden sm:block text-start font-medium line-clamp-1">
                Hello, {user?.firstName?.slice(0, 20)}
                {user?.firstName && user.firstName.length > 20 ? "..." : ""}
              </span>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
          <ModeToggle />
        </div>
      </div>
      <div
        className={
          menuOpen
            ? "fixed left-0 top-0 w-72  h-full bg-[#fbfbfa] dark:bg-[#202020] p-6 z-50 rounded-r-2xl border-r"
            : "hidden"
        }
        style={{ overflowY: "auto" }}
      >
        <div className="justify-between flex self-end w-60 top-0 z-50 h-[10%] fixed bg-[#fbfbfa] dark:bg-[#202020] items-center">
          <a>
            <Logo />
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNavToggle}
            className=""
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-[10vh] gap-y-5 flex flex-col">
          {menu.map((menu, index) => (
            <div key={index}>
              <Button
                key={menu.href}
                variant="ghost"
                size="lg"
                className={`w-full  items-center ${
                  menu.spacing ? "mt-9" : "mt-0"
                }`}
                onClick={() => handleSubMenuClick(index)}
              >
                <Link className="absolute" href={menu.href}>
                  {menu.label.length > 15
                    ? `${menu.label.slice(0, 15)}...`
                    : menu.label}
                </Link>
                {menu.submenu && (
                  <ChevronDown
                    className={`${
                      subMenuOpen === index && "rotate-180"
                    } ml-auto ease-in transition duration-150`}
                  />
                )}
              </Button>
              {menu.submenu && subMenuOpen === index && (
                <ul className="gap-y-2 flex flex-col">
                  {menu.submenuItems.map((submenu, index) => (
                    <Button
                      key={submenu.href}
                      variant="ghost"
                      size="sm"
                      className={`w-full`}
                    >
                      <Link href={submenu.href}>{submenu.label}</Link>
                    </Button>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
