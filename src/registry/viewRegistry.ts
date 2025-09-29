import { 
  DashboardOutlined, 
  ExperimentOutlined, 
  ApiOutlined, 
  FormOutlined,
  BugOutlined
} from '@ant-design/icons';
import type { ViewConfig, ViewComponent } from '../types/view';
import { DashboardView } from '../views/DashboardView';
import { AntDesignShowcaseView } from '../views/AntDesignShowcaseView';
import { GraphQLView } from '../views/GraphQLView';
import { FormView } from '../views/FormView';

export interface ViewRegistryEntry {
  config: ViewConfig;
  component: ViewComponent;
}

export const viewRegistry: Record<string, ViewRegistryEntry> = {
  dashboard: {
    config: {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Analytics and overview dashboard with statistics and progress indicators',
      icon: DashboardOutlined,
      category: 'Analytics'
    },
    component: DashboardView
  },
  'ant-design': {
    config: {
      id: 'ant-design',
      title: 'Ant Design Components',
      description: 'Comprehensive showcase of Ant Design component library',
      icon: BugOutlined,
      category: 'Components'
    },
    component: AntDesignShowcaseView
  },
  graphql: {
    config: {
      id: 'graphql',
      title: 'GraphQL Integration',
      description: 'Demonstration of Apollo GraphQL client integration and API calls',
      icon: ApiOutlined,
      category: 'API'
    },
    component: GraphQLView
  },
  forms: {
    config: {
      id: 'forms',
      title: 'Forms & Data Entry',
      description: 'Complex forms with various input controls and validation',
      icon: FormOutlined,
      category: 'Forms'
    },
    component: FormView
  },
  experiments: {
    config: {
      id: 'experiments',
      title: 'Experimental Features',
      description: 'Showcase of experimental and advanced UI patterns',
      icon: ExperimentOutlined,
      category: 'Advanced'
    },
    component: DashboardView // Placeholder for now
  }
};

export const getViewCategories = (): string[] => {
  const categories = new Set<string>();
  Object.values(viewRegistry).forEach(entry => {
    if (entry.config.category) {
      categories.add(entry.config.category);
    }
  });
  return Array.from(categories).sort();
};

export const getViewsByCategory = (category: string): ViewRegistryEntry[] => {
  return Object.values(viewRegistry).filter(entry => entry.config.category === category);
};

export const getAllViews = (): ViewRegistryEntry[] => {
  return Object.values(viewRegistry);
};