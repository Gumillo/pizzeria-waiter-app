import { API_URL } from '../config';

// selectors
export const getAllTables = state => state.tables.data;
export const getTableById = (state, tableId) => state.tables.data.find(table => table.id === tableId);
export const getTablesLoading = state => state.tables.loading;
export const getTablesUpdating = state => state.tables.updating;

// actions
const createActionName = actionName => `app/tables/${actionName}`;
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const UPDATE_START = createActionName('UPDATE_START');
const UPDATE_SUCCESS = createActionName('UPDATE_SUCCESS');
const UPDATE_ERROR = createActionName('UPDATE_ERROR');

// action creators
const fetchStart = () => ({ type: FETCH_START });
const fetchSuccess = payload => ({ type: FETCH_SUCCESS, payload });
const fetchError = payload => ({ type: FETCH_ERROR, payload });
const updateStart = () => ({ type: UPDATE_START });
const updateSuccess = payload => ({ type: UPDATE_SUCCESS, payload });
const updateError = payload => ({ type: UPDATE_ERROR, payload });

// thunk creators
export const fetchTables = () => {
  return dispatch => {
    dispatch(fetchStart());

    return fetch(`${API_URL}/tables`)
      .then(res => {
        if(!res.ok) throw new Error('Failed to fetch tables');
        return res.json();
      })
      .then(data => dispatch(fetchSuccess(data)))
      .catch(err => dispatch(fetchError(err.message || true)));
  };
};

export const updateTableRequest = tableData => {
  return dispatch => {
    dispatch(updateStart());

    return fetch(`${API_URL}/tables/${tableData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tableData),
    })
      .then(res => {
        if(!res.ok) throw new Error('Failed to update table');
        return res.json();
      })
      .then(data => {
        dispatch(updateSuccess(data));
        return { ok: true, data };
      })
      .catch(err => {
        dispatch(updateError(err.message || true));
        return { ok: false, error: err.message || true };
      });
  };
};

const tablesReducer = (statePart = { data: [], loading: { active: false, error: false }, updating: { active: false, error: false } }, action) => {
  switch(action.type) {
    case FETCH_START:
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    case FETCH_SUCCESS:
      return {
        ...statePart,
        data: action.payload,
        loading: {
          active: false,
          error: false,
        },
      };
    case FETCH_ERROR:
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    case UPDATE_START:
      return {
        ...statePart,
        updating: {
          active: true,
          error: false,
        },
      };
    case UPDATE_SUCCESS:
      return {
        ...statePart,
        data: statePart.data.map(table => table.id === action.payload.id ? action.payload : table),
        updating: {
          active: false,
          error: false,
        },
      };
    case UPDATE_ERROR:
      return {
        ...statePart,
        updating: {
          active: false,
          error: action.payload,
        },
      };
    default:
      return statePart;
  }
};

export default tablesReducer;
