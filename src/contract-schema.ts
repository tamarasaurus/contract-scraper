import joi from '@hapi/joi';

const buildSchema = allowedTypes => {
  return joi.object({
    itemSelector: joi.string(),
    waitForPageLoadSelector: joi.string(),
    headless: joi.boolean().default(true),
    puppeteer: joi.boolean().default(true),
    scriptTagSelector: joi.string(),
    attributes: joi
      .object({
        a: joi.string(),
      })
      .pattern(
        /^/,
        joi.object({
          type: joi
            .string()
            .valid(...allowedTypes)
            .when('itemSelector', {
              is: joi.exist(),
              then: joi.forbidden(),
            })
            .optional(),
          raw: joi.boolean(),
          selector: joi.string().optional().allow(''),
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
                selector: joi.string().optional().allow(''),
                attribute: joi.string(),
                data: joi.object({
                  name: joi.string(),
                  key: joi.string(),
                }),
              }),
            )
            .when('itemSelector', {
              is: joi.exist(),
              then: joi.required(),
            }),
        }),
      )
      .required(),
  });
};

export default buildSchema;
