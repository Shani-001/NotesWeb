import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
// import { Button } from "../components/ui/moving-border";
export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[22rem] rounded-md flex flex-col antialiased bg-purple dark:bg-White dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={categories}
        direction="right"
        speed="slow"
        className=""
      />
    </div>
  );
}

const categories = [
  {
    title: "Data Structures & Algorithms (DSA)",
    logo: <img src="/notes2.jpg" alt="English" />,
    description:
      "Master arrays, trees, and algorithms step by step. Build problem-solving skills for coding interviews.",
  },
  {
    title: "Chemistry",
    logo: <img src="/notes3.jpg" alt="English" />,
    description:
      "Understand organic, inorganic, and physical concepts. Notes designed for clarity and quick revision.",
  },
  {
    title: "Mathematics",
    logo: <img src="/notes4.jpg" alt="English" />,
    description:
      "Covers algebra, calculus, and statistics essentials. Strengthen logic and problem-solving skills.",
  },
  {
    title: "Political Power",
    logo: <img src="/notes5.jpg" alt="English" />,
    description:
      "Explore governance, policies, and political theories. Notes that simplify complex political concepts.",
  },
  {
    title: "Biology",
    logo: <img src="/notes6.jpg" alt="English" />,
    description:
      "Study cell biology, genetics, and human anatomy. Clear notes to understand life and living systems.",
  },
  {
    title: "Social Psychology",
    logo: <img src="/notes7.jpg" alt="English" />,
    description:
      "Learn about human behavior, influence, and society. Notes that connect psychology with real life.",
  },
  {
    title: "Physical Chemistry",
    logo: <img src="/notes8.jpg" alt="English" />,
    description:
      "Covers thermodynamics, kinetics, and quantum chemistry. Notes that blend theory with problem practice.",
  },
];
