import { ref } from 'vue'

export const GroupByTable = {
  name: 'GroupByTable',
  props: ['doctype', 'groupBy', 'rows', 'totals', 'loading'],
  template: '<div class="w-full py-8 text-center text-ink-gray-5"><p class="text-sm">No records in this view</p></div>',
}

export const GroupBy = {
  name: 'GroupBy',
  props: ['modelValue'],
  template: '<button class="text-sm px-2 py-1 rounded border border-gray-200">Group By</button>',
}

export const useGroupByData = () => ({
  rows: ref([]),
  totals: ref({}),
  loading: ref(false),
  rowCount: ref(0),
  pageLength: ref(20),
  totalCapped: ref(false),
  totalCount: ref(0),
})

export const parseGroupBy = (v) => v || []
export const serializeGroupBy = (v) => v || []

export default {
  GroupByTable,
  GroupBy,
  useGroupByData,
  parseGroupBy,
  serializeGroupBy,
}
