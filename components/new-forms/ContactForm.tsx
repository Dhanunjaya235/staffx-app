import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../UI/Button/Button';
import TextField from '../form-fields/TextField';
import type { Control, FieldValues } from 'react-hook-form';

export interface ContactFormValues {
  name: string;
  email: string;
  phone?: string | null;
}

export interface RemovedContacts extends ContactFormValues {
  id?: string;
  is_active?: boolean | null;
}

interface ContactFormProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  namePrefix: string; // e.g. `contacts.0`
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  isValid: boolean;
  defaultValues?: any;
}

const ContactForm = <TFieldValues extends FieldValues = FieldValues>({
  control,
  namePrefix,
  onSubmit,
  onCancel,
  submitLabel,
  isValid,
}: ContactFormProps<TFieldValues>) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputsRow}>
        <TextField
          control={control}
          name={`${namePrefix}.name`}
          label="Name"
        />
        <TextField
          control={control}
          name={`${namePrefix}.email`}
          label="Email"
        />
        <TextField
          control={control}
          name={`${namePrefix}.phone`}
          label="Phone"
          required={false}
        />
      </View>

      <View style={styles.actions}>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onPress={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          onPress={onSubmit}
          disabled={!isValid}
        >
          {submitLabel || 'Save'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8, // if using RN >=0.71
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8, // spacing between buttons
  },
});

export default ContactForm;
