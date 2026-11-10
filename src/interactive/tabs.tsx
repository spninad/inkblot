'use client';
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs.js';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/collapsible.js';
import { Button } from '../ui/button.js';
import { ChevronDown } from 'lucide-react';
import { ContentSlot } from './context.js';

export function TabsControl({
  items,
  defaultTab = 0,
}: {
  items: { label: string; html?: string; content?: React.ReactNode }[];
  defaultTab?: number;
}) {
  const initial = String(Math.max(0, Math.min(defaultTab, items.length - 1)));
  const [value, setValue] = React.useState(initial);
  return (
    <Tabs defaultValue={initial} value={value} onValueChange={setValue} className="inkblot-tabs">
      <TabsList aria-label="Content views" className="ib:max-w-full ib:overflow-x-auto ib:shrink-0">
        {items.map((item, i) => (
          <TabsTrigger key={i} value={String(i)}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item, i) => (
        <TabsContent
          key={i}
          value={String(i)}
          forceMount
          hidden={value !== String(i)}
          className="inkblot-tab-content"
        >
          <ContentSlot html={item.html}>{item.content}</ContentSlot>
        </TabsContent>
      ))}
    </Tabs>
  );
}
export function CollapseControl({
  summary,
  summaryHtml,
  html,
  children,
  open = false,
  className = '',
}: {
  summary?: React.ReactNode;
  summaryHtml?: string;
  html?: string;
  children?: React.ReactNode;
  open?: boolean;
  className?: string;
}) {
  return (
    <Collapsible defaultOpen={open} className={`inkblot-disclosure ${className}`}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="ib:w-full ib:justify-between ib:rounded-xl ib:h-auto ib:min-h-10 ib:whitespace-normal ib:text-left"
        >
          <ContentSlot html={summaryHtml}>{summary}</ContentSlot>
          <ChevronDown className="ib:shrink-0" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent forceMount className="inkblot-disclosure-content">
        <ContentSlot html={html}>{children}</ContentSlot>
      </CollapsibleContent>
    </Collapsible>
  );
}
