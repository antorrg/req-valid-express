
export type SanitizeOptions = {
  trim?: boolean;
  escape?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
};


export class AuxValid {
  static ValidReg = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[A-Z]).{8,}$/,
    UUIDv4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    INT: /^\d+$/, // Solo enteros positivos
    OBJECT_ID: /^[0-9a-fA-F]{24}$/, // ObjectId de MongoDB
    FIREBASE_ID: /^[A-Za-z0-9_-]{20}$/, // Firebase push ID
  }
  static splitObjectProps<T extends Record<string, any>, K extends keyof T = keyof T>(
      obj: T,
      propsToExtract: K[] = [] as unknown as K[]
    ): Pick<T, K> & { rest: Omit<T, K> } {
      const { rest, extracted } = (Object.entries(obj) as [string, any][]).reduce(
        (
          acc: { rest: Partial<Omit<T, K>>; extracted: Partial<Pick<T, K>> },
          [key, value]
        ) => {
          const k = key as unknown as K;
          if (propsToExtract.includes(k)) (acc.extracted as any)[k] = value;
          else (acc.rest as any)[key as Exclude<keyof T, K>] = value;
          return acc;
        },
        { rest: {} as Partial<Omit<T, K>>, extracted: {} as Partial<Pick<T, K>> }
      );

      return { rest: rest as Omit<T, K>, ...(extracted as Pick<T, K>) } as Pick<T, K> & {
        rest: Omit<T, K>;
      };
  }

  static #validateBoolean (value:string):boolean {
    if (typeof value === 'boolean') return value
    if (value === 'true') return true
    if (value === 'false') return false
    throw new Error('Invalid boolean value')
  }

  static #validateInt (value:string):number {
    const intValue = Number(value)
    if (isNaN(intValue) || !Number.isInteger(intValue)) throw new Error('Invalid integer value')
    return intValue
  }

  static #validateFloat (value:string):number {
    const floatValue = parseFloat(value)
    if (isNaN(floatValue)) throw new Error('Invalid float value')
    return floatValue
  }
  static #escapeHTML(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#96;');
}
static #trimString(str: string): string {
  return String(str).trim();
}
  static validateValue ( 
    value: any,
    fieldType: 'string' | 'int' | 'float' | 'boolean' | 'array',
    fieldName: string,
    itemIndex?: number | null,
    sanitize?: SanitizeOptions
  ):any {
    const indexInfo = itemIndex !== null ? ` in item[${itemIndex}]` : ''
    
     if (typeof value === 'object') {
    if (value instanceof String || value instanceof Number || value instanceof Boolean) {
      value = value.valueOf()
    }
   }
    switch (fieldType) {
      case 'boolean':
        return AuxValid.#validateBoolean(value)
      case 'int':
        return AuxValid.#validateInt(value)
      case 'float':
        return AuxValid.#validateFloat(value)
      case 'array':
        if (!Array.isArray(value)) {
          throw new Error(`Invalid array value for field ${fieldName}${indexInfo}`)
        }
        return value
      case 'string':
      default:
        if (typeof value !== 'string') {
          throw new Error(`Invalid string value for field ${fieldName}${indexInfo}`)
        }
        if (sanitize) {
        if (sanitize.trim) value = AuxValid.#trimString(value)
        if (sanitize.escape) value = AuxValid.#escapeHTML(value)
        if (sanitize.lowercase) value = value.toLowerCase()
        if (sanitize.uppercase) value = value.toUpperCase()
      }
        return value
    }
  }
}
