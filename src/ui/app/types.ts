import { ReactNode } from "react";
import { appStateSelector } from "./selector";
import featureDependencies from "./dependencies";

export type AppState = ReturnType<typeof appStateSelector>;

export interface AppLayoutState {
  appState: AppState;
  getComponent(name: keyof typeof featureDependencies): ReactNode;
}

export interface AppLayoutProps {
  appLayoutState: AppLayoutState;
}
