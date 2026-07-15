import React from 'react';
import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function renderFormattedText(text: string | number | undefined | null) {
  if (text === undefined || text === null || text === '') return null;
  const str = String(text);
  const lines = str.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const renderedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return React.createElement(
          'strong',
          { key: partIdx, className: 'font-extrabold text-foreground' },
          part.slice(2, -2)
        );
      }
      return part;
    });
    return React.createElement(
      React.Fragment,
      { key: lineIdx },
      renderedLine,
      lineIdx < lines.length - 1 ? React.createElement('br') : null
    );
  });
}
