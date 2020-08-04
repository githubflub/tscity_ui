
export const default_CRUD = ['create', 'read', 'update', 'delete']

export const composeInitialCRUDState = (entity, CRUD = default_CRUD) => {
  const initial_state = {};

  CRUD.forEach(action => {
    initial_state[`${entity}_${action}_ing`] = false;
    initial_state[`${entity}_${action}_ed`] = false;
    initial_state[`${entity}_${action}_data`] = null;
    initial_state[`${entity}_${action}_error`] = null;
    initial_state[`${entity}_${action}_status`] = null;
  })

  return initial_state;
}