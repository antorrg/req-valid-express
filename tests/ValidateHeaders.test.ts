import session from 'supertest'
import serverTest from './testHelpers/serverTest.help.ts'
const agent = session(serverTest)
import {describe,it, expect} from 'vitest'

describe('"Validator" class:', () => {
   describe('Method "validateHeaders". Headers validation and storage (default: "Content-Type")', () => {
    it('should fail with an incorrect Content-Type header', async () => {
      const res = await agent
        .post('/sanitize-headers')
        .set('Authorization', 'Bearer token')
        .set('Content-Type', 'text/html')
      expect(res.status).toBe(400)
      expect(res.body).toBe('Invalid Content-Type header')
    })
     it('should pass with the correct Content-Type "application/json"', async () => {
      const res = await agent
        .post('/sanitize-headers')
        .set('Authorization', 'Bearer token')
        .set('Content-Type', 'application/json')
      expect(res.status).toBe(200)
    })

    it('should pass with multipart/form-data', async () => {
      const res = await agent
        .post('/sanitize-headers-form')
        .set('Authorization', 'Bearer token')
          .set('Content-Type', 'multipart/form-data')//; boundary=----WebKitFormBoundary')
         .field('name', 'test value')
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })
})