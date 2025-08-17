import session from 'supertest'
import serverTest from './testHelpers/serverTest.help.ts'
const agent = session(serverTest)
import {describe,it, expect} from 'vitest'

describe('"Validator" class:', () => {
  describe('Method "ValidateBody". Body data validation and typing (POST and PUT) - Simple Object', () => {
    it('should validate, type parameters, and allow passing if all are correct.', async () => {
      const data = {
        name: 'name',
        active: 'true',
        metadata: 'metadata',
    }

      const response = await agent
        .post('/test/body/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
         name: 'name',
         active: true,
        metadata: 'metadata',
        price: 2.0
      })
    })
    it('should validate, type, and throw an error if a required parameter is missing.', async () => {
      const data = { 
        active: 'true',
        metadata: 'metadata',
       price: 2.0}
      const response = await agent
        .post('/test/body/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Missing field: name at name')
    })
    it('should validate, type, and throw an error if a parameter cannot be typed.', async () => {
      const data = {
        name:'name',
       active: 'true',
        metadata: 'metadata',
       price: 'true'
      }
      const response = await agent
        .post('/test/body/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid float value')
    })
    it('should validate, type parameters, and allow passing while removing any undeclared parameter.', async () => {
     const data = {
        name: 'name',
        active: 'true',
        metadata: 'metadata',
        enable:true,
        price: 2.0
    }
      
      const response = await agent
        .post('/test/body/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
         name: 'name',
         active: true,
         metadata: 'metadata',
         price: 2.0
      })
    })
  })
  describe('Method "ValidateBody". Body data validation and typing (POST and PUT) - Nested Object', () => {
    it('should validate, type parameters, and allow passing if all are correct.', async () => {
      const data = {
        name: 'name',
        active: 'true',
        profile: {
            age: '25',
            rating: 3.25
        },
        tags:['publico', 'privado'],
        metadata: 'metadata',
    }

      const response = await agent
        .post('/test/body/extra/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
      name: 'name',
        active: true,
        profile: {
            age: 25,
            rating: 3.25
        },
        tags:['publico', 'privado'],
        metadata: 'metadata',
      })
    })
    it('should validate, type, and throw an error if a required parameter is missing.', async () => {
      const data = { 
        active: 'true',
        profile: {
            age: 25,
            rating: 3.25
        },
        tags:['publico', 'privado'],
        metadata: 'metadata',
    }
      const response = await agent
        .post('/test/body/extra/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Missing field: name at name')
    })
    it('should validate, type, and throw an error if a parameter cannot be typed.', async () => {
      const data = {
      name: 'name',
        active: 'true',
        profile: {
            age: 25,
            rating: 'cooole'
        },
        tags:['publico', 'privado'],
        metadata: 'metadata',
      }
      const response = await agent
        .post('/test/body/extra/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid float value')
    })
    it('should validate, type parameters, and allow passing while removing any undeclared parameter.', async () =>{     const data = {
        name: 'name',
        active: 'true',
        profile: {
            age: '25',
            rating: 3.25
        },
        tags:['publico', 'privado'],
        metadata: 'metadata',
        enable: true,
    }
      const response = await agent
        .post('/test/body/extra/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
      name: 'name',
        active: true,
        profile: {
            age: 25,
            rating: 3.25
        },
        tags:['publico', 'privado'],
        metadata: 'metadata',
      })
    })
  })
  describe('Method "ValidateBody". Body data validation and typing (POST and PUT) - Double Nested Object', () => {
    it('should validate, type parameters, and allow passing if all are correct.', async () => {
      const data = {
        name: 'name',
        active: 'true',
        profile: [{
            age: '25',
            rating: 3.25
        },{
            age: '33',
            rating: 4.0
        }],
        tags:['publico', 'privado'],
        metadata: 'metadata',
    }

      const response = await agent
        .post('/test/body/three/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
           name: 'name',
        active: true,
        profile: [{
            age: 25,
            rating: 3.25
        },{
            age: 33,
            rating: 4.0
        }],
        tags:['publico', 'privado'],
        metadata: 'metadata',
      })
    })
    it('should validate, type, and throw an error if a required parameter is missing.', async () => {
      const data = { 
        active: 'true',
        metadata: 'metadata',
       price: 2.0}
      const response = await agent
        .post('/test/body/three/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Missing field: name at name')
    })
    it('should validate, type, and throw an error if a parameter cannot be typed.', async () => {
         const data = {
        name: 'name',
        active: 'true',
        profile: [{
            age: '25',
            rating: 3.25
        },{
            age: 'psps99dl',
            rating: 4.0
        }],
        tags:['publico', 'privado'],
        metadata: 'metadata',
    }
      const response = await agent
        .post('/test/body/three/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid integer value')
    })
    it('should validate, type parameters, and allow passing while removing any undeclared parameter.', async () => {
     const data = {
        name: 'name',
        active: 'true',
        profile: [{
            age: '25',
            rating: 3.25
        },{
            age: '33',
            rating: 4.0
        }],
        tags:['publico', 'privado'],
        metadata: 'metadata',
        enable: true,
        deletedAt: null
    }
      
      const response = await agent
        .post('/test/body/three/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
        name: 'name',
        active: true,
        profile: [{
            age: 25,
            rating: 3.25
        },{
            age: 33,
            rating: 4.0
        }],
        tags:['publico', 'privado'],
        metadata: 'metadata',
      })
    })
  })
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
  describe('Method "validateQuery". Query validation and typing for GET requests', () => {
    it('should validate, type parameters, and allow passing if all are correct.', async () => {
      const response = await agent
        .get('/test/param?page=2&size=2.5&fields=PEPE&truthy=true')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({
        page: 2,
        size: 2.5,
        fields: 'pepe',
        truthy: true
      })
    })
    it('should fill query with default values if empty.', async () => {
      const response = await agent
        .get('/test/param')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({
        page: 1,
        size: 1,
        fields: '',
        truthy: false
      })
    })
    it('should throw an error if a parameter cannot be converted.', async () => {
      const response = await agent
        .get('/test/param?page=pepe&size=2.5')
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid integer value')
    })
    it('should remove any values that are not declared.', async () => {
      const response = await agent
        .get('/test/param?page=2&size=2.5&fields=pepe&truthy=true&demas=pepito')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({
        page: 2,
        size: 2.5,
        fields: 'pepe',
        truthy: true
      })
    })
  })
  describe('Method "validateRegex". Field validation using regex', () => {
    it('should allow passing if the parameter matches the regex.', async () => {
      const data = { email: 'emaildeprueba@ejemplo.com' }
      const response = await agent
        .post('/test/user')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.data).toEqual({
        email: 'emaildeprueba@ejemplo.com'
      })
    })
    it('should throw an error if the parameter does not match the regex.', async () => {
      const data = { email: 'emaildeprueba@ejemplocom' }
      const response = await agent
        .post('/test/user')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe(
        'Invalid email format! Introduzca un mail valido'
      )
    })
  })
  describe('Method "paramId". ID validation. UUID v4 type', () => {
    it('should allow passing if the ID is a valid UUID.', async () => {
      const id = 'c1d970cf-9bb6-4848-aa76-191f905a2edd'
      const response = await agent
        .get(`/test/param/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
    })
    it('should throw an error if the ID is not a valid UUID.', async () => {
      const id = 'c1d970cf-9bb6-4848-aa76191f905a2edd1'
      const response = await agent
        .get(`/test/param/${id}`)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid parameters')
    })
  })
  describe('Method "paramId". ID validation. INTEGER type', () => {
    it('should allow passing if the ID is a valid integer', async () => {
      const id = 1
      const response = await agent
        .get(`/test/param/int/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
    })
    it('should throw an error if the ID is not a valid integer.', async () => {
      const id = 'dkdi'
      const response = await agent
        .get(`/test/param/int/${id}`)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Invalid parameters')
    })
  })
})
