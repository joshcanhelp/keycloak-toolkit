import { getConfig } from "./config.ts";

const { DEBUG_MODE } = getConfig();

export const Logger = () => {
  return {
    log: (output: string) => {
      console.log(output);
    },
    object: (output: unknown) => {
      console.log(output);
    },
    success: (output: string) => {
      console.log("%c✅  " + output, "color: green");
    },
    error: (output: string) => {
      console.log("%c❌  " + output, "color: red");
    },
    debug: (output: string) => {
      if (DEBUG_MODE) {
        console.log("%c" + output, "color: light-blue");
      }
    },
  };
};
