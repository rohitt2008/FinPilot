import Joi from "joi";

export const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required(),
  description: Joi.string().allow("", null),
});