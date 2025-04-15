import { Logger } from "../utils/logger.ts";

export const run = (rawJwt: string) => {
  if (!rawJwt) {
    Logger().error("Missing JWT in command args");
    Deno.exit(1);
  }
  
  const [header, payload] = rawJwt.split(".");

  let payloadDecoded, headerDecoded;
  try {
    headerDecoded = JSON.parse(atob(header));
    payloadDecoded = JSON.parse(atob(payload));
  } catch (error) {
    Logger().error(`Malformad JWT: ${(error as Error).message}`);
    Deno.exit(1);
  }

  Logger().object(headerDecoded);
  Logger().object(payloadDecoded);
};
