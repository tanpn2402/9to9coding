import { Node } from '@tiptap/core';
import { HtmlHTMLAttributes } from 'react';
export declare type Level = 1 | 2 | 3 | 4 | 5 | 6;
export interface HeadingOptions {
  levels: Level[];
  HTMLAttributes: Record<string, any>;
}
export interface HeadingAttrs {
  level: Level;
  attributes?: HtmlHTMLAttributes<HTMLHeadElement>;
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    heading: {
      /**
       * Set a heading node
       */
      setHeading: (attributes: HeadingAttrs) => ReturnType;
      /**
       * Toggle a heading node
       */
      toggleHeading: (attributes: HeadingAttrs) => ReturnType;
    };
  }
}
export declare const Heading: Node<HeadingOptions, any>;
