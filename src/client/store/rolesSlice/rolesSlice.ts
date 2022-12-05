import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { IRoleDef } from 'Types/Domain';
import { IHit, rolesService } from 'services/roles.service';

interface IRolesState {
  roles: IRoleDef[];
  status: null | 'fulfilled' | 'rejected' | 'pending';
  error: null | string;
}

const initialState: IRolesState = {
  roles: [],
  status: null,
  error: null
};

// CREATE FILE WITH QUERIES FOR THIS!
export const getRoles = createAsyncThunk<any, {}>(
  'genresSlice/getGenres',
  async (query, {}) => {
    const { data } = await rolesService.get(query);
    return data;
  }
);

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getRoles.pending, state => {
      state.status = 'pending';
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.status = 'fulfilled';

      const roles = action.payload.hits.hits.map((hit: IHit<IRoleDef>) => hit._source);
      state.roles = roles;
    });
  }
});

const rolesReducer = rolesSlice.reducer;

export default rolesReducer;
