'use client';
import React from 'react';

export interface StaticControls {
  enabled: boolean;
  content(node: React.ReactNode): string;
  island(name: string, props: Record<string, unknown>): React.ReactNode;
}
/** Only the HTML compiler supplies this context. React hosts use controls directly. */
export const StaticControlsContext = React.createContext<StaticControls | null>(null);
export function ContentSlot({ html, children }: { html?: string; children?: React.ReactNode }) {
  return html !== undefined ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <>{children}</>;
}
export const PortalContainerContext = React.createContext<HTMLElement | null>(null);
