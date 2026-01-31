import { GetComponentArgs } from "@/core/types/react";
import { objectEntries } from "@/core/utils/object";
import { ComponentType, useEffect, useState } from "react";

export type DynamicImportFeature<S, P> = [
  () => Promise<{ default: ComponentType<P> }>,
  (state: S) => boolean
];

export type DynamicImportFeatureContainer<S> = {
  [key: string]: DynamicImportFeature<S, any>;
};

type ComponentOf<F> =
  F extends DynamicImportFeature<any, infer P> ? ComponentType<P> : never;

export function createDynamicImport<
  S,
  F extends DynamicImportFeatureContainer<S>
>(features: F) {
  return (state: S) => {
    const [cache, setCache] = useState<{
      [K in keyof F]?: ComponentOf<F[K]>;
    }>({});

    const [firstComponentsLoaded, setFirstComponentsLoaded] = useState(false);

    useEffect(() => {
      const entries = objectEntries(features).filter(([, [, condition]]) =>
        condition(state)
      );
      Promise.all(
        entries.map(async ([name, [importFn]]) => {
          const key = name as keyof typeof features;
          if (!cache[key]) {
            const mod = await importFn();
            setCache((prev) => ({ ...prev, [key]: mod.default }));
          }
        })
      )
        .then(() => {
          if (!firstComponentsLoaded) setFirstComponentsLoaded(true);
        })
        .catch(console.error);
    }, [state]);

    function getComponent<K extends keyof F>(
      name: K,
      ...args: GetComponentArgs<(typeof cache)[K]>
    ) {
      const Component = cache[name];
      if (!Component) return null;

      return <Component {...(args[0] as any)} />;
    }

    return { getComponent, firstComponentsLoaded };
  };
}
