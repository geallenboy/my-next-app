"use client";

import { useState } from "react";

export default function GenerateObjectForm() {
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <form
        action={async (formData) => {
          try {
            setLoading(true);
            const response = await fetch("/api/generate-object-form", {
              method: "POST",
              body: formData
            });
            setLoading(false);

            if (response.ok) {
              setDescription(await response.text());
            }
          } catch (error) {
            console.error("Analysis failed:", error);
          }
        }}
      >
        <div>
          <label>Upload Image</label>
          <input name="pdf" type="file" accept="application/pdf" />
        </div>
        <button type="submit" disabled={loading}>
          Submit{loading && "ing..."}
        </button>
      </form>
      {description && <pre>{description}</pre>}
    </div>
  );
}
