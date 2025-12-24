# Sanitización

La sanitización te permite transformar los valores de entrada antes de que sean validados o procesados.

## Ejemplo de uso

Puedes aplicar transformaciones como `trim` o `lowercase` directamente en la definición del campo.

```ts
const schema = {
  body: {
    email: {
      type: "string",
      sanitize: { 
        trim: true, 
        lowercase: true 
      }
    }
  }
};
```
