export const GroupByTable = { render: () => null }
export const GroupBy = { render: () => null }
export const useGroupByData = () => ({})
export const parseGroupBy = (v) => v || []
export const serializeGroupBy = (v) => v || []

export default {
  GroupByTable,
  GroupBy,
  useGroupByData,
  parseGroupBy,
  serializeGroupBy,
}
