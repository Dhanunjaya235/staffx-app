import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  jobsCount: number;
  resourcesCount: number;
  createdAt: string;
  client_accesses: ClientAccess[];
  sales_manager_client_accesses: ClientAccess[];
}

export interface ClientAccess {
  id: string;
  employee_role_id: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  role_id: string;
  role_name: string;
}

export interface ClientPartial {
  id: string;
  name: string;
}
interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  clientsPartial:ClientPartial[];
}

const initialState: ClientsState = {
  clients: [],
  loading: false,
  error: null,
  clientsPartial:[]
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
    },
    setPartialClients: (state, action: PayloadAction<ClientPartial[]>) => {
      state.clientsPartial = action.payload;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(c => c.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setClients, addClient, updateClient, deleteClient, setLoading, setError, setPartialClients } = clientsSlice.actions;
export default clientsSlice.reducer;