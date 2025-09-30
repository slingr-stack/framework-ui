import { 
  ApiOutlined, 
  BugOutlined,
  LayoutOutlined,
  TableOutlined,
  DashboardOutlined,
  FormOutlined,
  ProjectOutlined,
  AppstoreOutlined,
  CommentOutlined
} from '@ant-design/icons';
import type { ViewConfig, ViewComponent } from '../types/view';
import { CustomDashboardView } from '../views/CustomDashboardView';
import { AntDesignShowcaseView } from '../views/AntDesignShowcaseView';
import { GraphQLView } from '../views/GraphQLView';
import { FormView } from '../views/FormView';
import { AntDesignLayoutView } from '../views/AntDesignLayoutView';
import { GridView } from '../views/GridView';
import { KanbanView } from '../views/KanbanView';
import { DynamicFormView } from '../views/DynamicFormView';
import { SlingrComponentsView } from '../views/SlingrComponentsView';

export interface ViewRegistryEntry {
  config: ViewConfig;
  component: ViewComponent;
}

export const viewRegistry: Record<string, ViewRegistryEntry> = {
  'slingr-components': {
    config: {
      id: 'slingr-components',
      title: 'Slingr components',
      description: 'Collection of UI components built on Ant Design for seamless backend integration',
      icon: CommentOutlined,
      category: undefined // Top level item
    },
    component: SlingrComponentsView
  },
  'api-integration': {
    config: {
      id: 'api-integration',
      title: 'API integration',
      description: 'Demonstration of Apollo GraphQL client integration and API calls',
      icon: ApiOutlined,
      category: undefined // Top level item
    },
    component: GraphQLView
  },
  'ant-design-components': {
    config: {
      id: 'ant-design-components',
      title: 'Ant design components',
      description: 'Comprehensive showcase of Ant Design component library',
      icon: BugOutlined,
      category: undefined // Top level item
    },
    component: AntDesignShowcaseView
  },
  'ant-design-layout': {
    config: {
      id: 'ant-design-layout',
      title: 'Ant design layout',
      description: 'Showcase of Ant Design layout components and patterns',
      icon: LayoutOutlined,
      category: undefined // Top level item
    },
    component: AntDesignLayoutView
  },
  dashboard: {
    config: {
      id: 'dashboard',
      title: 'Custom dashboard',
      description: 'Interactive analytics dashboard with model binding, API simulation, and real-time data visualization',
      icon: DashboardOutlined,
      category: 'Samples'
    },
    component: CustomDashboardView
  },
  'complex-form': {
    config: {
      id: 'complex-form',
      title: 'Complex form',
      description: 'Complex forms with various input controls and validation',
      icon: FormOutlined,
      category: 'Samples'
    },
    component: FormView
  },
  'grid-view': {
    config: {
      id: 'grid-view',
      title: 'Grid view',
      description: 'Table with filtering capabilities and advanced controls',
      icon: TableOutlined,
      category: 'Slingr views'
    },
    component: GridView
  },
  'kanban-view': {
    config: {
      id: 'kanban-view',
      title: 'Kanban view',
      description: 'Card-based project management with drag-and-drop and filtering',
      icon: AppstoreOutlined,
      category: 'Slingr views'
    },
    component: KanbanView
  },
  'form-view': {
    config: {
      id: 'form-view',
      title: 'Form view',
      description: 'Dynamic forms with backend-driven field rules and validation',
      icon: ProjectOutlined,
      category: 'Slingr views'
    },
    component: DynamicFormView
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

export const getTopLevelViews = (): ViewRegistryEntry[] => {
  return Object.values(viewRegistry).filter(entry => entry.config.category === undefined);
};

export const getAllViews = (): ViewRegistryEntry[] => {
  return Object.values(viewRegistry);
};