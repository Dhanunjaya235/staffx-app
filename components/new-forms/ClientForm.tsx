import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../UI/Button/Button';
import TextField from '../form-fields/TextField';
import SelectField from '../form-fields/SelectField';
import { ContactCard } from './ContactCard';
import type { ContactFormValues, RemovedContacts } from './ContactForm';
import { Roles } from '../../constants';

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

export interface ClientFormValues {
  name: string;
  location: string;
  contacts?: ContactFormValues[];
  removedContacts?: RemovedContacts[];
  account_manager_role_ids?: string[];
  sales_manager_role_ids?: string[];
}

export interface ClientFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void | Promise<void>;
  onCancel?: () => void;
  includeContacts?: boolean;
  submitLabel?: string;
}

const baseSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  location: yup.string().trim().required('Location is required'),
  account_manager_role_ids: yup.array(yup.mixed()).default([]),
  sales_manager_role_ids: yup.array(yup.mixed()).default([]),
});

const contactsSchema = yup
  .array()
  .of(
    yup.object({
      name: yup.string().trim().required('Contact name is required'),
      email: yup.string().trim().email('Invalid email').required('Contact email is required'),
      phone: yup.string().nullable(),
    })
  )
  .default([]);

const removedContactsSchema = yup.array().of(
  yup.object({
    id: yup.string().nullable(),
    name: yup.string(),
    email: yup.string().email(),
    phone: yup.string().nullable(),
    is_active: yup.boolean(),
  })
).default([]);

const ClientForm: React.FC<ClientFormProps> = ({
  mode = 'create',
  defaultValues,
  onSubmit,
  onCancel,
  includeContacts = true,
  submitLabel
}) => {
  const schema = useMemo(() => {
    let finalSchema = baseSchema;
    if (includeContacts) {
      finalSchema = finalSchema.shape({ contacts: contactsSchema });
      if (mode === 'edit') {
        finalSchema = finalSchema.shape({ removedContacts: removedContactsSchema });
      }
    }
    return finalSchema;
  }, [includeContacts, mode]);

  const { control, handleSubmit, setValue, getValues, trigger, formState: { isValid, isDirty }, resetField } = useForm<ClientFormValues>({
    defaultValues: {
      name: '',
      location: '',
      contacts: includeContacts ? [] : undefined,
      removedContacts: (includeContacts && mode === 'edit') ? [] : undefined,
      account_manager_role_ids: [],
      sales_manager_role_ids: [],
      ...defaultValues,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'contacts' as const,
    keyName: 'fieldId'
  });

  const handleContactSave = async (index: number, values: ContactFormValues) => {
    update(index, values);
    const contacts = getValues('contacts') || [];
    contacts[index] = values;
    setValue('contacts', contacts, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    await trigger();
  };

  const handleContactDelete = async (index: number) => {
    const currentContacts = getValues('contacts') || [];
    if (mode === 'edit') {
      const removedContact = currentContacts[index];
      if (removedContact) {
        const currentRemoved = getValues('removedContacts') || [];
        setValue('removedContacts', [...currentRemoved, { ...removedContact, is_active: false }], {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true
        });
      }
    }
    remove(index);
    const updatedContacts = currentContacts.filter((_, i) => i !== index);
    setValue('contacts', updatedContacts, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
    await trigger();
  };

  const handleAddContact = () => {
    append({ name: '', phone: '', email: '' });
  };

  const users = useSelector((state: RootState) => state.users.users) as AssignedRole[] | undefined;
  const employee = useSelector((state: RootState) => state.employee.dashboard?.employee);

  const accountManagerOptions = useMemo(() => {
    const seen = new Set<number | string>();
    const list: { id: string; name: string }[] = [];
    (users || []).filter(u => u.role_name === 'ACCOUNT_MANAGER').forEach(u => {
      if (!seen.has(u.employee_id)) {
        seen.add(u.employee_id);
        list.push({ id: u.id, name: u.employee_name || '' });
      }
    });
    return list;
  }, [users]);

  const salesManagerOptions = useMemo(() => {
    const seen = new Set<number | string>();
    const list: { id: string; name: string }[] = [];
    (users || []).filter(u => u.role_name === 'SALES_MANAGER').forEach(u => {
      if (!seen.has(u.employee_id)) {
        seen.add(u.employee_id);
        list.push({ id: u.id, name: u.employee_name || '' });
      }
    });
    return list;
  }, [users]);

  const salesManager = useMemo(() => users?.find(u => u.employee_id === employee?.id && u.role_name === Roles.SALES_MANAGER), [users, employee]);

  useEffect(() => {
    if (salesManager) {
      const previous = getValues('sales_manager_role_ids') || [];
      setValue('sales_manager_role_ids', [...new Set([salesManager?.id, ...previous])]);
    }
  }, [salesManager]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextField control={control} name="name" label="Client Name" required />
      <TextField control={control} name="location" label="Location" required />

      <SelectField
        control={control}
        name="account_manager_role_ids"
        label="Account Manager(s)"
        options={accountManagerOptions as any}
        displayKey="name"
        valueKey="id"
        multiple
        placeholder="Select account manager(s)"
        required={false}
      />

      <SelectField
        control={control}
        name="sales_manager_role_ids"
        label="Sales Manager(s)"
        options={salesManagerOptions as any}
        displayKey="name"
        valueKey="id"
        multiple
        placeholder="Select sales manager(s)"
        required={false}
      />

      {includeContacts && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contacts</Text>
            <Button type="button" variant="secondary" onPress={handleAddContact}>
              Add Client Contact
            </Button>
          </View>

          {fields.length === 0 && <Text style={styles.noContacts}>No contacts added.</Text>}

          {fields.map((field, index) => (
            <ContactCard
              key={field.fieldId}
              contact={field as unknown as ContactFormValues}
              index={index}
              control={control}
              onSave={values => handleContactSave(index, values)}
              onDelete={() => handleContactDelete(index)}
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
      )}

      <View style={styles.buttonContainer}>
        {onCancel && (
          <Button type="button" variant="secondary" onPress={onCancel}>
            Cancel
          </Button>
        )}
        <Button disabled={!isValid || (mode === 'edit' && !isDirty)} type="submit" variant="primary" onPress={handleSubmit(onSubmit)}>
          {submitLabel || (mode === 'edit' ? 'Update Client' : 'Add Client')}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  section: { marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  noContacts: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 8 },
});

export default ClientForm;
