import { computed } from 'vue';
import { usePermissionsStore } from '@/stores/permissions';

/**
 * Note: This composable is app-specific and includes business logic.
 * It's not exported from the library. Consuming apps should create
 * their own usePermissions composable or use usePermissionsStore directly.
 */
function useCustomerInfoStore() {
  // Stub - this composable is not exported from library
  // Consuming apps should implement their own customer info store
  return {
    isUserInfoLoaded: false,
    getUserRoles: [] as string[],
    getUserLotusRoles: [] as string[],
    hasRole: () => false,
    hasLotusRole: () => false
  };
}

export function usePermissions() {
  const permissionsStore = usePermissionsStore();
  const customerInfo = useCustomerInfoStore();

  // Check if user has permission for a specific menu
  const hasMenuPermission = (menuKey: string) => {
    return permissionsStore.hasMenuPermission(menuKey);
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]) => {
    return permissionsStore.hasAnyRole(roles);
  };

  // Check if user has any of the specified lotus roles
  const hasAnyLotusRole = (roles: string[]) => {
    return permissionsStore.hasAnyLotusRole(roles);
  };

  // Check if user has a specific role
  const hasRole = (role: string) => {
    return customerInfo.hasRole(role);
  };

  // Check if user has a specific lotus role
  const hasLotusRole = (role: string) => {
    return customerInfo.hasLotusRole(role);
  };

  // Get user's roles
  const userRoles = computed(() => customerInfo.getUserRoles);

  // Get user's lotus roles
  const userLotusRoles = computed(() => customerInfo.getLotusRoles);

  // Check if user info is loaded
  const isUserInfoLoaded = computed(() => customerInfo.isUserInfoLoaded);

  // Common permission checks
  const canCreateApproval = computed(() => hasRole('smp_create_approval'));
  const canEditApproval = computed(() => hasRole('smp_edit_approval'));
  const canViewCartable = computed(() => hasRole('SMP_VIEW_CARTABLE'));
  const canOperateCartable = computed(() => hasRole('SMP_CARTABLE_OPERATION'));
  const canViewCartableHistory = computed(() => hasRole('SMP_CARTABLE_HIST'));
  const canViewApprovalHistory = computed(() => hasRole('SMP_APPROVAL_HIST'));
  const canCreateFlowManagement = computed(() => hasRole('SMP_CREATE_FLOW_MNG'));

  return {
    // Permission checking methods
    hasMenuPermission,
    hasAnyRole,
    hasAnyLotusRole,
    hasRole,
    hasLotusRole,
    
    // Computed properties
    userRoles,
    userLotusRoles,
    isUserInfoLoaded,
    
    // Common permission checks
    canCreateApproval,
    canEditApproval,
    canViewCartable,
    canOperateCartable,
    canViewCartableHistory,
    canViewApprovalHistory,
    canCreateFlowManagement
  };
} 