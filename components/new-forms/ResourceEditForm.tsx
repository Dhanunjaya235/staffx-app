import React, { useEffect, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '../form-fields/TextField';
import SelectField from '../form-fields/SelectField';
import AttachmentsField, { AttachmentValue } from '../form-fields/AttchmentsFields';
import { ResourceOut } from '../../types/staffx-types';
import  Button from '../UI/Button/Button';
import { ChevronDown } from 'lucide-react-native';

export interface ResourceEditValues {
  name: string | number;
  email: string;
  phone: string;
  location: string;
  jobId: string;
  resourceType: string;
  experience: string;
  skills: string;
  vendorId: string | null;
  attachments: AttachmentValue[];
  interviewStatus: string;
}

const schema = yup.object({
  name: yup.mixed().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  location: yup.string().optional().default(''),
  jobId: yup.string().required('Requirement is required'),
  resourceType: yup.string().required('Type is required').default('Cognine'),
  experience: yup.string().required('Experience is required'),
  skills: yup.string().optional().default(''),
  vendorId: yup.string().when('resourceType', {
    is: 'Vendor',
    then: (s) => s.required('Vendor is required'),
    otherwise: (s) => s.optional(),
  }).nullable().default(''),
  attachments: yup.array().of(
    yup.object({
      filename: yup.string().required(),
      filetype: yup.string().required(),
      filedata: yup.string().required(),
    })
  ).optional().default([]),
  interviewStatus: yup.string().required('Status is required'),
});

interface ResourceEditFormProps {
  resource: ResourceOut;
  onSubmit: (values: any) => Promise<void> | void;
}

const ResourceEditForm: React.FC<ResourceEditFormProps> = ({ resource, onSubmit }) => {
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const vendors = useSelector((state: RootState) => state.vendors.VendorsPartial);
  const constants = useSelector((state: RootState) => state.employee.dashboard?.constants);
  const status_types = constants?.candidate_status_types;
  const employees = useSelector((state: RootState) => state.users?.employees);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
    setValue,
    watch
  } = useForm<ResourceEditValues>({
    defaultValues: {
      ...resource,
      name: resource?.resource_type === 'Cognine' ? resource?.employee_id : resource?.name,
      email: resource?.email,
      phone: resource?.phone || '',
      location: resource?.location || '',
      jobId: resource?.job_id,
      resourceType: resource.resource_type as 'Cognine' | 'Vendor' | 'Consultant',
      experience: resource.experience,
      skills: resource.skills,
      vendorId: resource.vendor_id || '',
      attachments: (resource.documents || []).map((d: any) => ({
        id: d.id,
        filename: d.filename,
        filetype: d.filetype,
        filedata: d.filedata,
      })),
      interviewStatus: resource?.status,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (resource) {
      reset({
        ...resource,
        name: resource?.resource_type === 'Cognine' ? resource?.employee_id : resource?.name,
        email: resource?.email,
        phone: resource?.phone || '',
        location: resource?.location || '',
        jobId: resource?.job_id,
        resourceType: resource.resource_type as 'Cognine' | 'Vendor' | 'Consultant',
        experience: resource.experience,
        skills: resource.skills,
        vendorId: resource.vendor_id || '',
        attachments: (resource.documents || []).map((d: any) => ({
          id: d.id,
          filename: d.filename,
          filetype: d.filetype,
          filedata: d.filedata,
        })),
        interviewStatus: resource?.status,
      });
    }
  }, [resource, reset]);

  const selectedResourceType = useWatch({ control, name: 'resourceType' });
  const selectedEmployeeID = watch('name');

  const selectedEmployee = useMemo(() => {
    if (selectedResourceType === 'Cognine' && selectedEmployeeID && employees) {
      return employees?.find((emp) => emp.employee_id.toString() === selectedEmployeeID.toString());
    }
    return null;
  }, [employees, selectedResourceType, selectedEmployeeID]);

  useEffect(() => {
    if (selectedEmployee) setValue('name', selectedEmployee?.employee_id);
  }, [selectedEmployee]);

  const selectedJob = jobs.find((j) => String(j.id) === String(resource.job_id));

  return (
    <ScrollView className="p-6 space-y-6">
      {selectedJob && (
        <View className="mb-4 p-3 rounded-md border border-gray-200 bg-gray-50">
          <Text className="text-sm text-gray-700">
            Client: <Text className="font-bold">{selectedJob.client_name}</Text>
          </Text>
          <Text className="text-sm text-gray-700">
            Requirement: <Text className="font-bold">{selectedJob.title}</Text>
          </Text>
        </View>
      )}

      <SelectField
        control={control}
        name="resourceType"
        label="Candidate Type"
        options={(constants?.resource_types || []).map((rt) => ({ key: rt.value, value: rt.value }))}
        displayKey="value"
        valueKey="value"
        placeholder="Select resource type"
        onChange={() => setValue('name', '')}
      />

      {selectedResourceType === 'Cognine' ? (
        <SelectField
          control={control}
          name="name"
          label="Select Employee"
          options={employees || [] as any}
          displayKey="name"
          valueKey="employee_id"
          placeholder="Select Employee"
        />
      ) : (
        <TextField control={control} name="name" label="Full Name" required />
      )}

      <TextField control={control} name="email" label="Email" type="text" required />
      <TextField control={control} name="phone" label="Phone" type="text" required />
      <TextField control={control} name="location" label="Location" />

      {selectedResourceType === 'Vendor' && (
        <SelectField
          control={control}
          name="vendorId"
          label="Select Vendor"
          options={vendors as any}
          displayKey="name"
          valueKey="id"
          placeholder="Select vendor"
        />
      )}

      <TextField control={control} name="experience" label="Experience (years)" type="text" required />
      <TextField control={control} name="skills" label="Skills (comma-separated)" />

      <SelectField
        control={control}
        name="interviewStatus"
        label="Candidate Status"
        options={status_types as any}
        displayKey="value"
        valueKey="value"
        placeholder="Select status"
      />

      <AttachmentsField control={control} name="attachments" label="Attachments (PDF/Word/Excel)" />

      <TouchableOpacity
        disabled={!isValid || !isDirty}
        onPress={handleSubmit((values) => onSubmit({
          ...values,
          employee_id: selectedEmployee?.employee_id || null,
          name: selectedEmployee?.name || values.name
        }))}
        className={`px-4 py-3 rounded-md ${isValid && isDirty ? 'bg-blue-600' : 'bg-gray-400'}`}
      >
        <Text className="text-white text-center font-bold">Update Candidate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResourceEditForm;