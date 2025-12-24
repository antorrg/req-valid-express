# Introducción

::: info Work in Progress
Esta sección de la documentación está en construcción.
:::
`req-valid-express` es una librería **opinionada** de middlewares creada específicamente para validar datos de entrada en aplicaciones Express.js.

Con la llegada de Express 5, algunos aspectos del manejo de la request cambiaron de forma significativa. En particular, `req.query` pasó a ser de solo lectura, lo que impide modificarlo directamente desde un middleware. Para adaptarse a este nuevo modelo, la librería introduce un manejador propio que almacena los datos validados en un objeto independiente, manteniendo compatibilidad con Express 5 tanto en proyectos `CommonJS`, `ECMAScript Modules` como en `TypeScript`, ofreciendo además una experiencia completamente tipada en este último.

El objetivo principal de `req-valid-express` es ser minimalista y, al mismo tiempo, liberar a handlers y controllers de la carga de validar manualmente los datos de entrada (`body`, `params` y `query`). Para ello, proporciona validación y tipado en tiempo de ejecución (independiente del tipado estático de TypeScript) mediante un algoritmo recursivo que recorre un esquema de validación y lo compara con los datos enviados por el cliente.

Este algoritmo permite:

- Validar la existencia y el tipo de los datos.
- Aplicar sanitización cuando corresponde.
- Asignar valores por defecto definidos en el esquema.
- Construir un objeto final completamente tipado y seguro para la request.

Todo este proceso se realiza siguiendo las buenas prácticas recomendadas por Express para el manejo de datos y errores.

`req-valid-express` fue diseñada para ser utilizada exclusivamente con Express.js, aprovechando su ecosistema y ofreciendo una solución moderna, simple y robusta para la validación de requests en proyectos reales.

La librería se compone de una serie de métodos estáticos expuestos por la clase `Validator`. No mantiene estado interno, lo que garantiza un uso predecible y una carga mínima sobre el sistema.

Es importante aclarar que `req-valid-express` **no depende de librerías externas para la validación en tiempo de ejecución**. La única dependencia del proyecto es `inquirer`, utilizada exclusivamente por la herramienta de línea de comandos para la creación interactiva de esquemas. Esta decisión de diseño busca mantener la mayor simplicidad posible, reducir la deuda técnica y evitar dependencias innecesarias en el runtime de la aplicación.

## Motivación

Durante la transición hacia Express 5, surgieron varias limitaciones en las herramientas de validación existentes. En particular, la forma en que Express maneja los datos de entrada —especialmente req.query, ahora de solo lectura— hizo evidente la necesidad de una solución diseñada específicamente para este nuevo modelo.


La librería surgió con el objetivo de ofrecer un middleware ligero y minimalista, que siga fielmente las prácticas recomendadas por Express y permita validar y tipar body, params y query de forma clara y centralizada. Su diseño se basa en un esquema simple, fácil de aprender, y en un algoritmo recursivo capaz de procesar estructuras complejas sin esfuerzo adicional para el desarrollador.

Además, al generar un objeto de request ya validado, tipado y opcionalmente sanitizado, libera completamente a los handlers y controllers de cualquier lógica de validación, haciendo el código más legible, seguro y mantenible.

En resumen, la motivación detrás de req-valid-express es proporcionar una solución moderna, consistente y pensada para Express 5, que combine simplicidad, validación robusta y tipado fuerte sin depender de herramientas pesadas ni introducir capas innecesarias.