import session from 'supertest'
import serverTest from './testHelpers/serverTest.help.ts'
const agent = session(serverTest)
import {describe,it, expect} from 'vitest'

describe('"Validator" class:', () => {
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
  describe('Method "validateQuery". Query validation and typing and verify complex query fields', () => {
    it('should validate, and allow passing if all parameters are correct.', async () => {
      const response = await agent
        .get('/test/param/queries?page=2&limit=2&searchField=message&search=This is the message&sortBy=time&order=ASC')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({
        page: 2,
        limit: 2,
        searchField: 'message',
        search: 'This is the message',
        sortBy: 'time',
        order: 'ASC'
      })
    })
    it('should validate, and allow passing if some parameters are missing.', async () => {
      const response = await agent
        .get('/test/param/queries?page=2&limit=2&sortBy=time&order=ASC')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({
        page: 2,
        limit: 2,
        searchField: 'levelName',
        search: '',
        sortBy: 'time',
        order: 'ASC'
      })
    })
    it('should throw an error if parameter are not correct.', async () => {
      const response = await agent //searchField=name
        .get('/test/param/queries?page=2&limit=2&searchField=name&search=This is the message&sortBy=time&order=ASC')
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBe("Invalid value for 'searchField'. Received: 'name'. Allowed: levelName, message, status")
    })
    it('should reject array values for a rule field (400).', async () => {
      const response = await agent
        .get('/test/param/queries?page=2&limit=2&searchField=message&searchField=levelName&sortBy=time&order=ASC')
        .expect('Content-Type', /json/)
        .expect(400)
      // Could be invalid string value from type validation or rule rejection; assert status only
      expect(response.body).toBeDefined()
    })
  })

  describe('Method "validateQuery". Rules numeric/boolean edge cases', () => {
    it('should accept numeric value if it is in allowed list.', async () => {
      const response = await agent
        .get('/test/param/rules-num?level=2')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({ level: 2 })
    })
    it('should reject array for numeric field (400).', async () => {
      const response = await agent
        .get('/test/param/rules-num?level=1&level=2')
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBeDefined()
    })
    it('should accept boolean allowed value.', async () => {
      const response = await agent
        .get('/test/param/rules-bool?flag=true')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body.message).toBe('Passed middleware')
      expect(response.body.validData).toEqual({ flag: true })
    })
    it('should reject disallowed boolean value (400).', async () => {
      const response = await agent
        .get('/test/param/rules-bool?flag=false')
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBeDefined()
    })
    it('should reject empty boolean value (400).', async () => {
      const response = await agent
        .get('/test/param/rules-bool?flag=')
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toBeDefined()
    })
  })
})