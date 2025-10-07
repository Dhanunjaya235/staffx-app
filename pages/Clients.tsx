import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addClient, setClients } from '../store/slices/clientsSlice';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import ClientForm from '../components/new-forms/ClientForm';
import { clientsApi } from '../services/api/clientsApi';
import { useApi } from '../hooks/useApi';
import { Plus } from 'lucide-react-native';
import { useEmployeeRoles } from '../hooks/useEmployee';
// import { ClientOut } from '../types/staffx-types';
import { CardList } from '../components/Card/CardList';
import type { Extractors, FieldConfig, CardAction } from '../types/card';
import { useNavigation } from '@react-navigation/native';

const Clients: React.FC = () => {
  const dispatch = useDispatch();
  // const { clients } = useSelector((state: RootState) => state.clients);
  const { openDrawer, closeDrawer } = useDrawer();
  const getClients = useApi(clientsApi.getAll);
  // const getClient = useApi(clientsApi.getClient);
  const [page] = React.useState(1);
  const [pageSize] = React.useState(10);
  const createClient = useApi(clientsApi.create);
  // const updateClientReq = useApi(clientsApi.update);

  // card list view for mobile, no nested inline view

  const { isAdmin, isSalesManager } = useEmployeeRoles();

  React.useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const fetchClients = async () => {
    const res = await getClients.execute({ page, page_size: pageSize });
    dispatch(setClients(res.items as any));
  };

  // permission checks handled in drawers when needed on mobile

  const refreshClients = async (toPage?: number) => {
    const nextPage = typeof toPage === 'number' ? toPage : page;
    const res = await getClients.execute({ page: nextPage, page_size: pageSize });
    dispatch(setClients(res.items as any));
  };

  const openCreateClientDrawer = () => {
    openDrawer({
      title: 'Add New Client',
      id: 'create-client',
      content: (
        <ClientForm
          mode="create"
          onSubmit={async (values) => {
            const res = await createClient.execute(values);
            const newClient = {
              id: res.id || Date.now().toString(),
              ...values,
              jobsCount: 0,
              resourcesCount: 0,
              createdAt: new Date().toISOString().split('T')[0],
            } as any;
            dispatch(addClient(newClient));
            closeDrawer('create-client');
            await refreshClients(1);
          }}
        />
      ),
      onClose: () => closeDrawer('create-client')
    });
  };

  // requirement creation handled elsewhere for mobile view

  // edit drawer wired elsewhere when needed

  // table columns removed on mobile; CardList is used instead

  return (
    <ScrollView className="p-4 py-10 flex-1">
      <View className='py-10' style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text className='text-red-500 font-bold text-lg mb-4 mt-4'>Clients</Text>
        {(isAdmin || isSalesManager) && (
          <Button onPress={openCreateClientDrawer} icon={Plus} variant="primary">
            Add Client
          </Button>
        )}
      </View>

      {/** CardList for Clients */}
      <ClientsCardList />

      {/* {
        const shiftCardData = {
    title: "Fri, 26",
    subtitle: "General Shift (12:11 PM - 09:11 PM)",
    status: {
      text: "ON TIME",
      color: "#27AE60"
    },
    sections: [
      {
        items: [
          { label: "Clock In", value: "12:11 PM", isHighlighted: true },
          { label: "Clock Out", value: "04:22 PM", valueColor: "#E74C3C", isHighlighted: true }
        ],
        showDivider: true
      },
      {
        items: [
          { label: "Effective hours", value: "3h 50m", isHighlighted: true },
          { label: "Gross hours", value: "4h 11m", isHighlighted: true }
        ]
      }
    ]
  };
      } */}

      {/* {
        clients && clients.map((client) => {

          return <></>
        })
      } */}
      

  {/* table view replaced by CardList for mobile */}
    </ScrollView>
  );
};

const styles = {
  heading : 'color-red-500 font-bold text-lg mb-4 mt-4',
}
export default Clients;

// Local adapter components/configs
const ClientsCardList: React.FC = () => {
	const { clients } = useSelector((state: RootState) => state.clients);
	const navigation = useNavigation<any>();
	const dispatch = useDispatch();
	const getClients = useApi(clientsApi.getAll);
	const [page] = React.useState(1);
	const [pageSize] = React.useState(10);
	const refresh = async () => {
		const res = await getClients.execute({ page, page_size: pageSize });
		dispatch(setClients(res.items as any));
	};

	const extractors: Extractors<any> = {
		getId: (c) => String(c.id),
		getTitle: (c) => c.name ?? c.company ?? '—',
		getSubtitle: (c) => c.location ?? '—',
		getAvatarText: (c) => c.name ?? c.company ?? '',
		getAvatarUrl: (c) => c.avatarUrl ?? undefined,
		getMetaPill: (c) => ({ text: String(c.jobs_count ?? 0), tone: 'info' }),
	};

	const fields: FieldConfig<any>[] = [
		{ key: 'sales_manager_client_accesses', label: 'Sales Managers', render: (v) => Array.isArray(v)&&v.length ? v.map((x:any)=>x.employee_name).filter(Boolean).join(', ') : '—' },
		{ key: 'client_accesses', label: 'Account Managers', render: (v) => Array.isArray(v)&&v.length ? v.map((x:any)=>x.employee_name).filter(Boolean).join(', ') : '—' },
		{ key: 'contacts', label: 'Contacts', render: (v) => Array.isArray(v)&&v.length ? `${v.length} contact${v.length>1?'s':''}` : '—' },
	];

	const actions: CardAction[] = [{ key: 'more', label: 'More' }];

	return (
		<CardList
			data={clients as any[]}
			extractors={extractors}
			fields={fields}
			actions={actions}
			onItemPress={(item) => navigation.navigate('ClientDetails', { id: item.id })}
			onActionPress={(action, item) => { /* hook into existing UI later */ }}
			refreshing={getClients.loading}
			onRefresh={refresh}
			testID="clients-card-list"
		/>
	);
};
