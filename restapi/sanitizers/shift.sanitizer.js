const objectCreator = (req) => {
    let obj = {}
    Object.entries(req.body).forEach(([key, value]) => {
        obj[key] = value
    })
    return obj
}

const Joi = require('@hapi/joi')


//STANDARD - TO BE CHANGED
const creationSchema = Joi.object({
    title: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    content: Joi.string()
        .required()
})


//END - TO BE CHANGED



function validCreation (req, res, next) {
    next()
    /*
    const value = creationSchema.validate(objectGenerator(req))

    if (value.error){
        console.log("value" + JSON.stringify(value))
        console.log("error!")
        res.status(400).send({"input error: " : value.error.message})
    }else{
        console.log(JSON.stringify(value))
        console.log("value" + JSON.stringify(value))
        next(value)
    }*/
}



function validUpdate(req, res, next) {
    validCreation(req, res,next)
}





module.exports = {validCreation, validUpdate}
