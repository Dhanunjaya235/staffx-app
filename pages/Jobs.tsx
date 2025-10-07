import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
// Table view replaced by CardList for mobile
import { CardList } from '../components/Card/CardList';
import type { Extractors, FieldConfig } from '../types/card';
import Resources from './Resources';
import ResourceDetails from './ResourceDetails';
import JobForm, { JobFormValues } from '../components/new-forms/JobForm';
import { useApi } from '../hooks/useApi';
import { jobsApi } from '../services/api/jobsApi';
import { setJobs } from '../store/slices/jobsSlice';
import { Plus } from 'lucide-react-native';
import { AssingedPractice, JobAccesses, JobOut } from '../types/staffx-types';
import {debounce} from 'lodash';
import { useEmployeeRoles } from '../hooks/useEmployee';
import JobViewForm from '../components/new-forms/JobViewForm';
import ConfirmationPopup from '../components/UI/popups/Confirmation';

interface JobsProps {
  embedded?: boolean;
  clientId?: string;
  onOpenResources?: (args: { clientId?: string; jobId?: string }) => void;
}

const Jobs: React.FC<JobsProps> = ({ embedded = false, clientId, onOpenResources }) => {
  // CardList uses internal selector; keep this screen lean
  const { clients } = useSelector((state: RootState) => state.clients);
  const { openDrawer, closeDrawer } = useDrawer();
  const dispatch = useDispatch();
  const getJobs = useApi(jobsApi.getAll);
  const createJob = useApi(jobsApi.create);
  const updateJob = useApi(jobsApi.update);

  const [page] = useState(1);
  const [pageSize] = useState(10);
  const [total] = useState(0);
  const [jobFilters, setJobFilters] = useState<{ [key: string]: string | null }>({});
  const [inlineView, setInlineView] = useState<'jobs' | 'resources' | 'resourceDetails'>('jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>(undefined);
  const [selectedJobName] = useState<string | undefined>(undefined);

  const { isAdmin, isSalesManager, isAccountManager } = useEmployeeRoles();

  const clientFilter = embedded ? clientId || null : undefined;

  // pagination controls not used in mobile CardList

  const fetchJobs = async () => {
    const res = await getJobs.execute({
      page,
      page_size: pageSize,
      client_id: clientFilter || undefined,
      ...jobFilters,
    });
    // total not displayed in mobile list
    dispatch(setJobs(res.items as any));
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, clientFilter, jobFilters]);

  // table filter options removed in mobile

  const onClientFilterChange = (updates: Record<string, string | null>) => {
    setJobFilters(prev => ({ ...prev, ...updates }));
  };

  const debouncedFilterChange = useMemo(
    () => debounce((value: string) => {
      onClientFilterChange({ job_role: value || null, job_title: value || null });
    }, 500),
    []
  );

  const clientName = clientFilter ? clients.find((c: any) => c.id === clientFilter)?.company : null;

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [jobSelected, setJobSelected] = useState<JobOut | null>(null);

  const toggleDeleteConfirmation = () => setOpenDeleteConfirmation(prev => !prev);

  const openCreateJobDrawer = () => {
    openDrawer({
      title: 'Add New Requirement',
      id: 'create-job',
      content: (
        <JobForm
          mode="create"
          clients={clients as any}
          clientId={clientId}
          onSubmit={async values => {
            await createJob.execute(values as any);
            await fetchJobs();
            closeDrawer('create-job');
          }}
        />
      ),
      onClose: () => { }
    });
  };

  const openEditJobDrawer = (job: any) => {
    openDrawer({
      title: `Edit Requirement - ${job.title}`,
      id: `edit-job-${job.id}`,
      content: (
        <EditJobDrawer
          jobId={job.id}
          closeDrawer={async () => {
            await fetchJobs();
            closeDrawer(`edit-job-${job.id}`);
          }}
        />
      ),
      onClose: () => { }
    });
  };

  const openViewJobDrawer = (job: any) => {
    openDrawer({
      title: `View Requirement - ${job.title}`,
      id: `view-job-${job.id}`,
      content: (
        <JobViewForm jobId={job.id} clients={clients as any} />
      ),
      onClose: () => { closeDrawer(`view-job-${job.id}`)}
    });
  };

  // legacy table column config retained above; mobile view uses CardList below

  if (inlineView === 'resourceDetails' && selectedResourceId) {
    return <ResourceDetails embedded resourceId={selectedResourceId} />;
  }

  if (inlineView === 'resources' && selectedJobId) {
    return (
      <Resources
        embedded
        clientId={clientFilter || undefined}
        jobId={selectedJobId}
        showBreadcrumb={false}
        onOpenResourceDetails={(resource) => {
          setSelectedResourceId(resource?.id);
          setInlineView('resourceDetails');
        }}
      />
    );
  }

  return (
    <ScrollView className="p-4 flex-1">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Requirements {clientName && `for ${clientName}`}</Text>
        <View className="flex-row space-x-2 items-center">
          {!embedded && (
            <TextInput
              placeholder="Search by requirement title or role"
              className="border border-gray-300 rounded px-2 py-1 w-60 text-sm"
              onChangeText={debouncedFilterChange}
            />
          )}
          {(isAdmin || isSalesManager || isAccountManager) && (
            <Button onPress={openCreateJobDrawer} icon={Plus} iconPosition="left">
              Add Requirement
            </Button>
          )}
        </View>
      </View>

      <ConfirmationPopup
        open={openDeleteConfirmation}
        onClose={toggleDeleteConfirmation}
        title={`Are you sure you delete "${jobSelected?.client_name || ''} - ${jobSelected?.title || ''}" ?`}
        onConfirm={async () => {
          await updateJob.execute(jobSelected?.id, { is_active: false } as any);
          await fetchJobs();
          toggleDeleteConfirmation();
        }}
      />

      <JobsCardList />
    </ScrollView>
  );
};

export default Jobs;

// EditJobDrawer also converted for React Native
const EditJobDrawer: React.FC<{ jobId: string, closeDrawer: () => void }> = ({ jobId, closeDrawer }) => {
  const getJob = useApi(jobsApi.getJobById);
  const updateJob = useApi(jobsApi.update);
  const { clients } = useSelector((state: RootState) => state.clients);
  const [initial, setInitial] = useState<JobFormValues & { job_accesses: JobAccesses[], assigned_practices: AssingedPractice[] } | null>(null);

  useEffect(() => {
    const fetchJobData = async (id: string) => {
      const data = await getJob.execute(id) as JobOut;
      setInitial({
        title: data.title,
        role: data.role,
        positions: data.positions,
        relative_experience: data.relative_experience,
        total_experience: data.total_experience,
        skills_required: data.skills_required,
        location: data.location,
        type: data.type,
        description: data.description || '',
        client_id: data.client_id,
        practice_ids: (data.assigned_practices || []).map(pr => pr.practice_id),
        status: data.status || '',
        contacts: (data.contacts || []).map(c => ({ name: c.name, email: c.email, phone: c.phone, id: c.id })),
        documents: (data.documents || []).map(d => ({ filename: d.filename, filetype: d.filetype, filedata: d.filedata, id: d.id })),
        recruiter_role_ids: (data.job_accesses || []).map(a => a.employee_role_id),
        job_accesses: data.job_accesses || [],
        assigned_practices: data.assigned_practices || [],
        start_date: data.start_date,
      });
    };
    fetchJobData(jobId);
  }, [jobId]);

  if (!initial) return <Text className="p-4">Loading...</Text>;

  return (
    <JobForm
      mode="edit"
      defaultValues={initial}
      clientId={initial.client_id}
      clients={clients as any}
      onSubmit={async values => {
        await updateJob.execute(jobId, values as any);
        closeDrawer();
      }}
      submitLabel="Update Requirement"
    />
  );
};

// CardList integration for Jobs/Requirements
const JobsCardList: React.FC = () => {
	const { jobs } = useSelector((state: RootState) => state.jobs);
	const getJobs = useApi(jobsApi.getAll);
	const [page] = useState(1);
	const [pageSize] = useState(10);
	const extractors: Extractors<any> = {
		getId: (j) => String(j.id),
		getTitle: (j) => j.title ?? '—',
		getSubtitle: (j) => j.location ?? j.type ?? '—',
		getAvatarText: (j) => j.title ?? '',
		getMetaPill: (j) => ({ text: j.status ?? 'Open', tone: j.status === 'Open' ? 'success' : j.status === 'Closed' ? 'neutral' : 'info' }),
	};

	const fields: FieldConfig<any>[] = [
		{ key: 'positions', label: 'Positions' },
		{ key: 'skills_required', label: 'Skills', numberOfLines: 2 },
		{ key: 'total_experience', label: 'Experience' },
	];

	const refresh = async () => {
		await getJobs.execute({ page, page_size: pageSize });
	};

	return (
		<CardList
			data={jobs as any[]}
			extractors={extractors}
			fields={fields}
			refreshing={getJobs.loading}
			onRefresh={refresh}
			testID="jobs-card-list"
		/>
	);
};
