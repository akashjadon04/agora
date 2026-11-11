import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import frappeui from 'frappe-ui/vite'

function mockFrappeApi() {
  return {
    name: 'mock-frappe-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/method/')) return next()
        const method = req.url.replace('/api/method/', '').split('?')[0]
        res.setHeader('Content-Type', 'application/json')
        if (method === 'crm.www.crm.get_context_for_dev') {
          return res.end(
            JSON.stringify({
              boot: {
                sitename: 'Agora CRM',
                user: 'Administrator',
                user_info: {
                  Administrator: {
                    fullname: 'Akash Jadon',
                    image: 'https://github.com/akashjadon04.png',
                  },
                },
              },
            }),
          )
        }
        if (method === 'crm.api.session.get_users') {
          return res.end(
            JSON.stringify({
              message: [
                [
                  {
                    name: 'Administrator',
                    email: 'akash@jadon.dev',
                    full_name: 'Akash Jadon',
                    user_image: 'https://github.com/akashjadon04.png',
                    role: 'System Manager',
                  },
                ],
                [
                  {
                    name: 'Administrator',
                    email: 'akash@jadon.dev',
                    full_name: 'Akash Jadon',
                    user_image: 'https://github.com/akashjadon04.png',
                    role: 'System Manager',
                  },
                ],
              ],
            }),
          )
        }
        if (method === 'frappe.client.get_single_value') {
          return res.end(JSON.stringify({ message: 1 }))
        }
        if (method === 'crm.api.views.get_views') {
          return res.end(
            JSON.stringify({
              message: [
                {
                  name: 'all-leads',
                  label: 'All Leads',
                  type: 'list',
                  route_name: 'Leads',
                  dt: 'CRM Lead',
                  is_standard: 1,
                  is_default: 1,
                  public: 1,
                  pinned: 1,
                },
                {
                  name: 'all-deals',
                  label: 'All Deals',
                  type: 'kanban',
                  route_name: 'Deals',
                  dt: 'CRM Deal',
                  is_standard: 1,
                  is_default: 1,
                  public: 1,
                  pinned: 1,
                },
              ],
            }),
          )
        }
        return res.end(JSON.stringify({ message: [] }))
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  const config = {
    plugins: [
      mockFrappeApi(),
      vue(),
      vueJsx(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        },
        devOptions: {
          enabled: true,
        },
        manifest: {
          display: 'standalone',
          name: 'Frappe CRM',
          short_name: 'Frappe CRM',
          start_url: '/crm',
          description:
            'Modern & 100% Open-source CRM tool to supercharge your sales operations',
          icons: [
            {
              src: '/assets/crm/manifest/manifest-icon-192.maskable.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/assets/crm/manifest/manifest-icon-192.maskable.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/assets/crm/manifest/manifest-icon-512.maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/assets/crm/manifest/manifest-icon-512.maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        // point at the package src dir (not index.ts) so subpath imports like
        // `@whatsapp/ui/components/Messages` resolve to a real file
        '@whatsapp/ui': path.resolve(
          import.meta.dirname,
          'src/whatsapp-stub',
        ),
        // same shape for @framework/ui: its account form pieces (Grid, Link) are
        // what @whatsapp/ui's AccountForm is built on
        '@framework/ui': path.resolve(
          import.meta.dirname,
          'src/framework-stub',
        ),
      },
      // ensure the linked @whatsapp/ui package reuses the host app's single copy of each peer:
      // the symlinked source has no node_modules of its own, so dedupe resolves its imports
      // (`dompurify`, and the peers below) to the host's copy.
      // `reka-ui` is what frappe-ui builds on and it passes state through provide/inject,
      // so a second copy silently breaks context across a linked package's components.
      // the editor packages must resolve to one copy each: tiptap imports
      // `@tiptap/pm/model` while prosemirror-state/transform/tables import bare
      // `prosemirror-model`, so a nested install of either throws "multiple
      // versions of prosemirror-model were loaded" on mention insert. Unlike
      // optimizeDeps (dev-only) this also applies to the production build.
      // @framework/ui is aliased to frappe's ui/src, so its own direct deps
      // (leaflet, cropperjs, vuedraggable, marked, @codemirror/view) must also
      // come from here: a bench
      // build never installs apps/frappe/ui/node_modules.
      dedupe: [
        'vue',
        'vue-router',
        'frappe-ui',
        'reka-ui',
        // frappe's own node_modules has an old @vueuse/core without the exports frappe-ui needs
        '@vueuse/core',
        'dompurify',
        'cropperjs',
        'leaflet',
        'leaflet-draw',
        'leaflet.locatecontrol',
        // ConditionBuilder's drag handles; resolved from the host for the same reason
        'vuedraggable',
        '@tiptap/core',
        '@tiptap/pm',
        '@tiptap/vue-3',
        'prosemirror-model',
        'prosemirror-state',
        'prosemirror-view',
        'prosemirror-transform',
        '@codemirror/view',
        'marked',
      ],
    },
    optimizeDeps: {
      include: [
        'tailwind.config.js',
        // pre-bundled together so prosemirror-state/view share the model and
        // transform the editor loads, instead of carrying their own copies
        'prosemirror-model',
        'prosemirror-state',
        'prosemirror-transform',
        'prosemirror-view',
        'lowlight',
        'interactjs',
      ],
      // frappe-ui ships source: pre-bundling it bundles the editor's scripts but
      // leaves its .vue files outside, so the editor code loads twice
      exclude: ['frappe-ui'],
    },
    server: {
      fs: {
        // allow the bench `apps/` dir so Vite can serve linked local packages
        // (@whatsapp/ui, @framework/ui) that live in sibling app repos
        allow: [path.resolve(import.meta.dirname, '../..')],
      },
    },
  }

  config.plugins.unshift(
    frappeui({
      frappeProxy: false,
      lucideIcons: true,
      jinjaBootData: true,
      // its esbuild helper breaks Vite 8's dependency scan
      codeLanguages: false,
      buildConfig: {
        indexHtmlPath: '../crm/www/crm.html',
        emptyOutDir: true,
        sourcemap: true,
      },
    }),
  )

  return config
})
