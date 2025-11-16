import type { Directive } from 'vue';
import { usePermissionsStore } from '@/stores/permissions';

export const vPermission: Directive = {
  mounted(el, binding) {
    const permissionsStore = usePermissionsStore();
    
    // Check if user has permission for the specified menu key
    const hasPermission = permissionsStore.hasMenuPermission(binding.value);
    
    if (!hasPermission) {
      // Hide the element if user doesn't have permission
      el.style.display = 'none';
    }
  },
  
  updated(el, binding) {
    const permissionsStore = usePermissionsStore();
    
    // Check if user has permission for the specified menu key
    const hasPermission = permissionsStore.hasMenuPermission(binding.value);
    
    if (!hasPermission) {
      // Hide the element if user doesn't have permission
      el.style.display = 'none';
    } else {
      // Show the element if user has permission
      el.style.display = '';
    }
  }
}; 