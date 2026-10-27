import type { MissingSoftcapperConfig } from "./types";

export default function getDefaultMissingSoftcapperConfig(): MissingSoftcapperConfig {
  return {
    mode: "pow",
  };
}
