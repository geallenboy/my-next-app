"use client";

import { useState } from "react";

export default function GenerateObject() {
  const [generation, setGeneration] = useState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div
        onClick={async () => {
          setIsLoading(true);

          await fetch("/api/generate-object", {
            method: "POST",
            body: JSON.stringify({
              prompt: "Messages during finals week."
            })
          }).then((response) => {
            response.json().then((json: any) => {
              setGeneration(json.notifications);
              setIsLoading(false);
            });
          });
        }}
      >
        Generate
      </div>

      {isLoading ? "Loading..." : <pre>{JSON.stringify(generation)} </pre>}
    </div>
  );
}
