import React from "react";

export const ExitPreview = () => {
  return (
    <div
      className={
        "pointer-events-none fixed inset-0 flex h-screen w-screen items-end justify-center z-50"
      }
    >
      <form 
        className={"pointer-events-auto"} 
        action={"/resource/preview"} 
        method={"POST"}
        aria-label="Exit preview mode form"
      >
        <button 
          className={"bg-black p-4 py-2 text-white text-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"} 
          type={"submit"}
          aria-label="Exit preview mode"
        >
          Exit Preview Mode
        </button>
      </form>
    </div>
  );
};
