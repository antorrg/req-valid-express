# Schema

Un **schema** es un objeto que describe la estructura esperada y las reglas de validación de los datos de entrada de una request.


## Propiedades soportadas

Un schema puede validar las siguientes partes de la solicitud:

- **`body`**: El cuerpo de la solicitud (JSON).
- **`query`**: Parámetros de la cadena de consulta (query string).
- **`params`**: Parámetros de ruta (URL params).
- **`headers`**: Cabeceras HTTP.
- **`rules`**: Reglas personalizadas o predefinidas (se detallan más adelante).


## Tipos de datos

El tipado y la conversión de datos se realizan en **tiempo de ejecución**, de forma independiente del tipado estático de TypeScript, aunque en total armonía con este.

Los tipos soportados por el schema son:

- **`string`**: Texto.
- **`int`**: Números enteros.
- **`float`**: Números decimales.
- **`boolean`**: Valores booleanos.
- **`object`**: Objetos anidados.
- **`array`**: Listas de elementos u objetos.

Tanto `int` como `float` corresponden al tipo `number` de TypeScript, pero se diferencian a nivel de validación en runtime.

## Ejemplo completo

### Cuerpo de la solicitud (`body`)  
Métodos: `POST`, `PUT`, `PATCH`


Esquema de validación para creación o edición: 
```ts

const userCreate = {
    name: { type: "string", sanitize: { trim: true } },
    email: { type: "string", sanitize: { toLowerCase: true } },
    password: { type: "string" },
    picture: {
      type: "string",
      default: "https://image.com"
    }
};
// Ejemplo con campos anidados: 
const productCreate = {
    name: { type: "string", sanitize: { trim: true } },
    description: { type: "string", sanitize: { escape: true } },
    enabled: { type: "boolean", default: true },
    items: [
      {
        name: { type: "string" },
        quantity: { type: "int" }
      }
    ]
};
```
Para crear los schemas se recomienda que utilice la herramienta provista (CLI).