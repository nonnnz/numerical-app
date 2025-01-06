import { useState, useEffect } from "react";

export const useScrollTop = (thresold = 10) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Only run on the client side
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        if (window.scrollY > thresold) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      // Cleanup function to remove event listener
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [thresold]);

  return scrolled;
};
