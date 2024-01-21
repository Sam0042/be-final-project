import { check,validationResult } from "express-validator";

const isTextOnly = (value) => {
    // Using regex to check if the string contains only letters
    const regex = /^[a-zA-Z ]+$/;
    return regex.test(value);
  };

const validStatusValue = (value) => {
    return value == "Sembuh" || value == "Positif" || value == "Meninggal"
}

const rules = [
    check("phone")
        .notEmpty().withMessage("Phone is required")
        .isNumeric().withMessage("Phone must be number")
        .isString().withMessage("Phone must be string")
        .isLength({min:11}).withMessage("Phone number minimum 11 digit")
        .isLength({max:12}).withMessage("Phone number maximum 12 digit")
        ,
    check("name")
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be string")
        .custom(isTextOnly).withMessage("Name must be letter")
        ,
    check("status")
        .notEmpty().withMessage("Status is required")
        .isString().withMessage("Status must be string")
        .custom(isTextOnly).withMessage("Status must be letter")
        .custom(validStatusValue).withMessage("Status must be positif, sembuh, or meninggal") 
        ,
    check("address")
        .notEmpty().withMessage("Address is required")
        .isString().withMessage("Address must be string")
        ,
    check("in_date_at")
        .notEmpty().withMessage("in_date_at is required")
        .isDate().withMessage("in_date_at must be date (ex: 2002-12-01 (Y-m-d))")
        ,
    check("out_date_at")
        .notEmpty().withMessage("out_date_at wajib diisi!")
        .isDate().withMessage("out_date_at must be date (ex: 2002-12-01 (Y-m-d))")
        ,
    
]

const validateTodo =[
    rules,
    (req,res,next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()})
        }
        next();
    }
]

export default validateTodo