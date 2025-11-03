import EmptyState from "@/components/EmptyState";
import React from "react";
import notFoundSVG from "@/assets/404-error.svg";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <EmptyState imageSrc={notFoundSVG} imageClassName="w-256 h-256" />
    </div>
  );
};

export default NotFound;
