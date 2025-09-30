import React from 'react';
import { Select, Space, Tooltip } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import { useTheme, type ThemeType } from '../hooks/useTheme';

const { Option } = Select;

export const ThemeSelector: React.FC = () => {
  const { currentTheme, changeTheme, getAvailableThemes } = useTheme();
  const themes = getAvailableThemes();

  const handleThemeChange = (value: ThemeType) => {
    changeTheme(value);
  };

  return (
    <Tooltip title="Change theme">
      <Space>
        <BgColorsOutlined style={{ color: 'white', fontSize: '16px' }} />
        <Select
          value={currentTheme}
          onChange={handleThemeChange}
          style={{ 
            minWidth: 100,
          }}
          variant="borderless"
          size="small"
          dropdownStyle={{
            minWidth: 120,
          }}
        >
          {themes.map(theme => (
            <Option key={theme.type} value={theme.type}>
              {theme.name}
            </Option>
          ))}
        </Select>
      </Space>
    </Tooltip>
  );
};