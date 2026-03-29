import { FlatResetLayerContainer } from "../types";
import { createResetLayerContainer } from "../utils/create";
import resetResetLayer from "./layers/reset";
import tierResetLayer from "./layers/tier";
import vermyrosResetLayer from "./layers/vermyros";
import nullithResetLayer from "./layers/nullith";
import mallirtResetLayer from "./layers/mallirt";
import levelResetLayer from "./layers/level";
import xagyrosResetLayer from "./layers/xagyros";

const resetLayers = createResetLayerContainer({
  normal: [
    resetResetLayer,
    tierResetLayer,
    vermyrosResetLayer,
    nullithResetLayer,
  ],
  sliph: [mallirtResetLayer, levelResetLayer, xagyrosResetLayer],
} as const);

export default resetLayers;

export const flatResetLayers = {} as FlatResetLayerContainer;

function buildFlatResetLayer() {
  for (const dimensionLayers of Object.values(resetLayers)) {
    for (const layer of dimensionLayers) {
      flatResetLayers[layer.id] = layer;
    }
  }
}

buildFlatResetLayer();
