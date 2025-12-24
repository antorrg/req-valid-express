
# Métodos principales de validación

`req-valid-express` outlines three main middlewares for validating input data:

[`validateBody`](#validatebody)

[`validateHeaders`](#validateheaders)

[`validateQuery`](#validatequery)


All three share the same internal behavior and use the same validation scheme. The only difference between them is where the validation result is stored.

## General behavior

- Todos los métodos siguen el mismo flujo:

- Reciben los datos de entrada de la request.

- Ignoran cualquier campo no definido en el schema.

- Validan existencia, tipo, sanitización y valores por defecto.

- Construyen un objeto final seguro y tipado.

- Si la validación falla, lanzan un error con estado HTTP 400 y un mensaje descriptivo.

### `validateBody`

El método `validateBody` toma los datos entrantes desde `req.body`, valida únicamente los campos definidos en el schema y sobreescribe `req.body` con el resultado de la validación.

Esto garantiza que, a partir de ese punto, `req.body` contenga exclusivamente datos confiables, con la estructura y tipos esperados y que los handlers no necesiten realizar validaciones adicionales.

Ejemplo

```javascript
// req.body entrante:
{
    "email": "user@example.com",
    "password": "123456",
    "name": "user",
    "enabled": "true",
    "age" : "18",
    "picture": "https://image.com"
}
```

Luego de pasar por `Validator.validateBody`, utilizando `userCreate` como schema:

```ts
import { Validator } from 'req-valid-express';
const userCreate = {
    email: { type: "string", sanitize: { toLowerCase: true } },
    password: { type: "string" },
    enabled: {type: "boolean"},
    age: {type: "int"}
};

const router = express.Router()

router.post('/', Validator.validateBody(userCreate), (req, res)=>{
    res.json(req.body)
})
```

`req.body` será:

```javascript
// req.body saliente:
{
    email: "user@example.com",
    password: "123456",
    enabled: true, 
    age: 18
}
```
Si alguno de los campos definidos en el schema no está presente o no cumple con el tipo esperado (incluyendo el caso habitual en el que los valores llegan como strings), el middleware lanzará un error con estado 400, el cual será manejado por el error handler de Express.

### `validateHeaders`


### `validateQuery`