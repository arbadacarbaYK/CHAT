// TypeScript declaration for model-viewer custom element
// This allows JSX to recognize <model-viewer> as a valid element
// and accept any attributes

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
} 