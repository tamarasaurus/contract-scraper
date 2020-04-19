import joi from 'joi';

const buildSchema = (allowedTypes) => {
  return joi.object({
    itemSelector: joi.string(),
    scriptTagSelector: joi.string(),
    attributes: joi
      .object({
        a: joi.string(),
      })
      .pattern(
        /^/,
        joi.object({
          type: joi.string().valid(...allowedTypes).when('itemSelector', {
            is: joi.exist(),
            then: joi.forbidden()
          }).optional(),
          raw: joi.boolean(),
          selector: joi.string(),
          attribute: joi.string(),
          data: joi.object({
            name: joi.string(),
            key: joi.string(),
          }),
          itemSelector: joi.string(),
          attributes: joi
            .object({
              a: joi.string(),
            })
            .pattern(
              /^/,
              joi.object({
                type: joi.string().default('text'),
                selector: joi.string(),
                attribute: joi.string(),
                data: joi.object({
                  name: joi.string(),
                  key: joi.string(),
                }),
                // itemSelector: joi.string(),
              }),
            ).when('itemSelector', {
              is: joi.exist(),
              then: joi.required(),
            }),
        }),
      ).required(),
  });
}

export default buildSchema