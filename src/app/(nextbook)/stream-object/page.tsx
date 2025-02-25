"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { notificationSchema } from "@/utils/schema";

export default function StreamObject() {
  const { object, submit } = useObject({
    api: "/api/stream-object",
    schema: notificationSchema
  });

  return (
    <div>
      <button onClick={() => submit("Messages during finals week.")}>Generate notifications</button>

      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
