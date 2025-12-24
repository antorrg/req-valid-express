# Comenzar

La librería puede utilizarse únicamente en proyectos que sigan la arquitectura de enrutadores y middlewares recomendada por Express.js. El formato de las funciones y la gestión de errores se apoyan directamente en el comportamiento estándar de Express, por lo que su uso en otras arquitecturas o frameworks puede provocar resultados inesperados.

El manejador de errores interno de `req-valid-express` genera un objeto que extiende la clase `Error` de Node.js, al que se le añade un código de estado HTTP. Este error es propagado mediante `next` y debe ser capturado por el manejador de errores definido en el módulo principal de la aplicación.


::: tip
Ejemplo del manejador de errores de express:
:::

```javascript

app.use((err, req, res, next)=>{
  const status = err.status ?? 500
  const message = err.message ?? 'Server error'
  res.status(status).json(message)
})
app.listen(3000)

```

`req-valid-express` no admite campos opcionales implícitos. Todo campo esperado debe estar definido explícitamente en el esquema de validación.

La librería reescribe `req.body` y crea los objetos `req.context.query` y `req.context.headers`, sin modificar los originales. Los datos almacenados en estos objetos corresponden exactamente, en nombre y tipo, a lo definido en el esquema.

Si un campo requerido no está presente, se lanzará un error con estado HTTP 400. La librería sí permite definir valores por defecto: si un campo llega vacío o no está presente y tiene un valor por defecto declarado en el esquema, dicho valor será asignado automáticamente.

Esta puede utilizarse en proyectos que utilicen `commonjs`, `ESM` (ecmascript modules) o `Typescript`.

## Instalación

::: tip
Para instalar la librería ejecuta el siguiente comando:
:::

```bash
npm install req-valid-express
```

o:

```bash
pnpm install req-valid-express
```

Una vez realizada la instalación se recomienda fuertemente no crear esquemas de validación de forma manual a fin de evitar errores de sintaxis. 

La librería posee una herramienta de linea de comandos interactiva que lo guiará en el proceso de la construccion del esquema (Verá la creación de esquemas en el apartado `CLI`, [Interfaz de Linea de Comandos])
