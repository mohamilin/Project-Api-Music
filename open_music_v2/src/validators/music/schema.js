const Joi = require('joi')

/**
 * 
title : string, required.
year : number, required.
performer : string, required.
genre : string.
duration: number
 */
const musicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number(),
})

module.exports = { musicPayloadSchema }
