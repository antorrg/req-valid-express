# Comenzar

`req-valid-express` no admite campos opcionales implícitos. Todo campo esperado debe estar definido explícitamente en el esquema de validación, si se necesita un campo opcional deberá tener un valor `default`.

La librería escribe un objeto en base al `schema` declarado, sin modificar los datos de entrada. Los datos almacenados en estos objetos corresponden exactamente, en nombre y tipo, a lo definido en el esquema.

Si un campo requerido no está presente, se lanzará un error. La librería permite definir valores por defecto: si un campo llega vacío o no está presente y tiene un valor por defecto declarado en el esquema, dicho valor será asignado automáticamente.

Esta librería puede utilizarse en proyectos que utilicen `CommonJS`, `ESM` (ECMAScript Modules) o `TypeScript`.

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


La librería posee una herramienta de línea de comandos interactiva que lo guiará en el proceso de la construcción del esquema (Verá la creación de esquemas en el apartado `CLI`, [Interfaz de Línea de Comandos])

## Uso

La libreria puede utilizarse en express:

```javascript
import { Validator } from 'req-valid-express'
```

o bien:

```javascript
const { Validator } = require('req-valid-express')
```

Y en aplicaciones de Node.js como Electron, etc.

```javascript
import { NodeValidator } from 'req-valid-express'
```

o:

```javascript
const { NodeValidator } = require('req-valid-express')
```

Los métodos y sus respectivos usos se encuentran en los apartados para express o node.