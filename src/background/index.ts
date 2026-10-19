import { REQUEST_TO_NETWORK } from "../constants/events";
import { executeRequest } from "../utils/fetch-utils"

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== REQUEST_TO_NETWORK) return;

  // Keep the listener synchronous and explicitly keep the response channel
  // open while the service worker performs the fetch.
  void executeRequest(message.payload)
    .then((response) => sendResponse({ ok: true, response }))
    .catch((error: unknown) => {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Request could not be executed",
      });
    });

  return true;
});
