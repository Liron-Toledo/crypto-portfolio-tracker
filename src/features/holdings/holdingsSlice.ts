import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Holding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
}

interface HoldingsState {
  items: Holding[];
}

const initialState: HoldingsState = {
  items: [],
};

const holdingsSlice = createSlice({
  name: 'holdings',
  initialState,
  reducers: {
    addHolding(state, action: PayloadAction<Holding>) {
      state.items.push(action.payload);
    },
    updateHolding(state, action: PayloadAction<Holding>) {
      const index = state.items.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteHolding(state, action: PayloadAction<string>) {
      state.items = state.items.filter((h) => h.id !== action.payload);
    },
  },
});

export const { addHolding, updateHolding, deleteHolding } = holdingsSlice.actions;

export default holdingsSlice.reducer;