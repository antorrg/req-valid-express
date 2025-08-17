import express, { Request, Response, NextFunction }from 'express'
import { Validator } from '../../dist/esm/Validator.js'
import type from '../../dist/types/express-context.js'

const singleSchema = {  
  name: { type: 'string' },
  active: { type: 'boolean', default: false },
  metadata: { type: 'string', optional: true },
  price: {type: 'float', default : 2.0}
}

const doubleSchema = {
  name: { type: 'string' },
  active: { type: 'boolean', default: false },
  profile: {
    age: { type: 'int' },
    rating: { type: 'float', default: 0.0 }
  },
  tags: [{ type: 'string' }],
  metadata: { type: 'string', optional: true }
}
const threeSchema = {
  name: { type: 'string' },
  active: { type: 'boolean', default: false },
  profile: [{
    age: { type: 'int' },
    rating: { type: 'float', default: 0.0 }
  },],
  tags: [{ type: 'string' }],
  metadata: { type: 'string', optional: true }
}
const headerSchema = {
  'content-type': {
    type: 'string',
    sanitize: { trim: true, lowercase: true },
  }
}
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const message:string = 'Introduzca un mail valido'

const queries = 
{
 page: {type: 'int', default: 1},
 size: {type: 'float', default: 1},
 fields: {type: 'string', default: '', sanitize:{trim: true, escape: true, lowercase: true}},
 truthy: {type: 'boolean', default: false}
}
const serverTest = express()
serverTest.use(express.json())

serverTest.post(
  '/test/body/create',
  Validator.validateBody(singleSchema),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)

serverTest.post(
  '/test/body/extra/create',
   Validator.validateBody(doubleSchema),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)
serverTest.post(
  '/test/body/three/create',
   Validator.validateBody(threeSchema),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)

serverTest.post(
  '/test/user',
 Validator.validateRegex(
    emailRegex,
    'email',
    message
  ),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)

serverTest.post(
  '/sanitize-headers', 
 Validator.validateHeaders(headerSchema), 
  (req, res) => {
  res.status(200).json({ success: true, headers: req.headers })
})
serverTest.post(
  '/sanitize-headers-form', 
  Validator.validateHeaders(headerSchema), 
  (req, res) => {
  res.status(200).json({ success: true, headers: req.headers, result: req?.context?.headers})
})
serverTest.get(
  '/test/param',
  Validator.validateQuery(queries),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.query, validData: req?.context?.query})
  }
)

serverTest.get(
  '/test/param/:id', 
  Validator.paramId('id', Validator.ValidReg.UUIDv4), 
  (req, res) => {
  res.status(200).json({ message: 'Passed middleware' })
})

serverTest.get(
  '/test/param/int/:id',
 Validator.paramId('id', Validator.ValidReg.INT),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })
  }
)

serverTest.use((err: Error & {status: number }, req:Request, res:Response, next: NextFunction) => {
  const status = err.status || 500
  const message = err.message || err.stack
  res.status(status).json(message)
})

export default serverTest
