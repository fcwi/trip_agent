import React, { useEffect, useRef, useState } from "react";

/**
 * A component that automatically scrolls text if it overflows its container.
 *
 * @param {string} text - The text to display.
 * @param {string} className - Additional CSS classes.
 * @param {number} speed - Scrolling speed in pixels per second (default: 30).
 * @param {string} direction - "left" or "right" (default: "left").
 */
const MarqueeText = ({
  text,
  className = "",
  speed = 30,
  direction = "left",
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;

    if (!container || !textElement) return;

    const checkOverflow = () => {
      const containerWidth = container.clientWidth;
      const textWidth = textElement.scrollWidth;

      // Check if text is wider than container
      const isOver = textWidth > containerWidth;
      setIsOverflowing(isOver);

      if (isOver) {
        // Calculate duration based on total scrolling width (text + gap)
        // We assume a 2rem gap (approx 32px) in calculation, though CSS handles the positioning
        const gap = 32;
        const scrollDistance = textWidth + gap;
        const calculatedDuration = scrollDistance / speed;
        setDuration(calculatedDuration);
      }
    };

    const resizeObserver = new ResizeObserver(() => checkOverflow());
    resizeObserver.observe(container);
    resizeObserver.observe(textElement);

    // Initial check
    checkOverflow();

    // Check again after a slight delay for fonts
    setTimeout(checkOverflow, 500);

    return () => resizeObserver.disconnect();
  }, [text, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap max-w-full ${className}`}
      // Apply className to container always so styles (font, color) are inherited
    >
      <div
        ref={textRef}
        className={`inline-block relative ${isOverflowing ? "animate-marquee" : ""}`}
        style={{
          animationDuration: isOverflowing ? `${duration}s` : "0s",
          animationDirection: direction === "right" ? "reverse" : "normal",
          // Add padding to the right of the main text to create the gap
          paddingRight: isOverflowing ? "2rem" : "0",
        }}
      >
        {text}
        {isOverflowing && (
          <div
            className="absolute top-0 left-full w-full h-full"
            aria-hidden="true"
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarqueeText;
