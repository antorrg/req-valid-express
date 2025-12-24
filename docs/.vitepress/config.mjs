import { defineConfig } from 'vitepress'


export default defineConfig({
  title: "req-valid-express",
  description: "Type-safe request validation for Express",
  base: "/req-valid-express/", // IMPORTANTE para GitHub Pages

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          {
            text: "Guide",
            items: [
              { text: "Introduction", link: "/guide/introduction" },
              { text: "Getting Started", link: "/guide/getting-started" },
              { text: "Schemas", link: "/guide/schema" },
              { text: "CLI", link: "/guide/cli" },
              { text: "ValidateBody", link: "/guide/validateBody" },
              { text: "ValidateQuery", link: "/guide/validateQuery" },
              { text: "ValidateHeaders", link: "/guide/validateHeaders" },
              { text: "ValidateRegex", link: "/guide/validateRegex" },
              { text: "ParamId", link: "/guide/paramId" },
              { text: "ValidReg", link: "/guide/rules" },
              { text: "Rules", link: "/guide/rules" },
              { text: "Errors", link: "/guide/errors" }
            ]
          },
          { text: "Examples", link: "/guide/examples" }
        ],

        sidebar: {
          "/guide/": [
            {
              text: "Guide",
              collapsible: false,
              items: [
                { text: "Introduction", link: "/guide/introduction" },
                { text: "Getting Started", link: "/guide/getting-started" },
                { text: "Schemas", link: "/guide/schema" },
                { text: "CLI", link: "/guide/cli" },
                { text: "ValidateBody", link: "/guide/validateBody" },
                { text: "Principales", link: "/guide/validateQuery" },
                { text: "ValidateHeaders", link: "/guide/validateHeaders" },
                { text: "ValidateRegex", link: "/guide/validateRegex" },
                { text: "ParamId", link: "/guide/paramId" },
                { text: "ValidReg", link: "/guide/rules" },
                { text: "Rules", link: "/guide/rules" },
                { text: "Errors", link: "/guide/errors" },
                { text: "Examples", link: "/guide/examples" },
              ]
            }
          ]
        }
      }
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      themeConfig: {
        nav: [
          { text: "Inicio", link: "/es/" },
          {
            text: "Guía",
            items: [
              { text: "Introducción", link: "/es/guide/introduction" },
              { text: "Comenzar", link: "/es/guide/getting-started" },
              { text: "Schemas", link: "/es/guide/schema" },
              { text: "CLI", link: "/es/guide/cli" },
              { text: "Principales metodos", link: "/es/guide/validation" },
              { text: "ValidateRegex", link: "/es/guide/validateRegex" },
              { text: "ParamId", link: "/es/guide/paramId" },
              { text: "ValidReg", link: "/es/guide/rules" },
              { text: "Rules", link: "/es/guide/errors" }
            ]
          },
          { text: "Ejemplos", link: "/es/guide/examples" }
        ],

        sidebar: {
          "/es/guide/": [
            {
              text: "Guía",
              collapsible: false,
              items: [
                { text: "Introducción", link: "/es/guide/introduction" },
                { text: "Comenzar", link: "/es/guide/getting-started" },
                { text: "Schemas", link: "/es/guide/schema" },
                { text: "CLI", link: "/es/guide/cli" },
                { text: "Principales metodos", link: "/es/guide/validation" },
                { text: "ValidateRegex", link: "/es/guide/validateRegex" },
                { text: "ParamId", link: "/es/guide/paramId" },
                { text: "ValidReg", link: "/es/guide/rules" },
                { text: "Rules", link: "/es/guide/errors" },
                { text: "Ejemplos", link: "/es/guide/examples" },
              ]
            }
          ]
        }
      }
    }
  }
})
