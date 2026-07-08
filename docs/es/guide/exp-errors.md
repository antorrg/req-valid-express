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