import session from 'supertest'
import serverTest from './testHelpers/serverTest.help.ts'
const agent = session(serverTest)
import {describe,it, expect} from 'vitest'

describe('"Validator" class:', () => {
  describe('Method "ValidateBody". Validation and typing - Simple Object', () => {
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
  describe('Method "ValidateBody". Validation and typing - Nested Object', () => {
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
  describe('Method "ValidateBody". Validation and typing - Double Nested Object', () => {
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
    it('should throw an error when body exceeds maximum depth.', async () => {
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
        .post('/test/body/depth/create')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe('Schema validation exceeded maximum depth at profile[0].age')
    })
  })
  describe('Method "ValidateBody". Sanitize and trim. Simple Object', () => {
        it('should sanitize and escape user input correctly', async () => {
      const data = { 
        name: '  name  ',
        active: 'true',
        metadata: ' <script>alert("XSS")</script> ',
        comment: ` backtick \` and "quotes" `,
        symbols: `slashes / \\ and greater >`,
        price: 2.0
      };

      const response = await agent
        .post('/test/body/sanitize')
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).toEqual({
        name: 'name',
        active: true,
        metadata: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;',
        comment: 'backtick &#96; and &quot;quotes&quot;',
        symbols: 'slashes &#x2F; &#x5C; and greater &gt;',
        price: 2.0
      });
    });
  })
})