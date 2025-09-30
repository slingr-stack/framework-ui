import React, { createContext, useContext, useState, useEffect } from 'react';
import { theme } from 'antd';

export type ThemeType = 'light' | 'dark' | 'compact';

export interface ThemeConfig {
  type: ThemeType;
  name: string;
  algorithm: any;
  token: {
    colorPrimary: string;
    borderRadius: number;
    colorBgContainer: string;
    colorBgElevated?: string;
    colorText?: string;
    colorTextSecondary?: string;
  };
}

const themeConfigs: Record<ThemeType, ThemeConfig> = {
  light: {
    type: 'light',
    name: 'Light',
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8,
      colorBgContainer: '#ffffff',
    },
  },
  dark: {
    type: 'dark',
    name: 'Dark',
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8,
      colorBgContainer: '#141414',
      colorBgElevated: '#1f1f1f',
    },
  },
  compact: {
    type: 'compact',
    name: 'Compact',
    algorithm: [theme.defaultAlgorithm, theme.compactAlgorithm],
    token: {
      colorPrimary: '#722ed1',
      borderRadius: 4,
      colorBgContainer: '#ffffff',
    },
  },
};

interface ThemeContextType {
  currentTheme: ThemeType;
  changeTheme: (newTheme: ThemeType) => void;
  getThemeConfig: (themeType?: ThemeType) => ThemeConfig;
  getAvailableThemes: () => ThemeConfig[];
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('app-theme') as ThemeType;
    if (savedTheme && themeConfigs[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  const getThemeConfig = (themeType: ThemeType = currentTheme): ThemeConfig => {
    return themeConfigs[themeType];
  };

  const getAvailableThemes = (): ThemeConfig[] => {
    return Object.values(themeConfigs);
  };

  const value = {
    currentTheme,
    changeTheme,
    getThemeConfig,
    getAvailableThemes,
    themeConfig: getThemeConfig(),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};