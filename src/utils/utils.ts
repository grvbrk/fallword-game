import { Devvit } from "@devvit/public-api";
import { BlocksToWebviewMessage } from "../../game/shared.js";
import { WEBVIEW_ID } from "../constants.js";

export const sendMessageToWebview = (
  context: Devvit.Context,
  message: BlocksToWebviewMessage,
) => {
  context.ui.webView.postMessage(WEBVIEW_ID, message);
};

export async function wait(ms : number) {
  return await new Promise((resolve) => setTimeout(resolve, ms*1000));
}