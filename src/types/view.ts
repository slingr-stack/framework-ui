import React from 'react';

export interface ViewConfig {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  category?: string;
}

export interface ViewProps {
  config: ViewConfig;
}

export type ViewComponent = React.FC<ViewProps>;