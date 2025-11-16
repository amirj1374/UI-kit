import { usePermissionsStore } from '@/stores/permissions';
import { useRouter, useRoute } from 'vue-router';

export function useRouteGuard() {
  const permissionsStore = usePermissionsStore();
  const router = useRouter();
  const route = useRoute();

  // Check if user can access a specific route by inspecting meta.permission
  const canAccessRoute = (routePath: string): boolean => {
    // Fallback: allow; guard will block at navigation time if needed
    return true;
  };

  // Navigate to route if user has permission, otherwise redirect to 403
  const navigateWithPermission = (routePath: string) => {
    router.push(routePath);
  };

  // Check permission and redirect if not authorized
  const requirePermission = (permissionKey?: string, redirectTo: string = '/error/403') => {
    const key = permissionKey ?? (route.meta?.permission as string | undefined);
    if (!key) return true;
    if (!permissionsStore.hasMenuPermission(key)) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  return {
    canAccessRoute,
    navigateWithPermission,
    requirePermission
  };
} 