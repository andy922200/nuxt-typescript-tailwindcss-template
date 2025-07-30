export enum CardModeTableSortStr {
  SORT = 'sort',
  SORT_ASC = 'sort_asc',
  SORT_DESC = 'sort_desc',
}

export type CardModeTableSortStrType =
  (typeof CardModeTableSortStr)[keyof typeof CardModeTableSortStr]
