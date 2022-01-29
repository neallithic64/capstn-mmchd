export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'IDSR',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/doh-logo.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap' },
      { rel: 'stylesheet', href: 'http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [

  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/vue-html2pdf', mode: 'client' },
    '~/plugins/vue-datatable.js',
    '~/plugins/vue-clock.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast'
    // ['nuxt-tailvue', {toast: true}]
  ],

  toast: {
    position: 'bottom-right',
    register: [ // Register custom toasts
      {
        name: 'loading',
        message: 'Loading...',
        options: {
          type: 'info'
        }
      }
    ]
},

  router: {
    // middleware: ['auth']
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: "http://localhost:8080",
    credentials: true
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/login',
      callback: '/',
      home: '/'
    },
    strategies: {
      cookie: {
        endpoints: {
          login: { url: '/api/login', method: 'POST' },
          user: { url: '/api/getUser', method: 'GET', propertyName: false }
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
