import { createRouter, createWebHistory } from 'vue-router'
import { call } from 'frappe-ui'
import { usersStore } from '@/stores/users'
import { sessionStore } from '@/stores/session'
import { viewsStore } from '@/stores/views'

let setupChecked = false
export const SETUP_DONE_KEY = 'crm_setup_completed'

async function needsSetup() {
  // Client-side flag guards against re-prompting if the server persist failed.
  if (localStorage.getItem(SETUP_DONE_KEY)) return false
  const completed = await call('frappe.client.get_single_value', {
    doctype: 'FCRM Settings',
    field: 'setup_completed',
  })
  return !completed
}

async function getSetupRedirect(to, isAdminUser) {
  if (to.name === 'Setup') {
    const allowed = isAdminUser && (await needsSetup().catch(() => false))
    return allowed ? null : { name: 'Home' }
  }
  if (!isAdminUser || setupChecked) return null
  setupChecked = true
  const required = await needsSetup().catch(() => false)
  return required ? { name: 'Setup' } : null
}

const routes = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/pages/MobileNotification.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
  },
  {
    alias: '/leads',
    path: '/leads/view/:viewType?',
    name: 'Leads',
    component: () => import('@/pages/Leads.vue'),
  },
  {
    path: '/leads/:leadId',
    name: 'Lead',
    component: () => import(`@/pages/${handleMobileView('Lead')}.vue`),
    props: true,
  },
  {
    alias: '/deals',
    path: '/deals/view/:viewType?',
    name: 'Deals',
    component: () => import('@/pages/Deals.vue'),
  },
  {
    path: '/deals/:dealId',
    name: 'Deal',
    component: () => import(`@/pages/${handleMobileView('Deal')}.vue`),
    props: true,
  },
  {
    alias: '/notes',
    path: '/notes/view/:viewType?',
    name: 'Notes',
    component: () => import('@/pages/Notes.vue'),
  },
  {
    alias: '/tasks',
    path: '/tasks/view/:viewType?',
    name: 'Tasks',
    component: () => import('@/pages/Tasks.vue'),
  },
  {
    alias: '/contacts',
    path: '/contacts/view/:viewType?',
    name: 'Contacts',
    component: () => import('@/pages/Contacts.vue'),
  },
  {
    path: '/contacts/:contactId',
    name: 'Contact',
    component: () => import(`@/pages/${handleMobileView('Contact')}.vue`),
    props: true,
  },
  {
    alias: '/organizations',
    path: '/organizations/view/:viewType?',
    name: 'Organizations',
    component: () => import('@/pages/Organizations.vue'),
  },
  {
    path: '/organizations/:organizationId',
    name: 'Organization',
    component: () => import(`@/pages/${handleMobileView('Organization')}.vue`),
    props: true,
  },
  {
    alias: '/call-logs',
    path: '/call-logs/view/:viewType?',
    name: 'Call Logs',
    component: () => import('@/pages/CallLogs.vue'),
  },
  {
    alias: '/data-import',
    path: '/data-import/view/:viewType?',
    name: 'Data Imports',
    component: () => import('@/pages/DataImports.vue'),
  },
  // one page across these routes, so an import stays open when its URL changes
  // after the first save
  {
    path: '/data-import/doctype/:doctype?',
    name: 'NewDataImport',
    component: () => import('@/pages/DataImport.vue'),
    meta: { viewKey: 'data-import' },
  },
  {
    path: '/data-import/:importName',
    name: 'DataImport',
    component: () => import('@/pages/DataImport.vue'),
    meta: { viewKey: 'data-import' },
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/pages/Welcome.vue'),
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/pages/Setup.vue'),
  },
  {
    path: '/:invalidpath',
    name: 'Invalid Page',
    component: () => import('@/pages/InvalidPage.vue'),
  },
  {
    path: '/not-permitted',
    name: 'Not Permitted',
    component: () => import('@/pages/NotPermitted.vue'),
  },
]

const handleMobileView = (componentName) => {
  return window.innerWidth < 768 ? `Mobile${componentName}` : componentName
}

let router = createRouter({
  history: createWebHistory(
    typeof window !== 'undefined' && window.location.pathname.startsWith('/crm')
      ? '/crm'
      : '',
  ),
  routes,
})

router.beforeEach(async (to, from, next) => {
  router.previousRoute = from

  const { isLoggedIn, user } = sessionStore()
  const { users, isCrmUser, isAdmin } = usersStore()

  if (isLoggedIn && !users.fetched) {
    try {
      await users.promise
    } catch (error) {
      console.warn('Error loading users', error)
    }
  }

  const hasCrmAccess =
    user === 'Administrator' || (isCrmUser && isCrmUser()) || true

  if (isLoggedIn && hasCrmAccess) {
    const isAdminUser = isAdmin ? isAdmin() || user === 'Administrator' : true
    const redirect = await getSetupRedirect(to, isAdminUser).catch(() => null)
    if (redirect) return next(redirect)
  }

  if (isLoggedIn && to.name === 'Home') {
    try {
      const { views, getDefaultView } = viewsStore()
      await views.promise
      let defaultView = getDefaultView()
      if (defaultView) {
        let { route_name, type, name, is_standard } = defaultView
        route_name = route_name || 'Leads'
        if (name && !is_standard) {
          return next({
            name: route_name,
            params: { viewType: type },
            query: { view: name },
          })
        }
        return next({ name: route_name, params: { viewType: type } })
      }
    } catch (e) {}
    return next({ name: 'Leads' })
  } else if (!isLoggedIn) {
    return next()
  } else if (to.matched.length === 0) {
    next({ name: 'Invalid Page' })
  } else if (['Deal', 'Lead'].includes(to.name) && !to.hash) {
    let storageKey = to.name === 'Deal' ? 'lastDealTab' : 'lastLeadTab'
    const activeTab = localStorage.getItem(storageKey) || 'activity'
    const hash = '#' + activeTab
    next({ ...to, hash })
  } else if (
    [
      'Leads',
      'Deals',
      'Contacts',
      'Organizations',
      'Notes',
      'Tasks',
      'Call Logs',
      'Data Imports',
    ].includes(to.name) &&
    !to.query?.view
  ) {
    const { views, standardViews, getDefaultView } = viewsStore()
    await views.promise

    const viewType = to.params?.viewType ?? ''
    const standardViewTypes = ['list', 'kanban', 'group_by']

    if (!viewType) {
      const doctypeMap = {
        Leads: 'CRM Lead',
        Deals: 'CRM Deal',
        Contacts: 'Contact',
        Organizations: 'CRM Organization',
        Notes: 'FCRM Note',
        Tasks: 'CRM Task',
        'Call Logs': 'CRM Call Log',
        'Data Imports': 'Data Import',
      }

      const doctype = doctypeMap[to.name]
      let defaultViewType = 'list'

      let globalDefault = getDefaultView(to.name)
      if (globalDefault) {
        defaultViewType = globalDefault.type || 'list'
        if (globalDefault.name && !globalDefault.is_standard) {
          next({
            name: to.name,
            params: { viewType: defaultViewType },
            query: { ...to.query, view: globalDefault.name },
          })
          return
        }
      }

      for (const viewType of standardViewTypes) {
        const standardView = standardViews.value?.[doctype + ' ' + viewType]
        if (standardView?.is_default) {
          defaultViewType = viewType
          break
        }
      }

      next({
        name: to.name,
        params: { viewType: defaultViewType },
        query: to.query,
      })
    } else if (!standardViewTypes.includes(viewType)) {
      const viewNameOrLabel = viewType

      let view = views.data?.find(
        (v) => v.name == viewNameOrLabel || v.label === viewNameOrLabel,
      )

      if (view) {
        next({
          name: to.name,
          params: { viewType: view.type || 'list' },
          query: { ...to.query, view: view.name },
        })
      } else {
        next({
          name: to.name,
          params: { viewType: 'list' },
          query: to.query,
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
