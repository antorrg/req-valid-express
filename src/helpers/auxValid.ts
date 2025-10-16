
export type SanitizeOptions = {
  trim?: boolean;
  escape?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
};


export class AuxValid {
   static middError(message: string, status?: number): Error & { status: number } {
    const error = new Error(message) as Error & { status: number };
    error.status = status || 500;
    return error;
  }

  // Nueva función para manejar valores por defecto según el tipo
  static getDefaultValue (type:string):any {
    switch (type) {
      case 'boolean': return false
      case 'int': return 1
      case 'float': return 1.0
      case 'string': return ''
      default: return null
    }
  }

  static validateBoolean (value:string):boolean {
    if (typeof value === 'boolean') return value
    if (value === 'true') return true
    if (value === 'false') return false
    throw new Error('Invalid boolean value')
  }

  static validateInt (value:string):number {
    const intValue = Number(value)
    if (isNaN(intValue) || !Number.isInteger(intValue)) throw new Error('Invalid integer value')
    return intValue
  }

  static validateFloat (value:string):number {
    const floatValue = parseFloat(value)
    if (isNaN(floatValue)) throw new Error('Invalid float value')
    return floatValue
  }
  static escapeHTML(str: string): string {
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
static trimString(str: string): string {
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
        return AuxValid.validateBoolean(value)
      case 'int':
        return AuxValid.validateInt(value)
      case 'float':
        return AuxValid.validateFloat(value)
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
        if (sanitize.trim) value = this.trimString(value)
        if (sanitize.escape) value = this.escapeHTML(value)
        if (sanitize.lowercase) value = value.toLowerCase()
        if (sanitize.uppercase) value = value.toUpperCase()
      }
        return value
    }
  }
}
