import React, { useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import Table from '../components/UI/Table/Table';
import Breadcrumb from '../components/UI/Breadcrumb/Breadcrumb';
import ResourceDetails from './ResourceDetails';
import { Resource, setResources } from '../store/slices/resourcesSlice';
import { Plus, Trash } from 'lucide-react-native';
import ResourceCreateForm from '../components/new-forms/ResourceCreateForm';
import ResourceEditForm from '../components/new-forms/ResourceEditForm';
import { useApi } from '../hooks/useApi';
import { resourcesApi } from '../services/api/resourcesApi';
import VendorCreateForm from '../components/new-forms/VendorCreateForm';
import StatusChip from '../components/UI/Status/StatusChip';
import ConfirmationPopup from '../components/UI/popups/Confirmation';
import { useEmployeeRoles } from '../hooks/useEmployee';

interface ResourcesProps {
  embedded?: boolean;
  clientId?: string;
  jobId?: string;
  breadcrumbItems?: { label: string; onPress?: () => void }[];
  onOpenResourceDetails?: (resource: any) => void;
  showBreadcrumb?: boolean;
  showAddResourceButton?: boolean;
  vendorId?: string;
}

const Resources: React.FC<ResourcesProps> = ({
  embedded = false,
  clientId,
  jobId,
  breadcrumbItems,
  onOpenResourceDetails,
  showBreadcrumb = true,
  vendorId,
  showAddResourceButton = true
}) => {
  const dispatch = useDispatch();
  const { resources } = useSelector((state: RootState) => state.resources);
  const { clients } = useSelector((state: RootState) => state.clients);
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const status_types = useSelector((state: RootState) => state.employee.dashboard?.constants?.candidate_status_types);
  const { openDrawer, closeDrawer } = useDrawer();
  const getResources = useApi(resourcesApi.getAll);
  const createResource = useApi(resourcesApi.create);
  const { isAdmin } = useEmployeeRoles();

  const [inlineView, setInlineView] = React.useState<'list' | 'details'>('list');
  const [selectedResourceId, setSelectedResourceId] = React.useState<string | undefined>(undefined);
  const [selectedResourceName, setSelectedResourceName] = React.useState<string | undefined>(undefined);
  const [resourceFilters, setResourceFilters] = React.useState<{ [key: string]: string | null }>({});
  const vendorPartial = useSelector((state: RootState) => state.vendors.VendorsPartial);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
  const [ResourceSelected, setResourceSelected] = React.useState<Resource | undefined>();

  const onPageChange = (newPage: number, pageSize?: number) => {
    setPage(newPage);
    if (pageSize) setPageSize(pageSize);
  };

  const toggleDeleteConfirmation = () => setOpenDeleteConfirmation(prev => !prev);

  React.useEffect(() => {
    (async () => {
      const res = await getResources.execute({
        job_id: jobId || undefined,
        page,
        page_size: pageSize,
        vendor_id: vendorId || undefined,
        ...resourceFilters
      });
      setTotal(res.total);
      dispatch(setResources(res.items as any));
    })();
  }, [dispatch, page, pageSize, jobId, vendorId, resourceFilters]);

  const onResourceFilterChange = (updates: Record<string, string | null>) => {
    setResourceFilters(prev => ({ ...prev, ...updates }));
  };

  const refreshResources = async (toPage?: number) => {
    const nextPage = typeof toPage === 'number' ? toPage : page;
    const res = await getResources.execute({
      job_id: jobId || undefined,
      page: nextPage,
      page_size: pageSize
    });
    setTotal(res.total);
    dispatch(setResources(res.items as any));
  };

  const columns = [
    { key: 'client_name', label: 'Client' },
    { key: 'job_title', label: 'Requirement' },
    {
      key: 'name',
      label: 'Candidate Name',
      render: (name: string, resource: any) => (
        <TouchableOpacity onPress={() => {
          if (embedded && onOpenResourceDetails) onOpenResourceDetails(resource);
          else {
            setInlineView('details');
            setSelectedResourceId(resource.id);
            setSelectedResourceName(resource.name);
          }
        }}>
          <Text className="text-blue-600 font-medium">{name}</Text>
        </TouchableOpacity>
      )
    },
    { key: 'email', label: 'Email' },
    {
      key: 'resource_type',
      label: 'Type',
      render: (type: string) => (
        <Text className={`px-2 py-1 rounded-[5px] text-sm font-semibold ${
          type === 'Cognine' ? 'bg-blue-100 text-blue-800' :
          type === 'Freelancer' ? 'bg-green-100 text-green-800' :
          type === 'Vendor' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {type}
        </Text>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: status_types?.map(c => c.value),
      filterValue: resourceFilters['resource_status'] || null,
      onFilterChange: (value:any) => onResourceFilterChange({ resource_status: value }),
      render: (status: string) => <StatusChip status={status} />
    },
    { key: 'rounds_count', label: 'Rounds' },
    { key: 'total_experience', label: 'Experience (years)' },
    ...(isAdmin ? [{
      key: 'Actions',
      label: 'Actions',
      render: (_: unknown, resource: Resource) => (
        <View className="flex-row space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              setResourceSelected(resource);
              toggleDeleteConfirmation();
            }}
          >
            <Trash className="w-4 h-4 text-red-700" />
          </Button>
        </View>
      )
    }] : [])
  ];

  const openCreateResourceDrawer = () => {
    const drawerId = openDrawer({
      title: 'Add New Candidate',
      content: (
        <ResourceCreateForm
          clientId={clientId}
          jobId={jobId}
          onCreateJob={setJobId => openDrawer({
            title: 'Add New Requirement',
            content: <CreateJobForm onJobCreated={job => setJobId(job.id)} />,
            onClose: () => {}
          })}
          onCreateVendor={setVendorId => openDrawer({
            title: 'Add New Vendor',
            content: <VendorCreateForm onVendorCreated={vendor => setVendorId(vendor.id)} />,
            onClose: () => {}
          })}
          onSubmit={async values => {
            const payload = {
              ...values,
              location: values.location || '',
              total_experience: String(values.experience),
              status: values.interviewStatus || 'Not Started',
              vendor_id: values.resourceType === 'Vendor' ? values.vendorId || '' : '',
              documents: (values.attachments || []).map((a:any) => ({
                filename: a.filename,
                filetype: a.filetype,
                filedata: a.filedata
              }))
            };
            const res = await createResource.execute(payload);
            if (res) {
              closeDrawer(drawerId);
              await refreshResources(1);
              setPage(1);
            }
          }}
        />
      ),
      onClose: () => {}
    });
  };

  if (!embedded && inlineView === 'details' && selectedResourceId) {
    return (
      <ScrollView className="p-6">
        {showBreadcrumb && <Breadcrumb home={{ label: 'Home', onPress: () => { setInlineView('list'); setSelectedResourceId(undefined); setSelectedResourceName(undefined); } }} items={[]} />}
        <ResourceDetails embedded resourceId={selectedResourceId}  />
      </ScrollView>
    );
  }

  return (
    <ScrollView className="p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">
          Candidates {clientId ? `for ${clientId}` : ''} {jobId ? `- ${jobId}` : ''}
        </Text>
        {showAddResourceButton && <Button onPress={openCreateResourceDrawer} icon={Plus} iconPosition="left">Add Candidate</Button>}
      </View>

      <ConfirmationPopup
        open={openDeleteConfirmation}
        onClose={toggleDeleteConfirmation}
        title={`Are you sure you want to delete "${ResourceSelected?.name || ''}"?`}
        onConfirm={async () => {
          await resourcesApi.update(ResourceSelected?.id || '', { is_active: false });
          await refreshResources();
          toggleDeleteConfirmation();
        }}
      />

      <Table
        data={resources as any}
        columns={columns}
        emptyMessage="No candidates found. Add your first candidate to get started."
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </ScrollView>
  );
};

// Placeholder CreateJobForm for React Native
const CreateJobForm: React.FC<{ onJobCreated: (job: any) => void }> = ({ onJobCreated }) => {
  const [formData, setFormData] = React.useState({ title: '', clientId: '', description: '' });

  return (
    <View className="p-6 space-y-6">
      <Text>Requirement Title</Text>
      <TextInput
        value={formData.title}
        onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
        className="border p-2 rounded"
      />
      <Text>Description</Text>
      <TextInput
        value={formData.description}
        onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
        multiline
        numberOfLines={4}
        className="border p-2 rounded"
      />
      <Button onPress={() => onJobCreated({ id: Date.now().toString(), ...formData, createdAt: new Date().toISOString() })}>Add Requirement</Button>
    </View>
  );
};

// EditResourceDrawer for React Native
export const EditResourceDrawer: React.FC<{ resourceId: string, onSubmit: () => void }> = ({ resourceId, onSubmit }) => {
  const getResource = useApi(resourcesApi.getResource);
  const updateResource = useApi(resourcesApi.update);
  const [initial, setInitial] = React.useState<any | null>(null);

  React.useEffect(() => {
    (async () => {
      const data = await getResource.execute(resourceId);
      setInitial({
        ...data,
        resourceType: data.resource_type,
        experience: String(data.total_experience || '0'),
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
        attachments: (data.documents || []).map(d => ({
          id: d.id,
          filename: d.filename,
          filetype: d.filetype,
          filedata: d.filedata
        })),
        interviewStatus: data.status,
        vendorId: data.vendor_id || ''
      });
    })();
  }, [resourceId]);

  if (!initial) return <View className="p-6"><Text>Loading...</Text></View>;

  return (
    <ResourceEditForm
      resource={initial}
      onSubmit={async values => {
        const initialAttachments = initial.attachments || [];
        const finalAttachments = values.attachments || [];

        const removed_document_ids = initialAttachments
          .filter((ia:any) => !finalAttachments.find((fa:any) => fa.id === ia.id))
          .map((ia:any) => ia.id);

        const new_documents = finalAttachments
          .filter((fa:any) => !fa.id)
          .map((fa:any) => ({
            filename: fa.filename,
            filetype: fa.filetype,
            filedata: fa.filedata
          }));

        const payload = {
          ...values,
          total_experience: values.experience,
          resource_type: values.resourceType,
          status: values.interviewStatus,
          is_active: true,
          vendor_id: values.resourceType === 'Vendor' ? values.vendorId || '' : '',
          removed_document_ids,
          new_documents
        };

        await updateResource.execute(resourceId, payload);
        onSubmit && onSubmit();
      }}
    />
  );
};

export default Resources;
