import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import RoundCreateForm from '../components/new-forms/RoundCreateForm';
import RoundEditForm from '../components/new-forms/RoundEditForm';
import { ArrowLeft, Plus, Edit, Calendar } from 'lucide-react-native';
import { useApi } from '../hooks/useApi';
import { resourcesApi } from '../services/api/resourcesApi';
import { roundsApi } from '../services/api/roundsApi';
import StatusChip from '../components/UI/Status/StatusChip';
import { staffXDateTimeFormat } from '../utils';
import DocumentCard from '../components/UI/document/DocumentCard';
import Table from '../components/UI/Table/Table'; // keep Table usage as requested

interface ResourceDetailsProps {
  embedded?: boolean;
  resourceId?: string;
  showEditResourceButton?: boolean;
}

const ResourceDetails: React.FC<ResourceDetailsProps> = ({
  embedded = false,
  resourceId,
  showEditResourceButton = true,
}) => {
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const { clients } = useSelector((state: RootState) => state.clients);
  const vendors = useSelector((state: RootState) => state.employee.dashboard?.vendors);
  const { openDrawer, closeDrawer } = useDrawer();

  const getResource = useApi(resourcesApi.getResource);
  const getResourceRounds = useApi(roundsApi.getAllByResource);

  const [resource, setResource] = useState<any>(null);
  const [resourceRounds, setResourceRounds] = useState<any[]>([]);

  useEffect(() => {
    if (resourceId) {
      getResource.execute(resourceId).then(setResource);
      getResourceRounds.execute(resourceId).then(setResourceRounds);
    }
  }, [resourceId]);

  const resourceJob = useMemo(() => jobs.find(j => j.id === resource?.job_id), [jobs, resource]);
  const resourceClient = useMemo(() => clients.find(c => c.id === resourceJob?.clientId), [resourceJob, clients]);
  const resourceVendor = useMemo(
    () => vendors?.find(v => v.id === resource?.vendor_id)?.name,
    [vendors, resource]
  );
  const currentRound = useMemo(() => {
    if (!resourceRounds || !resourceRounds.length) return null;
    const inProgress = resourceRounds.find(r => r.status.toLowerCase() === 'in progress');
    return inProgress || resourceRounds[resourceRounds.length - 1];
  }, [resourceRounds]);

  const openEditResourceDrawer = (resource: any) => {
    openDrawer({
      title: `Edit Candidate - ${resource.name}`,
      id: `edit-resource-${resource.id}`,
      content: (
        <RoundEditForm
          round={resource}
          onSubmitted={() => {
            getResource.execute(resource.id).then(setResource);
            closeDrawer(`edit-resource-${resource.id}`);
          }}
        />
      ),
      onClose: () => {},
    });
  };

  const openAddRoundDrawer = () => {
    if (!resource) return;
    openDrawer({
      title: `Add Interview Round - ${resource.name}`,
      id: 'add-round-drawer',
      content: (
        <RoundCreateForm
          resource={resource}
          onSubmitted={() => {
            getResourceRounds.execute(resource.id).then(setResourceRounds);
            closeDrawer('add-round-drawer');
          }}
        />
      ),
      onClose: () => {},
    });
  };

  const openEditRoundDrawer = (round: any) => {
    openDrawer({
      title: `Edit Round | ${round.name} - ${round.type}`,
      id: 'edit-round-drawer',
      content: (
        <RoundEditForm
          round={round}
          onSubmitted={() => {
            getResourceRounds.execute(resource.id).then(setResourceRounds);
            closeDrawer('edit-round-drawer');
          }}
        />
      ),
      onClose: () => {},
    });
  };

  if (!resource) {
    return (
      <View className="p-6 flex-1 justify-center items-center">
        <Text className="text-xl font-bold mb-4">Candidate Not Found</Text>
      </View>
    );
  }

  const columns = [
    { key: 'name', label: 'Round Name', filterable: false },
    { key: 'type', label: 'Round Type', filterable: false },
    {
      key: 'interview_time',
      label: 'Scheduled Datetime',
      filterable: false,
      render: (date?: string) => <Text>{date ? staffXDateTimeFormat(Number(date)) : 'Not Scheduled'}</Text>,
    },
    { key: 'status', label: 'Status', filterable: false, render: (status: string) => <StatusChip status={status} /> },
    {
      key: 'actions',
      label: 'Actions',
      filterable: false,
      render: (_: any, round: any) => (
        <Button size="sm" variant="secondary" onPress={() => openEditRoundDrawer(round)} icon={Edit} ><></></Button>
      ),
    },
  ];

  return (
    <ScrollView className="p-6 bg-gray-50">
      {/* Candidate Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold">{resource.name}</Text>
        </View>
        {showEditResourceButton && (
          <Button onPress={() => openEditResourceDrawer(resource)} icon={Edit}>
            Edit Candidate
          </Button>
        )}
      </View>

      {/* Candidate Overview */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <Text className="text-lg font-semibold mb-3">Candidate Overview</Text>
        <View className="flex-row flex-wrap gap-3">
          <View className="w-1/2">
            <Text className="text-xs text-gray-500">Email</Text>
            <Text className="text-sm font-medium">{resource.email}</Text>
          </View>
          <View className="w-1/2">
            <Text className="text-xs text-gray-500">Phone</Text>
            <Text className="text-sm font-medium">{resource.phone}</Text>
          </View>
          <View className="w-1/2">
            <Text className="text-xs text-gray-500">Requirement</Text>
            <Text className="text-sm font-medium">{resourceJob?.title}</Text>
          </View>
          <View className="w-1/2">
            <Text className="text-xs text-gray-500">Client</Text>
            <Text className="text-sm font-medium">{resourceClient?.name}</Text>
          </View>
          {resourceVendor && (
            <View className="w-1/2">
              <Text className="text-xs text-gray-500">Vendor</Text>
              <Text className="text-sm font-medium">{resourceVendor}</Text>
            </View>
          )}
          <View className="w-1/2">
            <Text className="text-xs text-gray-500">Experience</Text>
            <Text className="text-sm font-medium">{resource.experience} years</Text>
          </View>
        </View>

        {/* Skills */}
        <View className="mt-3 flex-row flex-wrap gap-2">
          {resource?.skills?.split(',').map((skill: string, index: number) => (
            <View key={index} className="bg-gray-100 px-2 py-1 rounded">
              <Text className="text-xs">{skill}</Text>
            </View>
          ))}
        </View>

        {/* Attachments */}
        <View className="mt-4">
          {resource.documents?.length ? (
            <FlatList
              data={resource.documents}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              renderItem={({ item, index }) => <DocumentCard document={item} index={index} />}
            />
          ) : (
            <Text className="text-sm font-medium mt-2">No attachments available</Text>
          )}
        </View>
      </View>

      {/* Candidate Status */}
      <View className="bg-white rounded-lg shadow p-4 mb-6">
        <Text className="text-lg font-semibold mb-3">Candidate Status</Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs text-gray-500">Current Status</Text>
            <StatusChip status={resource.status} />
          </View>
          <View>
            <Text className="text-xs text-gray-500">Total Rounds</Text>
            <Text className="text-lg font-semibold text-blue-600">{resourceRounds.length}</Text>
          </View>
          {currentRound && (
            <View>
              <Text className="text-xs text-gray-500">Current Round</Text>
              <Text className="text-lg font-semibold">{currentRound.name}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Interview Rounds Table */}
      <View className="bg-white rounded-lg shadow">
        <View className="flex-row justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold">Interview Rounds</Text>
          <Button onPress={openAddRoundDrawer} icon={Plus}>
            Add Round
          </Button>
        </View>

        <Table data={resourceRounds} columns={columns} />
      </View>
    </ScrollView>
  );
};

export default ResourceDetails;
