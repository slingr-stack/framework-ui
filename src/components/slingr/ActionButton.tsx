import React from 'react';
import { Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface ActionButtonProps {
  /** Button text */
  children: React.ReactNode;
  /** Action identifier that maps to a backend GraphQL mutation */
  actionId: string;
  /** Action parameters to send to the backend */
  params?: Record<string, unknown>;
  /** Button type */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  /** Button size */
  size?: 'large' | 'middle' | 'small';
  /** Button icon */
  icon?: React.ReactNode;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Custom styling */
  style?: React.CSSProperties;
  /** Danger state for destructive actions */
  danger?: boolean;
  /** Callback executed before action (can prevent action by returning false) */
  onBeforeAction?: (actionId: string, params?: Record<string, unknown>) => boolean | Promise<boolean>;
  /** Callback executed after successful action */
  onSuccess?: (result: unknown) => void;
  /** Callback executed on action error */
  onError?: (error: Error) => void;
  /** Whether to show confirmation dialog for dangerous actions */
  confirmAction?: boolean;
  /** Custom confirmation message */
  confirmMessage?: string;
}

/**
 * Action Button Component
 * 
 * Triggers a backend action exposed through the GraphQL API.
 * Handles loading states, error handling, and optional confirmation dialogs.
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  actionId,
  params,
  type = 'default',
  size = 'middle',
  icon,
  disabled = false,
  loading = false,
  style,
  danger = false,
  onBeforeAction,
  onSuccess,
  onError,
  confirmAction = false,
  confirmMessage
}) => {
  const [isExecuting, setIsExecuting] = React.useState(false);

  const executeAction = async () => {
    try {
      // Execute before action callback
      if (onBeforeAction) {
        const shouldProceed = await onBeforeAction(actionId, params);
        if (!shouldProceed) {
          return;
        }
      }

      setIsExecuting(true);

      // In a real implementation, this would call the GraphQL mutation:
      // const { data } = await apolloClient.mutate({
      //   mutation: ACTION_MUTATION,
      //   variables: { actionId, params }
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockResult = { 
        success: true, 
        message: `Action '${actionId}' executed successfully`,
        data: params 
      };

      message.success(`Action '${actionId}' completed successfully`);
      
      if (onSuccess) {
        onSuccess(mockResult);
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error');
      message.error(`Action failed: ${errorObj.message}`);
      
      if (onError) {
        onError(errorObj);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClick = async () => {
    if (confirmAction) {
      const confirmed = window.confirm(
        confirmMessage || `Are you sure you want to execute '${actionId}'?`
      );
      if (!confirmed) {
        return;
      }
    }

    await executeAction();
  };

  return (
    <Button
      type={type}
      size={size}
      icon={isExecuting || loading ? <LoadingOutlined /> : icon}
      disabled={disabled || isExecuting || loading}
      loading={isExecuting || loading}
      style={style}
      danger={danger}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};