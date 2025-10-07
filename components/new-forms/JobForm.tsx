import React, { useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// import { tw } from 'nativewind';
import Button from '../UI/Button/Button';
import TextField from '../form-fields/TextField';
import TextAreaField from '../form-fields/TextAreaField';
import SelectField from '../form-fields/SelectField';
import AttachmentsField, { AttachmentValue } from '../form-fields/AttchmentsFields';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ContactFormValues } from './ContactForm';
import { ContactCard } from './ContactCard';
import { JobCreate } from '../../types/staffx-types';

export interface OptionLike {
  id: string | number;
  name?: string;
  company?: string;
}
export type JobFormValues = Omit<JobCreate, 'documents' | 'contacts'> & {
  documents?: AttachmentValue[];
  contacts?: ContactFormValues[];
  start_date?: string;
};

interface JobFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: Partial<JobFormValues>;
  clients: OptionLike[];
  onSubmit: (values: JobCreate) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  clientId?: string;
}

const minDate = new Date(2018, 7, 1);

const schema = yup.object({
  title: yup.string().required('Title is required'),
  positions: yup.number().typeError('Enter a number').integer().min(1).required('Positions required'),
  relative_experience: yup.string().required('Related experience is required'),
  total_experience: yup.string().required('Total experience is required'),
  skills_required: yup.string().optional(),
  location: yup.string().required('Location is required'),
  status: yup.string().required('Status is required'),
  description: yup.string().nullable(),
  client_id: yup.string().required('Client is required'),
  practice_ids: yup.array(yup.number()).default([]),
  recruiter_role_ids: yup.array(yup.mixed()).default([]),
  contacts: yup.array().of(
    yup.object({
      name: yup.string().trim().required('Contact name is required'),
      email: yup.string().trim().email('Invalid email').required('Contact email is required'),
      phone: yup.string().nullable(),
    })
  ).optional(),
  start_date: yup.string().nullable().notRequired()
    .test("min-date", "Date cannot be earlier than July 2018", (value) => {
      if (!value) return true;
      const inputDate = new Date(value);
      return !isNaN(inputDate.getTime()) && inputDate >= minDate;
    })
});

const removedContactsSchema = yup.array().of(
  yup.object({
    id: yup.string().nullable(),
    name: yup.string(),
    email: yup.string().email(),
    phone: yup.string().nullable(),
    is_active: yup.boolean(),
  })
).default([]);

const JobForm: React.FC<JobFormProps> = ({ mode = 'create', defaultValues, clients, onSubmit, onCancel, submitLabel, clientId }) => {
  const finalSchema = React.useMemo(() => {
    if (mode === 'edit') {
      return schema.shape({
        removedContacts: removedContactsSchema,
        added_role_ids: yup.array(yup.string()).default([]),
        removed_role_ids: yup.array(yup.string()).default([]),
        removed_document_ids: yup.array(yup.string()).default([]),
      });
    }
    return schema;
  }, [mode]);

  const { control, handleSubmit, formState: { isValid, isDirty }, setValue, getValues, trigger, resetField } = useForm<JobFormValues>({
    defaultValues: {
      title: '',
      positions: 1,
      relative_experience: '',
      total_experience: '',
      skills_required: '',
      location: '',
      description: '',
      client_id: clientId || '',
      practice_ids: [],
      documents: [],
      contacts: [],
      status: 'Open',
      recruiter_role_ids: [],
      removedContacts: [],
      removed_role_ids: [],
      added_role_ids: [],
      removed_document_ids: [],
      new_documents: [],
      start_date: '',
      ...defaultValues,
    },
    resolver: yupResolver(finalSchema) as any,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (clientId) setValue('client_id', clientId);
  }, [clientId]);

  const users = useSelector((state: RootState) => state.users.users) as any[] | undefined;
  const recruiterOptions = React.useMemo(() => {
    const seen = new Set<number | string>();
    const list: { id: string; name: string }[] = [];
    (users || []).filter(m => m.role_name === 'RECRUITER').forEach(m => {
      if (!seen.has(m.employee_id)) {
        seen.add(m.employee_id);
        list.push({ id: m.id, name: m.employee_name });
      }
    });
    return list;
  }, [users]);

  const { fields: contactFields, append, update, remove } = useFieldArray({
    control,
    name: 'contacts' as const,
    keyName: 'fieldId',
  });

  const handleContactSave = async (index: number, values: ContactFormValues) => {
    update(index, values);
    const contacts = getValues('contacts') || [];
    contacts[index] = values;
    setValue('contacts', contacts, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    await trigger();
  };

  const handleContactDelete = async (index: number) => {
    if (mode === 'edit') {
      const currentContacts = getValues('contacts') || [];
      const removedContact = currentContacts[index];
      if (removedContact) {
        const currentRemoved = getValues('removedContacts') || [];
        setValue('removedContacts', [...currentRemoved, { ...removedContact, is_active: false }], { shouldDirty: true, shouldValidate: true, shouldTouch: true });
      }
    }
    remove(index);
    await trigger();
  };

  const handleAddContact = () => append({ name: '', phone: '', email: '' });

  const onInternalSubmit: SubmitHandler<JobFormValues> = (values) => {
    const added_role_ids = (values.recruiter_role_ids || []).filter(rid => !(defaultValues?.recruiter_role_ids || []).includes(rid));
    const newDocuments = (values.documents || []).filter(d => !d.id).map(d => ({ filename: d.filename, filetype: d.filetype, filedata: d.filedata }));
    const newPracticeIds = (values.practice_ids || []).filter(pid => !(defaultValues?.practice_ids || []).includes(pid));

    setValue('new_documents', newDocuments);

    const payload: JobCreate = {
      ...values,
      title: values.title,
      positions: Number(values.positions),
      relative_experience: values.relative_experience,
      total_experience: values.total_experience,
      skills_required: values.skills_required,
      location: values.location,
      description: values.description || null,
      client_id: clientId || values.client_id,
      practice_ids: (values.practice_ids || []).map(Number),
      documents: mode === 'create' ? values.documents?.map(d => ({ filename: d.filename, filetype: d.filetype, filedata: d.filedata })) : [],
      contacts: [...(values.contacts || []), ...(values.removedContacts || [])],
      status: values.status,
      recruiter_role_ids: values.recruiter_role_ids,
      added_role_ids: mode === 'edit' ? added_role_ids : undefined,
      new_documents: mode === 'edit' ? newDocuments : undefined,
      removed_document_ids: values.removed_document_ids,
      removed_practice_ids: values.removed_practice_ids,
      added_practice_ids: newPracticeIds,
    };
    return onSubmit(payload);
  };

  const selectedClient = clients.find(c => String(c.id) === String(clientId));
  const practices = useSelector((state: RootState) => state.employee.dashboard?.practices);
  const status_types = useSelector((state: RootState) => state.employee.dashboard?.constants?.requirement_status_types);

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      {clientId ? (
         <View className="p-3 rounded-md border border-gray-200 bg-gray-50">
    <Text className="text-sm text-gray-700">Client</Text>
    <Text className="text-base font-medium text-gray-900">
      {selectedClient?.company || selectedClient?.name || clientId}
    </Text>
  </View>
      ) : (
        <SelectField control={control} name="client_id" label="Select Client" options={clients as any} displayKey="name" valueKey="id" placeholder="Select client" />
      )}

      <TextField control={control} name="title" label="Requirement Title" required />
      <SelectField
        control={control}
        name="recruiter_role_ids"
        label="Recruiter(s)"
        options={recruiterOptions as any}
        displayKey="name"
        valueKey="id"
        multiple
        placeholder="Select recruiter(s)"
        onRemove={(value:number|string) => {
          const current = getValues('removed_role_ids') || [];
          setValue('removed_role_ids', [...current, value], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }}
      />

      <SelectField control={control} name="status" label="Select Status" options={status_types as any} displayKey="value" valueKey="value" placeholder="Select status" />
      <TextField control={control} name="start_date" label="Start Date" type="date" placeholder="Requirement Start Date" />

      <TextField control={control} name="relative_experience" label="Related Experience" required />
      <TextField control={control} name="total_experience" label="Total Experience" required />
      <TextField control={control} name="positions" label="Positions" type="text" required />
      <TextField control={control} name="location" label="Location" required />
      <TextField control={control} name="skills_required" label="Skills (comma-separated)" />
      <TextAreaField control={control} name="description" label="Description" rows={4} />

      <SelectField
        control={control}
        multiple
        name="practice_ids"
        label="Select Related Practices"
        options={practices as any}
        displayKey="name"
        valueKey="id"
        onRemove={(value:number|string) => {
          const current = getValues('removed_practice_ids') || [];
          setValue('removed_practice_ids', [...current, value], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }}
        placeholder="Select Practice(s)"
      />

      <AttachmentsField control={control} name="documents" label="Attachments (PDF/Word/Excel)" onRemove={(value:number|string) => {
        const current = getValues('removed_document_ids') || [];
        setValue('removed_document_ids', [...current, value], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      }} />

      <View className={`space-y-3`}>
        <View className={`flex-row items-center justify-between`}>
          <Text className={`text-md font-semibold text-gray-800`}>Contacts</Text>
          <Button type="button" variant="secondary" onPress={handleAddContact}>Add Client Contact</Button>
        </View>

        <View className={`space-y-3`}>
          {contactFields.length === 0 && <Text className={`text-sm text-gray-500`}>No contacts added.</Text>}
          {contactFields.map((field, index) => (
            <ContactCard
              key={field.fieldId}
              contact={field as any}
              onSave={(values) => handleContactSave(index, values)}
              onDelete={() => handleContactDelete(index)}
              control={control}
              index={index}
              resetContact={async (idx, contact) => {
                if (contact?.name) {
                  setValue(`contacts.${idx}`, contact, { shouldValidate: true });
                  resetField(`contacts.${idx}`, { defaultValue: contact });
                } else {
                  remove(idx);
                }
                await trigger();
              }}
            />
          ))}
        </View>
      </View>

      <View className={`flex-row justify-end space-x-3`}>
        {onCancel && <Button type="button" variant="secondary" onPress={onCancel}>Cancel</Button>}
        <Button type="submit" variant="primary" disabled={!isValid || (mode === 'edit' && !isDirty)} onPress={handleSubmit(onInternalSubmit)}>
          {submitLabel || (mode === 'edit' ? 'Update Requirement' : 'Add Requirement')}
        </Button>
      </View>
    </ScrollView>
  );
};

export default JobForm;
