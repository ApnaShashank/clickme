import { EventEmitter } from "events";

// In Next.js dev mode, the global object is preserved between HMR reloads
const globalForEvents = global as unknown as { eventEmitter: EventEmitter };

export const eventEmitter = globalForEvents.eventEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEvents.eventEmitter = eventEmitter;
}

export const EVENTS = {
  CLICK_UPDATE: "click-update",
  PROFILE_UPDATE: "profile-update",
};
