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
              { text: "Getting Started", link: "/guide/introduction" },
              { text: "Validator (Express)", link: "/guide/validateBody" },
              { text: "NodeValidator", link: "/guide/rules" }
            ]
          },
          { text: "Examples", link: "/guide/examples" }
        ],

        sidebar: {
          "/guide/": [
            {
              text: "Getting Started",
              collapsed: false,
              items: [
                { text: "Introduction", link: "/guide/introduction" },
                { text: "Getting Started", link: "/guide/getting-started" },
                { text: "Schemas", link: "/guide/schema" },
                { text: "CLI", link: "/guide/cli" },
              ]
            },
            {
              text: "Validator (Express)",
              collapsed: true,
              items: [
                { text: "Main methods", link: "/guide/validation" },
                { text: "ValidateQuery", link: "/guide/validateQuery" },
                { text: "ValidateHeaders", link: "/guide/validateHeaders" },
                { text: "ParamId", link: "/guide/paramId" },
                { text: "Errors", link: "/guide/exp-errors" }
              ]
            },
            {
              text: "NodeValidator",
              collapsed: true,
              items: [
                { text: "ValidReg", link: "/guide/validReg" },
                { text: "Rules", link: "/guide/rules" },
                { text: "ValidateRegex", link: "/guide/validateRegex" }
              ]
            },
            {
              text: "Resources",
              collapsed: false,
              items: [
                { text: "Examples", link: "/guide/examples" }
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
              { text: "Primeros Pasos", link: "/es/guide/introduction" },
              { text: "Validator (Express)", link: "/es/guide/validation" },
              { text: "NodeValidator", link: "/es/guide/rules" }
            ]
          },
          { text: "Ejemplos", link: "/es/guide/examples" }
        ],

        sidebar: {
          "/es/guide/": [
            {
              text: "Primeros Pasos",
              collapsed: false,
              items: [
                { text: "Introducción", link: "/es/guide/introduction" },
                { text: "Comenzar", link: "/es/guide/getting-started" },
                { text: "Schemas", link: "/es/guide/schema" },
                { text: "CLI", link: "/es/guide/cli" },
              ]
            },
            {
              text: "Validator (Express)",
              collapsed: true,
              items: [
                { text: "Principales métodos", link: "/es/guide/validation" },
                { text: "ParamId", link: "/es/guide/paramId" },
                { text: "Errores", link: "/es/guide/errors" }
              ]
            },
            {
              text: "NodeValidator",
              collapsed: true,
              items: [
                { text: "ValidReg", link: "/es/guide/validReg" },
                { text: "Rules", link: "/es/guide/rules" },
                { text: "ValidateRegex", link: "/es/guide/validateRegex" }
              ]
            },
            {
              text: "Recursos",
              collapsed: false,
              items: [
                { text: "Ejemplos", link: "/es/guide/examples" }
              ]
            }
          ]
        }
      }
    }
  }
})
