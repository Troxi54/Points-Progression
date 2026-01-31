import { ComponentType, ReactNode } from "react";

export type ClassName = string;

export interface ChildrenProps {
  children?: ReactNode;
}

export interface ClassNameProps {
  className?: ClassName;
}

export type PropsOf<C> = C extends ComponentType<infer P> ? P : never;

export type GetComponentArgs<C> =
  PropsOf<C> extends Record<string, never> ? [] : [props: PropsOf<C>];
