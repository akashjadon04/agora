export const ConditionBuilder = { render: () => null }
export const emptyTree = () => ({})
export const fromFrappeConditions = (c) => c || []
export const toFrappeConditions = (c) => c || []

export default {
  ConditionBuilder,
  emptyTree,
  fromFrappeConditions,
  toFrappeConditions,
}
