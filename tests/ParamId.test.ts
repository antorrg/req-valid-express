import session from 'supertest'
import serverTest from './testHelpers/serverTest.help.ts'
const agent = session(serverTest)
import {describe,it, expect} from 'vitest'

describe('"Validator" class:', () => {
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
