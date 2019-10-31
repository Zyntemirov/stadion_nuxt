module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'nuxt-firebsae-auth-ex',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js and Firebase Authentication Example Application' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: [
      { src: 'https://api-maps.yandex.ru/2.1.8/?apikey=9312f419-42d1-482d-8a79-ba77054ed952&lang=ru_RU' },
    ]
  },

  /*
  ** Customize the progress bar color
  */
  loading: {
    color: '#ff2f00',
    height: '3px'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (isDev) {
        config.resolve.alias['config'] = '~/config/development'
      } else {
        config.resolve.alias['config'] = '~/config/production'
      }
    }
  },

  plugins: [
    {
      src: '~plugins/uikit.js' , ssr: false,
    },
  ],

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    debug: true,
    proxy: {
      'api': 'https://nuxt-fireauth-v5.now.sh'
    }
  }
}
