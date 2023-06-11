import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CommonState } from './common.states';

export const selectChangeHeader =
  createFeatureSelector<CommonState>('changeHeader');

export const isBackHeader = createSelector(
  selectChangeHeader,
  (state: CommonState) => state.isBackHeader
);
