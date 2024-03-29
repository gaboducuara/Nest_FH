"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiValidationSchema = void 0;
const Joi = require("joi");
exports.JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3004),
    DEFAULT_LIMIT: Joi.number().default(6),
});
//# sourceMappingURL=joi.validation.js.map