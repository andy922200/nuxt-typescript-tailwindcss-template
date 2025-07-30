import type { ColumnProps } from 'primevue/column'

export interface CustomColumnConfig extends ColumnProps {
  translationKey: string
}

export interface DynamicConfig {
  translationPrefix: string
  widthPercentage?: number
  excludeFields?: string[]
  minWidth?: string
  insertPosition?: number
}

export interface TableConfig {
  STATIC_COLUMNS: CustomColumnConfig[]
  DYNAMIC_CONFIG?: DynamicConfig
}

export enum SelectionMode {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export type SelectionModeType = (typeof SelectionMode)[keyof typeof SelectionMode]

export interface BackendLevelConfig {
  level: number
  label?: string
  mode: SelectionModeType
  groupKey?: string
  selectAll?: boolean
  selectAllAsDefault?: boolean
}
