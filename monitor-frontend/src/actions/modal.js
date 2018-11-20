import * as types from '../constants/ActionTypes';

export const openModal = (header, content) => ({
  type: types.OPEN_MODAL,
  header,
  content
});

export const closeModal = () => ({
  type: types.CLOSE_MODAL
});
