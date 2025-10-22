import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addVendor, setPartialVendors, setVendors } from "../store/slices/vendorsSlice";
import { useDrawer } from "../components/UI/Drawer/DrawerProvider";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "../components/form-fields/TextField";
import { useApi } from "../hooks/useApi";
import { vendorsApi } from "../services/api/vendorsApi";
import Button from "../components/UI/Button/Button";
import Table from "../components/UI/Table/Table";
import { CardList } from "../components/Card/CardList";
import type { Extractors, FieldConfig, CardAction } from "../types/card";
import { Plus, Users, Edit, User, ArrowUpRight } from "lucide-react-native";
import Resources from "./Resources";
import Breadcrumb from "../components/UI/Breadcrumb/Breadcrumb";
import ResourceDetails from "./ResourceDetails";
import { ContactCard } from "../components/new-forms/ContactCard";
import { ContactOut, VendorOut } from "../types/staffx-types";
import StyledPagination from "components/UI/Pagination/Styled";

const Vendors: React.FC = () => {
  const dispatch = useDispatch();
  const { vendors } = useSelector((state: RootState) => state.vendors);
  const { openDrawer, closeDrawer } = useDrawer();
  const getVendorsApi = useApi(vendorsApi.getAll);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [viewLevel, setViewLevel] = useState<'vendors' | 'resources' | 'resourceDetails'>('vendors');
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>();
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>();
  const [selectedVendorName, setSelectedVendorName] = useState<string | undefined>();
  const [selectedResourceName, setSelectedResourceName] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const res = await getVendorsApi.execute({ page, page_size: pageSize });
      setTotal(res.total);
      dispatch(setVendors(res.items));
    })();
  }, [dispatch, page, pageSize]);

  const refreshVendors = async (toPage?: number) => {
    const nextPage = typeof toPage === "number" ? toPage : page;
    const res = await getVendorsApi.execute({ page: nextPage, page_size: pageSize });
    setTotal(res.total);
    dispatch(setVendors(res.items));
    dispatch(setPartialVendors(res.items.map(v => ({ id: v.id, name: v.name }))));
  };
    const onPageChange = (newPage: number, pageSize?: number) => {
    setPage(newPage);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };


  const openCreateVendorDrawer = () => {
    const drawerId = openDrawer({
      title: "Add New Vendor",
      content: (
        <CreateVendorForm
          onVendorCreated={async (vendor) => {
            dispatch(addVendor(vendor));
            closeDrawer(drawerId);
            await refreshVendors(1);
            setPage(1);
          }}
        />
      ),
      onClose: () => {}
    });
  };

  const openEditVendorDrawer = (vendor: VendorOut) => {
    const drawerId = openDrawer({
      title: `Edit Vendor - ${vendor.name}`,
      content: (
        <EditVendorForm
          vendor={vendor}
          onVendorUpdated={async () => {
            closeDrawer(drawerId);
            await refreshVendors(page);
          }}
        />
      ),
      onClose: () => {}
    });
  };

  const columns = [
    { key: "name", label: "Name", filterable: false },
    { key: "location", label: "Location", filterable: false },
    {
      key: "contacts",
      label: "Contacts",
      render: (contactArray: ContactOut[]) => {
        if (!contactArray || contactArray.length === 0) return "-";
        return (
          <Text className="text-blue-600 font-bold">
            {contactArray.length} {/* No tooltip, just count */}
          </Text>
        );
      }
    },
    {
      key: "resources_count",
      label: "Candidates",
      render: (count: number, vendor: VendorOut) => (
        count && count > 0 ? (
          <Text
            onPress={() => {
              setSelectedVendorId(vendor.id);
              setViewLevel('resources');
              setSelectedResourceId(undefined);
              setSelectedResourceName(undefined);
              setSelectedVendorName(vendor.name);
            }}
            className="text-blue-600 font-bold"
          >
            {count} Candidates
          </Text>
        ) : "-"
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, vendor: VendorOut) => (
        <Button
          size="sm"
          variant="secondary"
          onPress={() => openEditVendorDrawer(vendor)}
        >
          <Edit />
        </Button>
      )
    }
  ];

  if (viewLevel === "resourceDetails" && selectedVendorId && selectedResourceId) {
    return (
      <ScrollView className="p-6">
        <ResourceDetails embedded resourceId={selectedResourceId} />
      </ScrollView>
    );
  }

  if (viewLevel === "resources" && selectedVendorId) {
    return (
      <ScrollView className="p-6">
        <Resources
          embedded
          showBreadcrumb={false}
          vendorId={selectedVendorId}
          onOpenResourceDetails={(resource) => {
            setSelectedResourceId(resource?.id);
            setSelectedResourceName(resource?.name);
            setViewLevel("resourceDetails");
          }}
          showAddResourceButton={false}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView stickyHeaderIndices={[0]}>
      <View className="flex-row justify-between items-center mb-6 mt-6 pt-2 px-5"  style={{
      backgroundColor: 'white', // makes header opaque
      elevation: 4,              // adds shadow for Android
      zIndex: 10,                // ensures header is above scroll content
    }}>
        <Text className="text-2xl font-bold text-gray-900">Vendors</Text>
        <Button onPress={openCreateVendorDrawer} icon={Plus} iconPosition="left">
          Add Vendor
        </Button>
      </View>

      <VendorsCardList />
      {total && <StyledPagination page={page} pageSize={pageSize}  total={total} onPageChange={onPageChange} />}

    </ScrollView>
  );
};

/** ----------------------- CreateVendorForm RN ----------------------- */

interface CreateVendorFormProps {
  onVendorCreated: (vendor: any) => void;
}

const CreateVendorForm: React.FC<CreateVendorFormProps> = ({ onVendorCreated }) => {
  const createVendor = useApi(vendorsApi.create);

  const schema = yup.object({
    name: yup.string().trim().required("Name is required"),
    location: yup.string().trim().nullable(),
    contacts: yup.array().of(
      yup.object({
        name: yup.string().trim().required("Contact name is required"),
        email: yup.string().trim().email("Invalid email").required("Contact email is required"),
        phone: yup.string().nullable(),
      })
    ).default([]),
  });

  const { control, handleSubmit, setValue, formState:{isValid}, trigger } = useForm({
    defaultValues: { name: "", location: "", contacts: [] },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "contacts", keyName: "fieldId" });

  const onSubmit = async (values: any) => {
    const payload = {
      name: values.name,
      location: values.location,
      contacts: (values.contacts || []).map((c: any) => ({ name: c.name, email: c.email, phone: c.phone ?? null })),
    };
    const res = await createVendor.execute(payload);
    onVendorCreated(res);
  };

  return (
    <View className="p-6 space-y-6">
      <TextField control={control} name="name" label="Vendor Name" required />
      <TextField control={control} name="location" label="Location" />

      <View>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-700">Contacts</Text>
          <Button size="sm" variant="secondary" onPress={() => append({ name: "", email: "", phone: "" })}>
            Add Vendor Contact
          </Button>
        </View>
        <View className="space-y-4">
          {fields.length === 0 && <Text className="text-sm text-gray-500">No contacts added.</Text>}
          {fields.map((field, index) => (
            <ContactCard
              key={field.fieldId}
              contact={field as any}
              onSave={(values) => setValue(`contacts.${index}`, { ...field, ...values }, { shouldValidate: true, shouldDirty: true })}
              onDelete={() => remove(index)}
              control={control}
              index={index}
              resetContact={async (idx, contact) => {
                if (contact?.name) setValue(`contacts.${idx}`, contact, { shouldValidate: true });
                else remove(idx);
                await trigger();
              }}
            />
          ))}
        </View>
      </View>

      <View className="flex-row justify-end">
        <Button onPress={handleSubmit(onSubmit)} variant="primary" disabled={!isValid}>
          Add Vendor
        </Button>
      </View>
    </View>
  );
};

/** ----------------------- EditVendorForm RN ----------------------- */

interface EditVendorFormProps {
  vendor: any;
  onVendorUpdated: (vendor: any) => void;
}

const EditVendorForm: React.FC<EditVendorFormProps> = ({ vendor, onVendorUpdated }) => {
  const updateVendorApi = useApi(vendorsApi.update);

  const schema = yup.object({
    name: yup.string().trim().required("Name is required"),
    location: yup.string().trim().required("Location is required"),
    contacts: yup.array().of(
      yup.object({
        id: yup.string().nullable(),
        name: yup.string().trim().required("Contact name is required"),
        email: yup.string().trim().email("Invalid email").required("Contact email is required"),
        phone: yup.string().nullable(),
        is_active: yup.boolean().default(true),
      })
    ).default([]),
    removedContacts: yup.array().of(
      yup.object({
        id: yup.string().nullable(),
        name: yup.string(),
        email: yup.string().email(),
        phone: yup.string().nullable(),
        is_active: yup.boolean(),
      })
    ).default([]),
  });

  const { control, handleSubmit, setValue, formState:{isValid, isDirty}, trigger } = useForm({
    defaultValues: {
      name: vendor?.name || "",
      location: vendor?.location || "",
      contacts: (vendor?.contacts || []).filter((c: any) => c.is_active !== false),
      removedContacts: [] as any[],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "contacts", keyName: 'fieldId' });

  const onSubmit = async (values: any) => {
    const payload = {
      name: values.name,
      location: values.location,
      contacts: [
        ...(values.contacts || []).map((c: any) => ({
          id: c.id ?? undefined,
          name: c.name,
          email: c.email,
          phone: c.phone ?? undefined,
          is_active: true,
        })),
        ...(values.removedContacts || []),
      ],
    };
    const res = await updateVendorApi.execute(String(vendor.id), payload);
    onVendorUpdated(res);
  };

  return (
    <View className="p-6 space-y-6">
      <TextField control={control} name="name" label="Vendor Name" required />
      <TextField control={control} name="location" label="Location" />

      <View>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-700">Contacts</Text>
          <Button size="sm" variant="secondary" onPress={() => append({ id: undefined, name: "", email: "", phone: "", is_active: true })}>
            Add Vendor Contact
          </Button>
        </View>
        <View className="space-y-3">
          {fields.length === 0 && <Text className="text-sm text-gray-500">No contacts added.</Text>}
          {fields.map((field, index) => (
            <ContactCard
              key={field.fieldId}
              contact={field as any}
              control={control}
              index={index}
              onSave={(values) => setValue(`contacts.${index}`, { ...field, ...values }, { shouldValidate: true, shouldDirty: true })}
              onDelete={() => {
                const removed = (control._formValues.contacts || [])[index];
                setValue("removedContacts", [
                  ...(control._formValues.removedContacts || []),
                  { ...removed, is_active: false },
                ]);
                remove(index);
              }}
              resetContact={async (idx, contact) => {
                if (contact?.name) setValue(`contacts.${idx}`, contact, { shouldValidate: true });
                else remove(idx);
                await trigger();
              }}
            />
          ))}
        </View>
      </View>

      <View className="flex-row justify-end">
        <Button disabled={!isValid || !isDirty} onPress={handleSubmit(onSubmit)} variant="primary">
          Update Vendor
        </Button>
      </View>
    </View>
  );
};

export default Vendors;

const VendorsCardList: React.FC = () => {
	const dispatch = useDispatch();
	const { vendors } = useSelector((state: RootState) => state.vendors);
	const getVendorsApi = useApi(vendorsApi.getAll);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const refresh = async () => {
		const res = await getVendorsApi.execute({ page, page_size: pageSize });
		dispatch(setVendors(res.items));
	};

	const extractors: Extractors<any> = {
		getId: (v) => String(v.id),
		getTitle: (v) => v.name ?? '—',
		getSubtitle: (v) => v.city ?? v.location ?? '—',
		getAvatarText: (v) => v.name ?? '',
	};

	const fields: FieldConfig<any>[] = [
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'contacts', label: 'Contacts', render: (v) => Array.isArray(v) ? `${v.length}` : '—' },
	];

	const actions: CardAction<VendorOut>[] = [];

	return (
		<CardList
			data={vendors as any[]}
			extractors={extractors}
			fields={fields}
			actions={actions}
			refreshing={getVendorsApi.loading}
			onRefresh={refresh}
			testID="vendors-card-list"
		/>
	);
};
