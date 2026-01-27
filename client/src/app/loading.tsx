"use client";

// import Image from "next/image";
import React, { CSSProperties} from "react";
// import loader from "@/assets/loader/file.png";
import { BeatLoader } from "react-spinners";


  const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loading = () => {
  // let [color, setColor] = useState("#ffffff");
  return (
    <div className="w-full h-screen bg-white flex justify-center items-center">
      <div className="relative w-[150px] h-[150px]">
        {/* Circular spinner */}
        {/* <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div> */}

        {/* Center image */}
       <div className="sweet-loading">
      {/* <button className="text-center" onClick={() => setLoading(!loading)}>Silk Thread</button> */}
      {/* <input
        value={color}
        onChange={(input) => setColor(input.target.value)}
        placeholder="Color of the loader"
      /> */}

      <BeatLoader
        color={"#FF6C0C"}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
      </div>
    </div>
  );
};

export default Loading;
