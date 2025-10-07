import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { jobsApi } from '../../services/api/jobsApi';
import DocumentCard from '../UI/document/DocumentCard';
import type { OptionLike } from './JobForm';

export interface AttachmentValue {
  id: string;
  filename: string;
  filetype: string;
  filedata: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssignedPractice {
  id: string;
  practice_id: number;
  practice_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobAccess {
  id: string;
  employee_role_id: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  role_id: string;
  role_name: string;
}

export interface JobViewData {
  id: string;
  title: string;
  role: string;
  positions: number;
  relative_experience: string;
  total_experience: string;
  skills_required: string;
  location: string;
  type: string;
  status: string;
  description?: string | null;
  is_active: boolean;
  client_id: string;
  created_at: string;
  updated_at: string;
  documents: AttachmentValue[];
  assigned_practices: AssignedPractice[];
  contacts: any[];
  job_accesses: JobAccess[];
}

interface JobViewFormProps {
  jobId: string;
  clients: OptionLike[];
}

const JobViewForm: React.FC<JobViewFormProps> = ({ jobId, clients }) => {
  const [job, setJob] = useState<JobViewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsApi.getJobById(jobId);
        setJob(res.data as JobViewData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const assignedRecruiters = useMemo(
    () => (job?.job_accesses || []).map(j => j.employee_name).join(', '),
    [job]
  );

  const selectedClient = clients.find(c => String(c.id) === String(job?.client_id));
  const selectedPractices = (job?.assigned_practices || []).map(p => p.practice_name).join(', ');

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!job) {
    return (
      <View className="p-6">
        <Text className="text-base font-medium text-gray-900">Requirement details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-6 space-y-4">
      {/* Client Info */}
      <View className="p-3 rounded-md border border-gray-200 bg-gray-50">
        <Text className="text-sm text-gray-700">Client</Text>
        <Text className="text-base font-medium text-gray-900">
          {selectedClient?.company || selectedClient?.name || job.client_id}
        </Text>
      </View>

      {/* Requirement info */}
      <View className="grid grid-cols-2 gap-4">
        <View>
          <Text className="text-sm text-gray-700">Requirement Title</Text>
          <Text className="text-base font-medium text-gray-900">{job.title}</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-700">Role</Text>
          <Text className="text-base font-medium text-gray-900">{job.role}</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-700">Positions</Text>
          <Text className="text-base font-medium text-gray-900">{job.positions}</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-700">Location</Text>
          <Text className="text-base font-medium text-gray-900">{job.location}</Text>
        </View>
      </View>

      <View>
        <Text className="text-sm text-gray-700">Skills (comma-separated)</Text>
        <Text className="text-base font-medium text-gray-900">{job.skills_required}</Text>
      </View>

      <View>
        <Text className="text-sm text-gray-700">Description</Text>
        <Text className="text-base font-medium text-gray-900">{job.description || '-'}</Text>
      </View>

      <View className="grid grid-cols-2 gap-4">
        <View>
          <Text className="text-sm text-gray-700">Requirement Type</Text>
          <Text className="text-base font-medium text-gray-900">{job.type}</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-700">Status</Text>
          <Text className="text-base font-medium text-gray-900">{job.status}</Text>
        </View>
      </View>

      <View className="grid grid-cols-2 gap-4">
        <View>
          <Text className="text-sm text-gray-700">Total Experience</Text>
          <Text className="text-base font-medium text-gray-900">{job.total_experience}</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-700">Relative Experience</Text>
          <Text className="text-base font-medium text-gray-900">{job.relative_experience}</Text>
        </View>
      </View>

      <View className="grid grid-cols-2 gap-4">
        <View>
          <Text className="text-sm text-gray-700">Related Practices</Text>
          <Text className="text-base font-medium text-gray-900">{selectedPractices || '-'}</Text>
        </View>
        <View>
          <Text className="text-sm text-gray-700">Assigned Recruiters</Text>
          <Text className="text-base font-medium text-gray-900">{assignedRecruiters || '-'}</Text>
        </View>
      </View>

      {/* Attachments */}
      <View>
        <Text className="text-sm text-gray-700">Attachments</Text>
        {job.documents?.length ? (
          <View className="mt-3 space-y-3">
            {job.documents.map((doc, index) => (
              <DocumentCard key={doc.id || index} document={doc} index={index} />
            ))}
          </View>
        ) : (
          <Text className="text-base font-medium text-gray-900">No attachments available.</Text>
        )}
      </View>

      {/* Contacts */}
      {job.contacts?.length > 0 && (
        <View className="space-y-2">
          <Text className="text-sm text-gray-700">Contacts</Text>
          {job.contacts.map((contact, idx) => (
            <View
              key={contact.id || idx}
              className="p-3 border rounded-md flex-row justify-between"
            >
              <View>
                <Text className="font-medium text-gray-900">{contact.name}</Text>
                <Text className="text-sm text-gray-600">{contact.email}</Text>
                {contact.phone && <Text className="text-sm text-gray-600">{contact.phone}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default JobViewForm;
