import React from "react";

export type DynamicImportFeature<State> = [
  () => Promise<{ default: React.ComponentType }>,
  (state: State) => boolean
];

export type DynamicImportFeatureContainer<State> = Record<
  string,
  DynamicImportFeature<State>
>;

export function createDynamicImport<State>(
  features: DynamicImportFeatureContainer<State>
) {
  return (state: State) => {
    const [cache, setCache] = React.useState<
      Partial<Record<keyof typeof features, React.ComponentType>>
    >({});

    const [firstComponentsLoaded, setFirstComponentsLoaded] =
      React.useState(false);

    React.useEffect(() => {
      const entries = Object.entries(features).filter(([, [, condition]]) =>
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

    function getComponent(name: keyof typeof features) {
      const Component = cache[name];
      if (!Component) return null;
      return <Component />;
    }

    return { getComponent, firstComponentsLoaded };
  };
}
