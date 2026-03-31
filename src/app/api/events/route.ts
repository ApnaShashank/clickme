import { NextRequest } from "next/server";
import { eventEmitter, EVENTS } from "@/lib/events";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const onUpdate = (data: any) => {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      // Listen for click updates
      eventEmitter.on(EVENTS.CLICK_UPDATE, onUpdate);

      // Handle connection close
      req.signal.onabort = () => {
        eventEmitter.off(EVENTS.CLICK_UPDATE, onUpdate);
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
