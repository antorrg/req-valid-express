# Rules

Las **rules** son validaciones predefinidas que puedes usar directamente en tu esquema.

## Uso básico

```ts
const schema = {
  body: {
    email: { type: "string", rules: "email" },
    userId: { type: "string", rules: "uuidv4" }
  }
};
```

## Reglas Disponibles

| Regla | Descripción | Regex |
| :--- | :--- | :--- |
| `EMAIL` | Valida formato de correo electrónico | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `PASSWORD` | Mínimo 8 caracteres, al menos una mayúscula | `/^(?=.*[A-Z]).{8,}$/` |
| `UUIDv4` | Identificador único universal v4 | `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i` |
| `INT` | Solo números enteros positivos | `/^\d+$/` |
| `OBJECT_ID` | MongoDB ObjectId | `/^[0-9a-fA-F]{24}$/` |
| `FIREBASE_ID` | Firebase Push ID | `/^[A-Za-z0-9_-]{20}$/` |
