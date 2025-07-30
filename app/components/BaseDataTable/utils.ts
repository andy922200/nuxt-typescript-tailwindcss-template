import type { ColumnProps } from 'primevue/column'

import type {
  BackendLevelConfig,
  CustomColumnConfig,
  DynamicConfig,
  TableConfig,
} from '@/components/BaseDataTable/type'

export const createColumnsFromConfig = (columnConfigs: CustomColumnConfig[]): ColumnProps[] => {
  return columnConfigs.map((config) => ({
    field: config.field,
    header: config.translationKey,
    style: config.style,
    sortable: config.sortable || false,
  }))
}

export const createDynamicColumns = (
  levelConfigs: BackendLevelConfig[],
  options: DynamicConfig = {
    translationPrefix: '',
    widthPercentage: 50,
    minWidth: '100px',
  },
) => {
  const config = { ...options }

  if (!levelConfigs?.length) return []

  const filteredConfigs = config.excludeFields
    ? levelConfigs.filter(
        (levelConfig) => !config.excludeFields!.includes(levelConfig.groupKey || ''),
      )
    : levelConfigs

  const totalConfigs = filteredConfigs.length
  const widthPerConfig = config.widthPercentage! / totalConfigs

  return filteredConfigs.map((levelConfig) => ({
    field: levelConfig.groupKey || '',
    header: levelConfig.groupKey ? `${config.translationPrefix}.${levelConfig.groupKey}` : '',
    style: {
      width: `${totalConfigs !== 0 ? widthPerConfig : config.widthPercentage}%`,
      ...(config.minWidth && { minWidth: config.minWidth }),
    },
    sortable: Boolean(levelConfig.groupKey),
  }))
}

export const createTableColumns = (
  config: TableConfig,
  levelConfigs?: BackendLevelConfig[],
): ColumnProps[] => {
  const staticColumns = createColumnsFromConfig(config.STATIC_COLUMNS)

  if (!config.DYNAMIC_CONFIG || !levelConfigs) {
    return staticColumns
  }

  const dynamicColumns = createDynamicColumns(levelConfigs, config.DYNAMIC_CONFIG)

  if (config.DYNAMIC_CONFIG.insertPosition !== undefined) {
    const result = [...staticColumns]
    result.splice(config.DYNAMIC_CONFIG.insertPosition, 0, ...dynamicColumns)
    return result
  }

  return [...dynamicColumns, ...staticColumns]
}
