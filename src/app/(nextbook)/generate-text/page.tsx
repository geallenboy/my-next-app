"use client"
import React, { useState } from 'react';

const GenerateText = () => {
    const [generation,setGeneration] = useState<string>("");
    const [isLoading,setIsLoading] = useState<boolean>(false);
  return (
    <div>
      <div onClick={async ()=>{
        setIsLoading(true);
        async function generateText() {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: "Once upon a time" }),
            });
            const { text } = await response.json() as { text: string };
            setGeneration(text);
            setIsLoading(false);
        }
        await generateText();
      }} >generate</div>
       {isLoading ? 'Loading...' : generation}
    </div>
  );
};

export default GenerateText;