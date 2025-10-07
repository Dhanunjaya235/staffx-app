// types/api.types.ts

import { Job } from ".";
import { ClientPartial } from "../store/slices/clientsSlice";
import { VendorPartial } from "../store/slices/vendorsSlice";

export interface AssignedRole {
  id: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  role_id: string;
  role_name: string;
  role_display_name: string;
  is_active: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone?: string | null;
}

export interface RemovedContacts extends ContactFormValues {
  id?: string;
  is_active?: boolean | null;
}

// Base Types
export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// Contact Types
export interface ContactIn {
  name: string;
  email: string;
  phone?: string | null;
}

export interface ContactOut {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface ContactEdit {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  is_active?: boolean | null;
}

// Client Types
export interface ClientCreate {
  name: string;
  location: string;
  contacts?: ContactIn[];
}

export interface ClientOut {
  client_accesses: AssignedRole[];
  sales_manager_client_accesses: AssignedRole[];
  id: string;
  name: string;
  location: string;
  contacts?: ContactOut[];
}

export interface ClientUpdate {
  name?: string | null;
  location?: string | null;
  contacts?: ContactEdit[] | null;
}

export interface PaginatedClients {
  total: number;
  page: number;
  page_size: number;
  items: ClientOut[];
}

// Vendor Types
export interface VendorCreate {
  name: string;
  location: string;
  contacts?: ContactIn[];
}

export interface VendorOut {
  id: string;
  name: string;
  location: string;
  contacts?: ContactOut[];
  resources_count?:number;
}

export interface VendorUpdate {
  name?: string | null;
  location?: string | null;
  contacts?: ContactEdit[] | null;
}

export interface PaginatedVendors {
  total: number;
  page: number;
  page_size: number;
  items: VendorOut[];
}

// Document Types
export interface DocumentCreate {
  filename: string;
  filetype: string;
  filedata: string; // Base64 encoded
}

export interface DocumentOut {
  id: string;
  filename: string;
  filetype: string;
  filedata: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Job Types
export interface JobContactCreate {
  name: string;
  email: string;
  phone?: string | null;
}

export interface JobContactOut {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobCreate {
  title: string;
  role: string;
  positions: number;
  relative_experience: string;
  total_experience: string;
  skills_required: string;
  location: string;
  type: string;
  description?: string | null;
  client_id: string;
  practice_ids: number[];
  documents?: DocumentCreate[];
  contacts?: ContactIn[];
  status: string;
  recruiter_role_ids?: (string | number)[];
  removedContacts?: RemovedContacts[];
  removed_document_ids?: (string | number)[];
  removed_role_ids?: (string | number)[];
  added_role_ids?: (string | number)[];
  new_documents?: DocumentCreate[];
  job_accesses?: JobAccesses[];
  added_practice_ids?: (number|string)[];
  removed_practice_ids?: (number|string)[];
  assigned_practices?:AssingedPractice[];

}

export interface JobUpdate {
  title?: string | null;
  role?: string | null;
  positions?: number | null;
  relative_experience?: string | null;
  total_experience?: string | null;
  skills_required?: string | null;
  location?: string | null;
  type?: string | null;
  description?: string | null;
  is_active?: boolean | null;
  removed_document_ids?: string[];
  new_documents?: DocumentCreate[];
  new_contacts?: JobContactCreate[];
  remove_contacts?: string[];
}
export interface JobAccesses {
  id: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  employee_role_id: string;
  role_id: string;
  role_name: string;
}

export interface AssingedPractice {
  id: string;
  practice_id: number;
  practice_name: string;
  is_active: boolean;
  created_at: string;  // ISO timestamp
  updated_at: string;  // ISO timestamp
}
export interface JobOut {
  id: string;
  title: string;
  role: string;
  positions: number;
  relative_experience: string;
  total_experience: string;
  skills_required: string;
  location: string;
  type: string;
  description: string | null;
  is_active: boolean;
  client_id: string;
  created_at: string;
  updated_at: string;
  documents?: DocumentOut[];
  practice_ids?: number[];
  contacts?: JobContactOut[];
  status: string;
  job_accesses?: JobAccesses[];
  assigned_practices?:AssingedPractice[];
  start_date?:string;
  client_name?:string;
}

export interface JobListOut {
  id: string;
  title: string;
  positions: number;
  type: string;
  client_name: string;
}

export interface PaginatedJobs {
  total: number;
  page: number;
  page_size: number;
  items: Job[];
}

// Resource Types
export interface ResourceCreate {
  name: string;
  email: string;
  phone?: string | null;
  total_experience: string;
  skills: string;
  location?: string | null;
  resource_type: string;
  status: string;
  job_id: string;
  vendor_id?: string | null;
  documents?: DocumentCreate[];
}

export interface ResourceUpdate {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  total_experience?: string | null;
  skills?: string | null;
  location?: string | null;
  resource_type?: string | null;
  status?: string | null;
  is_active?: boolean | null;
  vendor_id?: string | null;
  removed_document_ids?: string[];
  new_documents?: DocumentCreate[];
}

export interface ResourceOut {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  total_experience: string;
  skills: string;
  is_active: boolean;
  location: string | null;
  resource_type: string;
  status: string;
  job_id: string;
  vendor_id: string | null;
  created_at: string;
  updated_at: string;
  documents?: DocumentOut[];
  experience?:string;
  employee_id?:number;
}

export interface ResourceListOut {
  id: string;
  name: string;
  email: string;
  resource_type: string;
  status: string;
  total_experience: string;
  location: string | null;
  is_active: boolean;
  job_id: string;
}

export interface PaginatedResources {
  total: number;
  page: number;
  page_size: number;
  items: ResourceListOut[];
}

// Round Types
export interface RoundCreate {
  name: string;
  type: string;
  status: string;
  scheduled_date: string;
  interviewer: string | null;
  feedback: string | null;
  resource_id: string;
  documents: DocumentCreate[];
}

export interface RoundUpdate {
  name?: string | null;
  type?: string | null;
  status?: string | null;
  scheduled_date?: string | null;
  interviewer?: string | null;
  feedback?: string | null;
  is_active?: boolean | null;
  removed_document_ids?: string[];
  new_documents?: DocumentCreate[];
  documents?: DocumentOut[];
}

export interface RoundOut {
  id: string;
  name: string;
  type: string;
  status: string;
  scheduled_date: string;
  is_active: boolean;
  interviewer: string | null;
  feedback: string | null;
  resource_id: string;
  created_at: string;
  updated_at: string;
  documents?: DocumentOut[];
}

// Employee Role Mapping Types
export interface EmployeeRoleMappingCreate {
  employee_id: number;
  role_ids: string[];
}

export interface EmployeeRoleMappingUpdate {
  employee_id: number;
  new_roles?: string[];
  removed_roles?: string[];
}

export interface EmployeeRoleMappingOut {
  id: string;
  employee_id: number;
  role_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeRoleMappingDetailOut {
  id: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  role_id: string;
  role_name: string;
  role_display_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeRoleMappingBulkResponse {
  created?: EmployeeRoleMappingOut[];
  updated?: EmployeeRoleMappingOut[];
  errors?: unknown[];
}
export interface Practice {
  practice_id: number;
  practice_name: string;
}

export interface EmployeeWithPractices {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  practices: Practice[];
}
export interface PaginatedEmployeeRoleMappings {
  total: number;
  page: number;
  page_size: number;
  items: EmployeeRoleMappingDetailOut[];
  employees?: unknown[];
  roles?: unknown[];
  employees_with_practices: EmployeeWithPractices[];
}

// Query Parameters Types
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface JobsQueryParams extends PaginationParams {
  client_id?: string | null;
  client_name?: string | null;
}

export interface ResourcesQueryParams extends PaginationParams {
  job_id?: string | null;
  resource_status?: string | null;
}

export interface RoundsQueryParams {
  resource_id: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  message: string;
  status?: number;
  detail?: unknown;
}

//Dashboard types
export interface DashboardAssignedRoleOut {
  mapping_id: string;
  role_id: string;
  role_name: string;
  role_display_name: string;
  assigned_at: string;
  is_active: boolean;
}

export interface DashboardConstantsOut {
  round_types: DashboardConstantItem[];
  requirement_status_types: DashboardConstantItem[];
  resource_types: DashboardConstantItem[];
  candidate_status_types: DashboardConstantItem[];
  interview_status_types: DashboardConstantItem[];
}

export interface DashboardConstantItem {
  key: string;
  value: string;
}

export interface DashboardEmployeeOut {
  id: number;
  name: string;
  email: string;
  job_title: string | null;
  department: string | null;
  date_of_joining: string | null;
  is_active: boolean;
}

export interface DashboardOut {
  employee: DashboardEmployeeOut;
  assigned_roles: DashboardAssignedRoleOut[];
  total_roles: number;
  practices: DashboardPracticeOut[];
  constants: DashboardConstantsOut | null;
  clients?: ClientPartial[];
  vendors?: VendorPartial[];
}

export interface DashboardPracticeOut {
  id: number;
  name: string;
  management_email: string | null;
  group_email: string | null;
  is_active: boolean;
}


export type ApiErrorDetail =
  | string
  | { [key: string]: any }
  | Array<{ [key: string]: any }>;