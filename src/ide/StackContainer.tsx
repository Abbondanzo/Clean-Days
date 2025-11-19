import type { ReactNode } from 'react';

interface Props {
  component: ReactNode;
  label: string;
}

export const StackContainer = ({ component, label }: Props) => {
  return (
    <div className="stack-container">
      <h3 className="stack-label">{label}</h3>
      <div className="component-container">{component}</div>
    </div>
  );
};
