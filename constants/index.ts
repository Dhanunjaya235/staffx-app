import { ROLE_DISPLAY_NAMES } from "../store/slices/employeeSlice";

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

export { ROLE_PERMISSIONS }