

export const singleSchema = {  
  name: { type: 'string' },
  active: { type: 'boolean', default: false },
  metadata: { type: 'string', sanitize:{trim: true, escape: true} },
  price: {type: 'float', default : 2.0}
}
export const dangerousSchema = {
  name: {type: 'string', default: false, sanitize:{trim: true, escape: true} },
  active: { type: 'boolean', default: false },
  metadata: {type: 'string', default: false, sanitize:{trim: true, escape: true} },
  comment: {type: 'string', default: false, sanitize:{trim: true, escape: true} },
  symbols: {type: 'string', default: false, sanitize:{trim: true, escape: true} },
  price: {type: 'float', default : 2.0}
}

export const doubleSchema = {
  name: { type: 'string' },
  active: { type: 'boolean', default: false },
  profile: {
    age: { type: 'int' },
    rating: { type: 'float', default: 0.0 }
  },
  tags: [{ type: 'string' }],
  metadata: { type: 'string', optional: true }
}
export const threeSchema = {
  name: { type: 'string' },
  active: { type: 'boolean', default: false },
  profile: [{
    age: { type: 'int' },
    rating: { type: 'float', default: 0.0 }
  },],
  tags: [{ type: 'string' }],
  metadata: { type: 'string', optional: true }
}
export const headerSchema = {
  'content-type': {
    type: 'string',
    sanitize: { trim: true, lowercase: true },
  }
}
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const message:string = 'Introduzca un mail valido'

export const queries = 
{
 page: {type: 'int', default: 1},
 size: {type: 'float', default: 1},
 fields: {type: 'string', default: '', sanitize:{trim: true, escape: true, lowercase: true}},
 truthy: {type: 'boolean', default: false}
}
export const lockquery = {
  page: {type: "int", default: 1},
  limit: {type: "int", default: 5},
  searchField: {type: "string", default: "levelName", sanitize: {trim: true}},
  search: {type: "string", default: "", sanitize: {trim: true}},
  sortBy: {type: "string", default: "id", sanitize: {trim: true}},
  order: {type: "string", default: "ASC", sanitize: {trim: true}}};

