import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VendorOut } from '../../types/staffx-types';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  resourcesCount: number;
  createdAt: string;
}

interface VendorsState {
  vendors: VendorOut[];
  loading: boolean;
  error: string | null;
  VendorsPartial:VendorPartial[];
}

const initialState: VendorsState = {
  vendors: [],
  loading: false,
  error: null,
  VendorsPartial:[]
};

export interface VendorPartial {
  id: string;
  name: string;
}

const vendorsSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendors: (state, action: PayloadAction<VendorOut[]>) => {
      state.vendors = action.payload;
    },
    addVendor: (state, action: PayloadAction<VendorOut>) => {
      state.vendors.push(action.payload);
    },
    updateVendor: (state, action: PayloadAction<VendorOut>) => {
      const index = state.vendors.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vendors[index] = action.payload;
      }
    },
    deleteVendor: (state, action: PayloadAction<string>) => {
      state.vendors = state.vendors.filter(v => v.id !== action.payload);
    },
    setPartialVendors: (state, action: PayloadAction<VendorPartial[]>) => {
          state.VendorsPartial = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setVendors, addVendor, updateVendor, deleteVendor, setLoading, setError,setPartialVendors } = vendorsSlice.actions;
export default vendorsSlice.reducer;