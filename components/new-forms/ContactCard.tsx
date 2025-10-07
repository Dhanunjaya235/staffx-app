import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWatch, Control, useFormState } from "react-hook-form";
import ContactForm, { ContactFormValues } from "./ContactForm";
import {Edit, Delete} from "lucide-react-native"
interface ContactCardProps {
  contact: ContactFormValues;
  index: number;
  control: Control<any>;
  onSave: (values: ContactFormValues) => void;
  onDelete: () => void;
  resetContact: (index: number, contact: ContactFormValues) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  index,
  control,
  contact,
  onSave,
  onDelete,
  resetContact,
}) => {
  const [editing, setEditing] = useState(!contact?.name);

  const watchedContact = useWatch({
    control,
    name: `contacts.${index}`,
  }) as ContactFormValues;

  const { errors } = useFormState<{ contacts: Record<number, any> }>({
    control,
    name: `contacts.${index}`,
  });
  const isValid = Boolean(
    !errors?.contacts?.[index] && watchedContact?.email && watchedContact?.name
  );

  const handleCancel = () => {
    resetContact(index, contact);
    setEditing(false);
  };

  if (editing) {
    return (
      <View style={styles.card}>
        <ContactForm
          control={control}
          namePrefix={`contacts.${index}`}
          onSubmit={() => {
            onSave(watchedContact);
            setEditing(false);
          }}
          onCancel={handleCancel}
          submitLabel="Save Contact"
          isValid={isValid}
        />
      </View>
    );
  }

  return watchedContact?.name ? (
    <View style={styles.card}>
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{watchedContact.name}</Text>
        <Text style={styles.email}>{watchedContact.email}</Text>
        {watchedContact.phone && (
          <Text style={styles.phone}>{watchedContact.phone}</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setEditing(true)}>
          <Edit size={20} color="#394253" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Delete size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    color: "#111827",
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
  },
  phone: {
    fontSize: 14,
    color: "#6b7280",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
