import express, { Request, Response, NextFunction }from 'express'
import { Validator } from '../../dist/esm/Validator.js'
import * as asset from './assets.help.js'
import type from '../../dist/types/express-context.js'


const serverTest = express()
serverTest.use(express.json())
// validateBody---------------------------------
serverTest.post(
  '/test/body/create',
  Validator.validateBody(asset.singleSchema),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)

serverTest.post(
  '/test/body/sanitize',
  Validator.validateBody(asset.dangerousSchema),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)

serverTest.post(
  '/test/body/extra/create',
   Validator.validateBody(asset.doubleSchema),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)
serverTest.post(
  '/test/body/three/create',
   Validator.validateBody(asset.threeSchema),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)
serverTest.post(
  '/test/body/depth/create',
   Validator.validateBody(asset.threeSchema, 2),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)
// validateRegex------------------------------------------

serverTest.post(
  '/test/user',
 Validator.validateRegex(
    asset.emailRegex,
    'email',
    asset.message
  ),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.body })
  }
)
//validateHeaders--------------------------------
serverTest.post(
  '/sanitize-headers', 
 Validator.validateHeaders(asset.headerSchema), 
  (req, res) => {
  res.status(200).json({ success: true, headers: req.headers })
})
serverTest.post(
  '/sanitize-headers-form', 
  Validator.validateHeaders(asset.headerSchema), 
  (req, res) => {
  res.status(200).json({ success: true, headers: req.headers, result: req?.context?.headers})
})
// validateQuery---------------------------------

serverTest.get(
  '/test/param',
  Validator.validateQuery(asset.queries),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.query, validData: req?.context?.query})
  }
)

serverTest.get(
  '/test/param/queries',
  Validator.validateQuery(
  asset.lockquery,
  {
    searchField: ['levelName', 'message', 'status'],
    sortBy: ['id', 'time', 'createdAt'],
    order:['ASC', 'DESC']
  }
  ),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.query, validData: req?.context?.query})
  }
)

// Additional endpoints for testing rules with numeric and boolean types
serverTest.get(
  '/test/param/rules-num',
  Validator.validateQuery(
    { level: { type: 'int', default: 1 } },
    { level: [1, 2] }
  ),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.query, validData: req?.context?.query })
  }
)

serverTest.get(
  '/test/param/rules-bool',
  Validator.validateQuery(
    { flag: { type: 'boolean', default: false } },
    { flag: [true] }
  ),
  (req, res) => {
    res.status(200).json({ message: 'Passed middleware', data: req.query, validData: req?.context?.query })
  }
)

//paramId----------------------------------------------

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
