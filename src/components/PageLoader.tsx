import React from "react";

const PageLoader = ({ isLoading }: any) => {
  if (!isLoading) return null; // Hide if not loading

  return (
    <div className="page-loader-overlay">
      <div className="page-loader"></div>
    </div>
  );
};

export default PageLoader;
