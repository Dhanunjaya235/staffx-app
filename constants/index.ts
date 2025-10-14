export const Roles = {
  ADMIN: 'ADMIN',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
  RECRUITER: 'RECRUITER',
  DELIVERY_MANAGER: 'DELIVERY_MANAGER',
  PRACTICE_LEAD: 'PRACTICE_LEAD',
  SALES_MANAGER: 'SALES_MANAGER',
} as const;

export type RoleKey = keyof typeof Roles;
export type RoleValue = typeof Roles[RoleKey];

// ====== Display Names ======
export const ROLE_DISPLAY_NAMES: Record<RoleValue, string> = {
  [Roles.ADMIN]: 'Admin',
  [Roles.ACCOUNT_MANAGER]: 'Account Manager',
  [Roles.RECRUITER]: 'Recruiter',
  [Roles.DELIVERY_MANAGER]: 'Delivery Manager',
  [Roles.PRACTICE_LEAD]: 'Practice Lead',
  [Roles.SALES_MANAGER]: 'Sales Manager',
};

const ROLE_PERMISSIONS: Record<string, string[]> = {

    [ROLE_DISPLAY_NAMES.ADMIN]: [
        'Full Access (All Features, All Permissions)',
    ],
    [ROLE_DISPLAY_NAMES.SALES_MANAGER]: [
        'Clients - View, Create and Edit(Assigned)',
        'Requirements - View, Create and Edit',
        'Track Candidates - View, Create and Edit',
    ],
    [ROLE_DISPLAY_NAMES.ACCOUNT_MANAGER]: [
        'Clients - Only View (Assigned)',
        'Requirements - View, Create and Edit',
        'Track Candidates - View, Create and Edit',
    ],

    [ROLE_DISPLAY_NAMES.RECRUITER]: [
        'Requirements - Only View (Assigned)',
        'Track Candidates - View, Create and Edit',
        'Vendors - View, Create and Edit',
    ],

    [ROLE_DISPLAY_NAMES.DELIVERY_MANAGER]: [
        'Requirements - Only View',
        'Track Candidates (All Practices) - View, Create and Edit',
    ],

    [ROLE_DISPLAY_NAMES.PRACTICE_LEAD]: [
        'Requirements (Practice Specific) - Only View',
        'Track Candidates (Practice Specific) - View, Create and Edit',
    ],


};

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
const TENANT_ID = process.env.EXPO_PUBLIC_TENANT_ID;
const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`;
const SCOPES = ["openid", "profile", "email", "offline_access", `api://${CLIENT_ID}/app`];

export { ROLE_PERMISSIONS, CLIENT_ID, TENANT_ID, AUTHORITY, SCOPES };
