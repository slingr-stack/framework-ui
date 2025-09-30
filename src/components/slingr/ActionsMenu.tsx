import React from 'react';
import { Dropdown, Button, message } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';

export interface ActionItem {
  /** Unique action identifier */
  key: string;
  /** Action label to display */
  label: string;
  /** Action icon */
  icon?: React.ReactNode;
  /** Whether this action is disabled */
  disabled?: boolean;
  /** Whether this action is dangerous/destructive */
  danger?: boolean;
  /** Action parameters */
  params?: Record<string, unknown>;
  /** Custom confirmation message for this action */
  confirmMessage?: string;
}

export interface ActionsMenuProps {
  /** Array of actions to display in the menu */
  actions: ActionItem[];
  /** Menu trigger button text */
  children?: React.ReactNode;
  /** Button type */
  buttonType?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  /** Button size */
  size?: 'large' | 'middle' | 'small';
  /** Custom styling */
  style?: React.CSSProperties;
  /** Loading state */
  loading?: boolean;
  /** Whether the entire menu is disabled */
  disabled?: boolean;
  /** Placement of the dropdown */
  placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';
  /** Callback executed before any action (can prevent action by returning false) */
  onBeforeAction?: (actionId: string, params?: Record<string, unknown>) => boolean | Promise<boolean>;
  /** Callback executed after successful action */
  onSuccess?: (actionId: string, result: unknown) => void;
  /** Callback executed on action error */
  onError?: (actionId: string, error: Error) => void;
}

/**
 * Actions Menu Component
 * 
 * Provides a dropdown menu containing multiple backend actions.
 * Each action triggers a GraphQL mutation when selected.
 */
export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  actions,
  children = 'Actions',
  buttonType = 'default',
  size = 'middle',
  style,
  loading = false,
  disabled = false,
  placement = 'bottomLeft',
  onBeforeAction,
  onSuccess,
  onError
}) => {
  const [executingAction, setExecutingAction] = React.useState<string | null>(null);

  const executeAction = async (action: ActionItem) => {
    try {
      // Execute before action callback
      if (onBeforeAction) {
        const shouldProceed = await onBeforeAction(action.key, action.params);
        if (!shouldProceed) {
          return;
        }
      }

      // Show confirmation if this is a dangerous action
      if (action.danger) {
        const confirmed = window.confirm(
          action.confirmMessage || `Are you sure you want to execute '${action.label}'?`
        );
        if (!confirmed) {
          return;
        }
      }

      setExecutingAction(action.key);

      // In a real implementation, this would call the GraphQL mutation:
      // const { data } = await apolloClient.mutate({
      //   mutation: ACTION_MUTATION,
      //   variables: { actionId: action.key, params: action.params }
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockResult = { 
        success: true, 
        message: `Action '${action.label}' executed successfully`,
        data: action.params 
      };

      message.success(`Action '${action.label}' completed successfully`);
      
      if (onSuccess) {
        onSuccess(action.key, mockResult);
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error');
      message.error(`Action failed: ${errorObj.message}`);
      
      if (onError) {
        onError(action.key, errorObj);
      }
    } finally {
      setExecutingAction(null);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
    const action = actions.find(a => a.key === key);
    if (action) {
      await executeAction(action);
    }
  };

  const menuItems: MenuProps['items'] = actions.map(action => ({
    key: action.key,
    label: action.label,
    icon: executingAction === action.key ? <LoadingOutlined /> : action.icon,
    disabled: action.disabled || executingAction === action.key,
    danger: action.danger
  }));

  const isLoading = loading || executingAction !== null;

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleMenuClick
      }}
      placement={placement}
      disabled={disabled || isLoading}
      trigger={['click']}
    >
      <Button
        type={buttonType}
        size={size}
        style={style}
        disabled={disabled}
        loading={isLoading}
        icon={isLoading ? <LoadingOutlined /> : undefined}
      >
        {children}
        {!isLoading && <DownOutlined />}
      </Button>
    </Dropdown>
  );
};