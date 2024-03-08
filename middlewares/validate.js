const Joi = require('joi');

const createAccountValidation = (data)=>{
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        password: Joi.string().required().min(6),
        email: Joi.string().required().email(),
    })

    return schema.validate(data)
}


const loginValidation = (data)=>{
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    })

    return schema.validate(data)
}
const produtValidation = (data)=>{
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
    })

    return schema.validate(data)
}
const imageValidation = (data)=>{
    const schema = Joi.object({
        image: Joi.any().required()
    })

    return schema.validate(data)
}


module.exports.createAccountValidation = createAccountValidation
module.exports.loginValidation = loginValidation
module.exports.produtValidation = produtValidation
module.exports.imageValidation = imageValidation