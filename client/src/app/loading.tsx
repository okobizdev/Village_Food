"use client";

import React from "react";
import "./loading.css";

const Loading = () => {
  return (
    <div className="loading-screen">
      <div className="loader-container">
        <div className="tree-loader">
          {/* Growing Plant Animation */}
          <div className="plant-stem"></div>
          <div className="leaf leaf-left"></div>
          <div className="leaf leaf-right"></div>
          <div className="sprout"></div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;