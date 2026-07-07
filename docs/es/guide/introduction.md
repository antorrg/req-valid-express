# Introducción


`req-valid-express` es una librería de validación orientada a esquemas para aplicaciones Node.js, diseñada para validar datos de entrada de forma consistente, tipada y predecible en tiempo de ejecución.

Aunque originalmente fue concebida como un conjunto de middlewares para Express, la librería evolucionó hacia una arquitectura más flexible basada en dos capas:

1. Un motor de validación independiente del framework (`ValidationEngine`).
2. Dos integraciones que consumen este motor:
   - Una integración específica para Express (`Validator`).
   - Una integración agnóstica para entornos Node.js (`NodeValidator`).

Esto permite reutilizar la misma lógica de validación en distintos entornos como APIs tradicionales, backends en Next.js o aplicaciones de escritorio con Electron, manteniendo una única fuente de verdad para la validación.

La librería se compone de una serie de métodos estáticos expuestos por las clases `Validator` y `NodeValidator`. No mantiene estado interno (stateless), lo que garantiza un uso predecible y una carga mínima sobre el sistema.

Es importante aclarar que `req-valid-express` **no depende de librerías externas para la validación en tiempo de ejecución**. Esta decisión de diseño busca mantener la mayor simplicidad posible, reducir la deuda técnica y evitar dependencias innecesarias en el runtime de la aplicación.

El motor interno utiliza un algoritmo recursivo que permite:

- Validar la existencia y el tipo de los datos.
- Aplicar sanitización cuando corresponde.
- Asignar valores por defecto definidos en el esquema.
- Construir un objeto final completamente tipado y seguro para la aplicación.

Todo este proceso se realiza siguiendo las buenas prácticas recomendadas por Node.js y Express para el manejo de datos y errores.

El objetivo principal de `req-valid-express` es ser minimalista y, al mismo tiempo, liberar a handlers y controllers de la carga de validar manualmente los datos de entrada (`body`, `params` y `query`). Para ello, proporciona validación, tipado y cohersión de dataos en tiempo de ejecución (independiente del tipado estático de TypeScript) mediante un algoritmo recursivo que recorre un esquema de validación y lo compara con los datos enviados por el cliente.

Con la llegada de Express 5, algunos aspectos del manejo de la request cambiaron de forma significativa. En particular, `req.query` pasó a ser de solo lectura, lo que impide modificarlo directamente desde un middleware. Para adaptarse a este nuevo modelo, la librería introduce un manejador propio que almacena los datos validados en un objeto independiente, manteniendo compatibilidad con Express 5 tanto en proyectos `CommonJS`, `ECMAScript Modules` como en `TypeScript`, ofreciendo además una experiencia completamente tipada en este último.

En entornos no basados en Express, `NodeValidator` recibe directamente el objeto a validar y retorna una nueva instancia validada conforme al esquema definido. `NodeValidator` provee las mismas utilidades con la diferencia que recibe el objeto en lugar de extraerlo del req, y retorna una nueva instancia validada y tipada conforme al esquema dado.


## Motivación

Durante el desarrollo de aplicaciones en Node.js, la validación de datos de entrada suele dispersarse entre distintas capas del sistema: middlewares, controllers, servicios o incluso directamente en el acceso a datos. Esta fragmentación genera código difícil de mantener, inconsistencias en los tipos y una alta probabilidad de errores en tiempo de ejecución.

En el ecosistema actual existen múltiples herramientas de validación, pero muchas de ellas introducen complejidad adicional, dependencias pesadas o requieren adaptaciones específicas para cada framework.

Inicialmente, req-valid-express surgió como una respuesta a los cambios introducidos en Express 5 —en particular, la inmutabilidad de req.query— proponiendo un middleware simple, predecible y alineado con el flujo natural de Express.

Sin embargo, a medida que el problema se analizaba en mayor profundidad, se hizo evidente que la necesidad de validación consistente no es exclusiva de Express, sino un problema transversal en aplicaciones Node.js.

Por esta razón, la librería evolucionó hacia un enfoque más general, separando la lógica de validación en un motor independiente del framework y proporcionando integraciones específicas para distintos entornos.

Este enfoque permite:

- Centralizar la validación en un único esquema

- Reutilizar lógica entre diferentes capas o aplicaciones

- Reducir la duplicación de código

- Garantizar consistencia en los datos procesados


En este contexto, `req-valid-express` busca ofrecer una solución minimalista y robusta que combine simplicidad, validación en tiempo de ejecución y una integración natural con el flujo de la aplicación, sin introducir dependencias innecesarias ni capas de abstracción complejas.

## Consistencia de API vs Semántica en entornos no HTTP

Si viene del ecosistema de **Express**, notará que `NodeValidator` expone exactamente los mismos nombres de métodos que su contraparte `Validator` (como `validateBody`, `validateQuery` o `paramId`). 

Esta decisión de diseño fue tomada *ex-profeso* para ofrecer una **curva de aprendizaje cero**. El modelo mental se transfiere directamente:
- `validateBody`: Se utiliza para validar payloads u objetos complejos y profundos.
- `validateQuery`: Se utiliza para validar objetos de opciones planas (con soporte para reglas estrictas de valores permitidos).
- `paramId`: Se utiliza para validar un identificador específico dentro de un objeto.

Sin embargo, somos conscientes de que en entornos no estrictamente HTTP (como **Electron IPC**, **WebSockets**, colas de mensajes o llamadas a funciones genéricas en **Next.js**), utilizar terminología como *"Body"* o *"Query"* resulta semánticamente incongruente. 

Para resolver esta fricción sin romper la consistencia general de la librería, `NodeValidator` expone **alias semánticos** que apuntan exactamente a la misma lógica interna. Puede elegir los nombres que mejor se adapten al contexto de su proyecto:

| Método Original (Express/HTTP) | Alias Semántico (Agnóstico) | Uso recomendado |
| :--- | :--- | :--- |
| `NodeValidator.validateBody` | `NodeValidator.validatePayload` | Para validación de objetos profundos (ej. payload de WebSockets o IPC). |
| `NodeValidator.validateQuery` | `NodeValidator.validateOptions` | Para validación de objetos planos (ej. opciones de configuración). |
| `NodeValidator.paramId` | `NodeValidator.validateId` | Para extracción y validación de identificadores. |

Ambos conjuntos de métodos son idénticos bajo el capó. Es libre de usar el que tenga más sentido para la arquitectura de su equipo.

> Nota: `req-valid-express` no intenta competir con librerias de validación de node.js ya existentes, es una alternativa liviana para express, si bien evolucinó y evoluciona constantemente sigue siendo la simplicidad y la sencillez su característica principal, además de brindar seguridad para el backend en node.