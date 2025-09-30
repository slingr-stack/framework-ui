import React from 'react';
import { Card, Typography } from 'antd';
import type { ViewProps } from '../types/view';

const { Title, Text } = Typography;

interface ViewContainerProps extends ViewProps {
  children: React.ReactNode;
  extra?: React.ReactNode;
}

export const ViewContainer: React.FC<ViewContainerProps> = ({ 
  config, 
  children,
  extra
}) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card 
        size="small" 
        style={{ 
          marginBottom: 16, 
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          background: 'linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {config.icon && (
              <config.icon style={{ fontSize: 20, color: '#1890ff' }} />
            )}
            <div>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                {config.title}
              </Title>
              {config.description && (
                <Text type="secondary" style={{ fontSize: 14 }}>
                  {config.description}
                </Text>
              )}
            </div>
          </div>
          {extra && <div>{extra}</div>}
        </div>
      </Card>
      
      <div style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
};