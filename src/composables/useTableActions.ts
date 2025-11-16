import { ref, computed } from 'vue';
import type { Component } from 'vue';
import { icons } from '@/plugins/mdi-icon';

export interface CustomAction {
  title: string;
  component: Component;
  condition?: (item: any) => boolean;
}

export interface CustomButtonAction {
  label: string;
  color?: string;
  onClick: (item: any) => void;
  disabled?: boolean | ((item: any) => boolean);
  icon?: string;
  outlined?: boolean;
  rounded?: boolean;
  class?: string;
  tooltip?: string;
}

export interface ActionOptions {
  actions?: ('create' | 'edit' | 'delete' | 'view')[];
  routes?: Record<string, string>;
  downloadLink?: Record<string, string>;
  customActions?: CustomAction[];
  customButtons?: CustomButtonAction[];
  customButtonsFn?: (item: any) => CustomButtonAction[];
  showRefreshButton?: boolean;
}

export function useTableActions(options: ActionOptions = {}) {
  const dialog = ref(false);
  const deleteDialog = ref(false);
  const actionDialog = ref(false);
  const isEditing = ref(false);
  const editedItem = ref<Record<string, any> | null>(null);
  const formModel = ref<Record<string, any>>({});
  const itemToDelete = ref<Record<string, any> | null>(null);
  const currentAction = ref<CustomAction | null>(null);

  // Open dialog for create/edit
  const openDialog = (item?: any) => {
    isEditing.value = !!item;
    editedItem.value = item ? { ...item } : {};
    formModel.value = item ? { ...item } : {};
    dialog.value = true;
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (item: any) => {
    itemToDelete.value = item;
    deleteDialog.value = true;
  };

  // Open custom action dialog
  const openActionDialog = (action: CustomAction, item: any) => {
    currentAction.value = action;
    editedItem.value = item ? { ...item } : {};
    formModel.value = item ? { ...item } : {};
    actionDialog.value = true;
  };

  // Reset all dialogs and form
  const resetDialogs = () => {
    dialog.value = false;
    deleteDialog.value = false;
    actionDialog.value = false;
    isEditing.value = false;
    editedItem.value = null;
    itemToDelete.value = null;
    currentAction.value = null;
    formModel.value = {};
  };

  // Check if action should be shown for an item
  const shouldShowAction = (action: CustomAction, item: any): boolean => {
    if (!action.condition) return true;
    return action.condition(item);
  };

  // Get all available actions for an item
  const getItemActions = (item: any): CustomButtonAction[] => {
    const actions: CustomButtonAction[] = [];

    // Add CRUD actions
    if (options.actions) {
      if (options.actions.includes('view')) {
        actions.push({
          label: 'View',
          icon: icons.eye,
          color: 'info',
          outlined: true,
          onClick: () => openDialog(item)
        });
      }

      if (options.actions.includes('edit')) {
        actions.push({
          label: 'Edit',
          icon: icons.pencil,
          color: 'primary',
          outlined: true,
          onClick: () => openDialog(item)
        });
      }

      if (options.actions.includes('delete')) {
        actions.push({
          label: 'Delete',
          icon: icons.delete,
          color: 'error',
          outlined: true,
          onClick: () => openDeleteDialog(item)
        });
      }
    }

    // Add route actions
    if (options.routes) {
      Object.entries(options.routes).forEach(([key, route]) => {
        actions.push({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          icon: icons.arrowRight,
          color: 'secondary',
          outlined: true,
          onClick: () => {
            // This will be handled by the parent component
          }
        });
      });
    }

    // Add download actions
    if (options.downloadLink) {
      Object.entries(options.downloadLink).forEach(([key, url]) => {
        actions.push({
          label: `Download ${key}`,
          icon: icons.download,
          color: 'success',
          outlined: true,
          onClick: () => {
            // This will be handled by the parent component
          }
        });
      });
    }

    // Add custom actions
    if (options.customActions) {
      options.customActions.forEach(action => {
        if (shouldShowAction(action, item)) {
          actions.push({
            label: action.title,
            icon: icons.cog,
            color: 'primary',
            outlined: true,
            onClick: () => openActionDialog(action, item)
          });
        }
      });
    }

    // Add dynamic custom buttons
    if (options.customButtonsFn) {
      const dynamicButtons = options.customButtonsFn(item);
      actions.push(...dynamicButtons);
    } else if (options.customButtons) {
      actions.push(...options.customButtons);
    }

    return actions;
  };

  // Check if any actions are available
  const hasAnyActions = computed(() => {
    const hasCrudActions = Array.isArray(options.actions) && options.actions.length > 0;
    const hasRoutes = !!options.routes && Object.keys(options.routes).length > 0;
    const hasDownloadLinks = !!options.downloadLink && Object.keys(options.downloadLink).length > 0;
    const hasCustomActions = Array.isArray(options.customActions) && options.customActions.length > 0;
    const hasCustomButtons = (Array.isArray(options.customButtons) && options.customButtons.length > 0) || !!options.customButtonsFn;

    return hasCrudActions || hasRoutes || hasDownloadLinks || hasCustomActions || hasCustomButtons;
  });

  return {
    // State
    dialog,
    deleteDialog,
    actionDialog,
    isEditing,
    editedItem,
    formModel,
    itemToDelete,
    currentAction,
    hasAnyActions,

    // Methods
    openDialog,
    openDeleteDialog,
    openActionDialog,
    resetDialogs,
    getItemActions,
    shouldShowAction
  };
}
