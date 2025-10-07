import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
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
import { getDateFromEpoch } from '../../utils';

export type RoundEditValues = Omit<any, 'resource_id'> & { interview_time?: string };

interface RoundEditFormProps {
  round: any;
  submitLabel?: string;
  onSubmitted?: (updated: any) => void | Promise<void>;
}

const schema = yup.object({
  name: yup.string().required('Round type is required'),
  type: yup.string().required('Round type is required'),
  interviewer: yup.string().optional().nullable().default(null),
  feedback: yup.string().optional().nullable().default(null),
  scheduled_date: yup.string().optional(),
  interview_time: yup.string().optional(),
  status: yup.string().required('Status is required'),
  documents: yup.array().of(
    yup.object({
      filename: yup.string().required(),
      filetype: yup.string().required(),
      filedata: yup.string().required(),
    })
  ).optional().default([]),
});

const RoundEditForm: React.FC<RoundEditFormProps> = ({ round, submitLabel = 'Update Round', onSubmitted }) => {
  const updateRound = useApi(roundsApi.update);
  const constants = useSelector((state: RootState) => state.employee.dashboard?.constants);

  const { control, handleSubmit, watch, setValue, formState: { isValid, isDirty } } = useForm<RoundEditValues>({
    defaultValues: {
      ...round,
      type: round.type || '',
      interviewer: round.interviewer || '',
      scheduled_date: round.scheduled_date || '',
      status: round.status || '',
      documents: round.documents || [],
      feedback: round.feedback || '',
      name: round.name || '',
    },
    resolver: yupResolver(schema),
  });

  const interviewDateTime = watch('interview_time');

  useEffect(() => {
    if(interviewDateTime){
      setValue('scheduled_date', getDateFromEpoch(Number(interviewDateTime)));
    }
  }, [interviewDateTime]);

  const onSubmit = async (values: RoundEditValues) => {
    const initialAttachments = round.documents || [];
    const finalAttachments = values.documents || [];

    const removed_document_ids = initialAttachments
          .filter((ia: any) => !finalAttachments.find((fa: any) => fa.id === ia.id))
          .map((ia: any) => ia.id);
    const new_documents = finalAttachments
          .filter((fa: any) => !fa.id)
          .map((fa: any) => ({
            filename: fa.filename,
            filetype: fa.filetype,
            filedata: fa.filedata,
          }));

    const payload = {
      ...values,
      removed_document_ids,
      new_documents,
    };
    const res = await updateRound.execute(round.id, payload);
    if (onSubmitted) await onSubmitted(res);
  };

  return (
    <ScrollView className="p-6 space-y-6">
      <TextField control={control} name="name" label="Round Name" />
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
        <Button type="submit" variant="primary" onPress={handleSubmit(onSubmit)} disabled={!isValid || !isDirty}>
          {submitLabel}
        </Button>
      </View>
    </ScrollView>
  );
};

export default RoundEditForm;
