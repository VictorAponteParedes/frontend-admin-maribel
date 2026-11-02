import { lazy, type ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyLoad = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  return lazy(factory);
};

export default lazyLoad;
