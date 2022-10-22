import { jsHandler } from "./jsHandler";
import { vueHandler } from "./vueHandler";

export interface Position {
  line: number;
  column: number;
  index?: number;
}
export interface Handler {
  calcPosition: (code: string, offset: number) => Position;
  delete: (code: string) => [Position, Position][];
}
export type Language = "js" | "vue";
export function getHandler(language: Language) {
  let handler = jsHandler;
  switch (language) {
    case "js":
      handler = jsHandler;
      break;
    case "vue":
      handler = vueHandler;
      break;
  }
  return handler;
}
