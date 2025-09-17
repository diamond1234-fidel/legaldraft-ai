
import { UserRole } from './types';

export interface RolePermissions {
  canAccessBilling: boolean;
  canAccessAdmin: boolean;
  canDraft: boolean;
  canReview: boolean;
  canResearch: boolean;
  canPerformIntake: boolean;
  canManageClients: boolean;
}

export const ROLES_PERMISSIONS: Record<UserRole, RolePermissions> = {
  lawyer: {
    canAccessBilling: true,
    canAccessAdmin: false,

    canDraft: true,
    canReview: true,
    canResearch: true,
    canPerformIntake: true,
    canManageClients: true,
  },
  paralegal: {
    canAccessBilling: false,
    canAccessAdmin: false,
    canDraft: true,
    canReview: true,
    canResearch: true,
    canPerformIntake: true,
    canManageClients: true,
  },
  admin: {
    canAccessBilling: true,
    canAccessAdmin: true,
    canDraft: true,
    canReview: true,
    canResearch: true,
    canPerformIntake: true,
    canManageClients: true,
  },
};
