import React, { useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../UI/Button/Button';
import TextField from '../form-fields/TextField';
import SelectField from '../form-fields/SelectField';
import AttachmentsField from '../form-fields/AttchmentsFields';
import TextAreaField from '../form-fields/TextAreaField';
import { roundsApi } from '../../services/api/roundsApi';
import { useApi } from '../../hooks/useApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { RoundCreate } from '../../types/staffx-types';
import { getDateFromEpoch } from '../../utils';

export type RoundCreateValues = Omit<RoundCreate, 'resource_id'> & { interview_time?: string }

interface RoundCreateFormProps {
  resource: { id: string; name?: string; jobTitle?: string; clientName?: string };
  defaultValues?: Partial<RoundCreateValues>;
  submitLabel?: string;
  onSubmitted?: (created: any) => void | Promise<void>;
}

const minEpoch = new Date(2018, 7, 1).getTime();

const schema = yup.object({
  name: yup.string().required('Round name is required'),
  type: yup.string().required('Round type is required'),
  interviewer: yup.string().optional().nullable().default(null),
  feedback: yup.string().optional().nullable().default(null),
  scheduled_date: yup.string().optional(),
  interview_time: yup.string().optional()
    .test("min-date", "Interview time cannot be earlier than July 1, 2018", (value) => {
      if (!value) return true;
      const epoch = Number(value);
      if (isNaN(epoch)) return false;
      const normalizedEpoch = epoch < 1e12 ? epoch * 1000 : epoch;
      return normalizedEpoch >= minEpoch;
    }),
  status: yup.string().required('Status is required'),
  documents: yup.array().of(
    yup.object({
      filename: yup.string().required(),
      filetype: yup.string().required(),
      filedata: yup.string().required(),
    })
  ).optional().default([]),
});

const RoundCreateForm: React.FC<RoundCreateFormProps> = ({ resource, defaultValues, submitLabel = 'Schedule Round', onSubmitted }) => {
  const createRound = useApi(roundsApi.create);
  const constants = useSelector((state: RootState) => state.employee.dashboard?.constants);

  const { control, handleSubmit, watch, setValue, formState: { isValid } } = useForm<RoundCreateValues>({
    mode: 'onChange',
    defaultValues: {
      type: '',
      interviewer: '',
      scheduled_date: '',
      status: 'Scheduled',
      documents: [],
      feedback: '',
      name: '',
      interview_time: '',
      ...defaultValues,
    },
    resolver: yupResolver(schema),
  });

  const interviewDateTime = watch('interview_time');

  useEffect(() => {
    if (interviewDateTime) {
      setValue('scheduled_date', getDateFromEpoch(Number(interviewDateTime)));
    }
  }, [interviewDateTime]);

  const onSubmit = async (values: RoundCreateValues) => {
    const payload = { ...values, resource_id: resource.id };
    const res = await createRound.execute(payload);
    if (onSubmitted) await onSubmitted(res);
  };

  return (
    <ScrollView className="p-6 space-y-6">
      <View className="bg-gray-50 p-4 rounded-md">
        <Text className="font-medium text-gray-900">Candidate: {resource.name}</Text>
        {(resource.jobTitle || resource.clientName) && (
          <Text className="text-sm text-gray-600">
            {resource.jobTitle} {resource.clientName ? `at ${resource.clientName}` : ''}
          </Text>
        )}
      </View>

      <TextField control={control} name="name" label="Round Name" required />
      <SelectField 
        control={control} 
        name="type" 
        label="Round Type" 
        options={(constants?.round_types || []) as any}
        displayKey={'value' as any}
        valueKey={'value' as any}
        placeholder='Select round type'
      />
      <SelectField 
        control={control} 
        name="status" 
        label="Status" 
        options={(constants?.interview_status_types || []) as any}
        displayKey={'value' as any}
        valueKey={'value' as any}
        placeholder='Select status'
      />
      <TextField control={control} name="interviewer" label="Interviewer" required={false} />
      <TextField control={control} name="interview_time" label="Interview Date and Time" type="datetime-local" required={false} />
      <TextAreaField control={control} name="feedback" label="Feedback" rows={4} required={false} />
      <AttachmentsField control={control} name="documents" label="Attachments (PDF/Word/Excel)" />

      <View className="flex flex-row justify-end">
        <Button type="submit" variant="primary" onPress={handleSubmit(onSubmit)} disabled={!isValid}>
          {submitLabel}
        </Button>
      </View>
    </ScrollView>
  );
};

export default RoundCreateForm;
