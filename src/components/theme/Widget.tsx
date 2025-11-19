import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: ReactNode;
}

export const Widget = ({ children, title }: Props) => {
  return (
    <div className="widget">
      {title && <h3 className="widget-title">{title}</h3>}
      {children}
    </div>
  );
};
