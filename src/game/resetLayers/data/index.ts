import type { FlatResetLayerContainerConfig } from "../types";
import { createResetLayerContainer } from "../utils/create";
import levelResetLayer from "./layers/level";
import mallirtResetLayer from "./layers/mallirt";
import nullithResetLayer from "./layers/nullith";
import resetResetLayer from "./layers/reset";
import tierResetLayer from "./layers/tier";
import vermyrosResetLayer from "./layers/vermyros";
import xagyrosResetLayer from "./layers/xagyros";

const resetLayerConfigs = createResetLayerContainer({
  normal: [
    resetResetLayer,
    tierResetLayer,
    vermyrosResetLayer,
    nullithResetLayer,
  ],
  sliph: [mallirtResetLayer, levelResetLayer, xagyrosResetLayer],
} as const);

export default resetLayerConfigs;

export const resetLayerConfigsById = {} as FlatResetLayerContainerConfig;

function buildResetLayerConfigsById() {
  for (const dimensionLayers of Object.values(resetLayerConfigs)) {
    for (const layer of dimensionLayers) {
      resetLayerConfigsById[layer.id] = layer;
    }
  }
}

buildResetLayerConfigsById();
