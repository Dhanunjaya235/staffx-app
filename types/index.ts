export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Job Manager' | 'Recruiter';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  location: string;
  contacts: Contact[];
  jobsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  jobRole: string;
  numberOfPositions: number;
  relativeExperience: string;
  jobLocation: string;
  jobTitle: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract';
  totalExperience: string;
  jobDescription: string;
  contacts: Contact[];
  attachments: Attachment[];
  resources_count: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  base64: string;
  uploadedAt: string;
}

export interface Resource {
  id: string;
  jobId: string;
  resourceType: 'Cognine'|'Vendor'|'Consultant';
  vendorId?: string;
  personalEmail: string;
  mobileNumber: string;
  passportPhoto?: Attachment;
  resume?: Attachment;
  rateCard?: Attachment;
  location: string;
  totalExperience: string;
  skills: string[];
  roundsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Round {
  id: string;
  resourceId: string;
  roundType: 'Technical' | 'HR' | 'Managerial' | 'Final';
  roundName: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  attachments: Attachment[];
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface GridColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface GridAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (item: any) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}