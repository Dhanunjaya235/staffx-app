import React, { useEffect, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../UI/Button/Button';
import TextField from '../form-fields/TextField';
import SelectField from '../form-fields/SelectField';
import AttachmentsField, { AttachmentValue } from '../form-fields/AttchmentsFields';

export interface ResourceCreateValues {
  name: string;
  email: string;
  phone: string;
  location?: string;
  jobId: string;
  resourceType: 'Cognine' | 'Vendor' | 'Consultant';
  experience: string;
  skills: string;
  vendorId?: string;
  attachments?: AttachmentValue[];
  interviewStatus: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  location: yup.string().optional(),
  jobId: yup.string().required('Requirement is required'),
  resourceType: yup.string().required('Type is required'),
  experience: yup.string().required('Experience is required'),
  skills: yup.string().optional(),
  vendorId: yup.string().when('resourceType', {
    is: 'Vendor',
    then: (s) => s.required('Vendor is required'),
    otherwise: (s) => s.optional(),
  }),
  attachments: yup.array().of(
    yup.object({
      filename: yup.string().required(),
      filetype: yup.string().required(),
      filedata: yup.string().required(),
    })
  ).optional(),
  interviewStatus: yup.string().required('Status is required'),
});

interface ResourceCreateFormProps {
  clientId?: string;
  jobId?: string;
  onCreateJob: (setJobId: (id: string) => void) => void;
  onCreateVendor: (setVendorId: (id: string) => void) => void;
  onSubmit: (values: any) => Promise<void> | void;
}

const ResourceCreateForm: React.FC<ResourceCreateFormProps> = ({ jobId, onSubmit }) => {
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const constants = useSelector((state: RootState) => state.employee.dashboard?.constants);
  const status_types = constants?.candidate_status_types;
  const employees = useSelector((state: RootState) => state.users?.employees);
  const vendors = useSelector((state: RootState) => state.vendors.VendorsPartial);

  const { control, handleSubmit, watch, setValue, formState: { isValid } } =
    useForm<ResourceCreateValues>({
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        location: '',
        jobId: '',
        resourceType: 'Cognine' as any,
        experience: '0',
        skills: '',
        vendorId: '',
        attachments: [],
        interviewStatus: 'Not Submitted' as any,
      },
      resolver: yupResolver(schema) as any,
      mode: 'onChange',
      reValidateMode: 'onChange',
    });

  useEffect(() => {
    if (jobId) setValue('jobId', jobId);
  }, [jobId, setValue]);

  const selectedJob = jobs.find((j) => String(j.id) === String(jobId));
  const selectedResourceType = watch('resourceType');
  const selectedEmployeeID = watch('name');

  const selectedEmployee = useMemo(() => {
    if (selectedResourceType === 'Cognine' && selectedEmployeeID && employees) {
      return employees.find(emp => emp.employee_id.toString() === selectedEmployeeID.toString());
    }
    return null;
  }, [employees, selectedResourceType, selectedEmployeeID]);

  useEffect(() => {
    setValue('name', '');
  }, [selectedResourceType]);

  return (
    <ScrollView className="p-6 space-y-6">
      {selectedJob && (
        <View className="mb-4 p-3 rounded-md border border-gray-200 bg-gray-50">
          <Text className="text-sm text-gray-700">
            Client: <Text className="font-semibold">{selectedJob.client_name}</Text>
          </Text>
          <Text className="text-sm text-gray-700">
            Requirement: <Text className="font-semibold">{selectedJob.title}</Text>
          </Text>
        </View>
      )}

      <SelectField
        control={control}
        name="resourceType"
        label="Candidate Type"
        options={(constants?.resource_types || []).map(rt => ({ key: rt.value, value: rt.value }))}
        displayKey="value"
        valueKey="value"
        placeholder="Select candidate type"
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

      <TextField control={control} name="experience" label="Experience (years)" required />
      <TextField control={control} name="skills" label="Skills (comma-separated)" />

      <SelectField
        control={control}
        name="interviewStatus"
        label="Candidate Status"
        options={(status_types || []).map(rt => ({ key: rt.value, value: rt.value }))}
        displayKey="value"
        valueKey="value"
        placeholder="Select candidate status"
      />

      <AttachmentsField control={control} name="attachments" label="Attachments (PDF/Word/Excel)" />

      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={handleSubmit(values => {
            onSubmit({
              ...values,
              employee_id: selectedEmployee?.employee_id || null,
              name: selectedEmployee?.name || values.name
            });
          })}
          disabled={!isValid}
          className={`bg-blue-600 px-4 py-2 rounded ${!isValid ? 'opacity-50' : ''}`}
        >
          <Text className="text-white font-semibold">Add Candidate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ResourceCreateForm;
