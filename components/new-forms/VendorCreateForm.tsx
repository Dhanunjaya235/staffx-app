import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../UI/Button/Button';
import TextField from '../form-fields/TextField';
import type { ContactFormValues } from './ContactForm';
import { ContactCard } from './ContactCard';

export interface VendorFormValues {
  name: string;
  location: string;
  contacts?: ContactFormValues[];
}

interface VendorCreateFormProps {
  onVendorCreated: (vendor: any) => void;
}

const schema = yup.object({
  name: yup.string().trim().required('Vendor name is required'),
  location: yup.string().trim().required('Location is required'),
  contacts: yup
    .array()
    .of(
      yup.object({
        name: yup.string().trim().required('Contact name is required'),
        email: yup.string().trim().email('Invalid email').required('Contact email is required'),
        phone: yup.string().nullable(),
      })
    )
    .optional(),
});

const VendorCreateForm: React.FC<VendorCreateFormProps> = ({ onVendorCreated }) => {
  const { control, handleSubmit, setValue, getValues, trigger, formState: { isValid }, resetField } = useForm<VendorFormValues>({
    defaultValues: {
      name: '',
      location: '',
      contacts: [],
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
    remove(index);
    await trigger();
  };

  const handleAddContact = () => {
    append({ name: '', phone: '', email: '' });
  };

  const onSubmit = (values: VendorFormValues) => {
    const newVendor = {
      id: Date.now().toString(),
      ...values,
      resourcesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onVendorCreated(newVendor);
  };

  return (
    <ScrollView className="p-6 space-y-6">
      <TextField control={control} name="name" label="Vendor Name" />
      <TextField control={control} name="location" label="Location" />

      <View className="space-y-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-lg font-medium text-gray-900">Contacts</Text>
          <Button type="button" variant="secondary" onPress={handleAddContact}>
            Add Vendor Contact
          </Button>
        </View>

        <View className="space-y-3">
          {fields.length === 0 && (
            <Text className="text-sm text-gray-500">No contacts added.</Text>
          )}
          {fields.map((field, index) => (
            <ContactCard
              key={field.fieldId}
              index={index}
              contact={field as any}
              control={control}
              onSave={(values) => handleContactSave(index, values)}
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
      </View>

      <View className="flex flex-row justify-end">
        <Button disabled={!isValid} onPress={handleSubmit(onSubmit)} variant="primary">
          Add Vendor
        </Button>
      </View>
    </ScrollView>
  );
};

export default VendorCreateForm;
