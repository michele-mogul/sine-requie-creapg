import { createSlice } from "@reduxjs/toolkit";

export const doniSlice = createSlice({
  name: "doni",
  initialState: {
    doni: [],
    maggioriEstratti: [],
  },
  reducers: {
    setDoni: (state, { payload }) => {
      state.doni = payload;
    },
    addDoni: (state, { payload }) => {
      state.doni.push(payload);
    },
    removeDono: (state, { payload }) => {
      state.doni = state.doni.filter((dono) => dono.id !== payload);
    },
    setMaggioriEstratti: (state, { payload }) => {
      state.maggioriEstratti = payload;
    },
    addMaggioriEstratti: (state, { payload }) => {
      state.maggioriEstratti.push(payload);
    },
    removeMaggioriEstratto: (state, { payload }) => {
      state.maggioriEstratti = state.maggioriEstratti.filter(
        (maggior) => maggior.id !== payload
      );
    },
    resetDoni: (state) => {
      state.doni = [];
      state.maggioriEstratti = [];
    },
  },
});

export const {
  setDoni,
  addDoni,
  removeDono,
  setMaggioriEstratti,
  addMaggioriEstratti,
  removeMaggioriEstratto,
  resetDoni,
} = doniSlice.actions;

export default doniSlice.reducer;
