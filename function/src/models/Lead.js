import mongoose from "mongoose";
import validator from 'validator';

// Define your supported cities here to keep the schema clean
const supportedCities = ['Mumbai', 'Pune', 'Nashik', 'Thane', 'Raigad'];

const leadSchema = new mongoose.Schema(
    {
        firstName: {
            type: String, 
            required: [true, "First name is mandatory field"], 
            minLength: 3, 
            maxLength: 15
        },
        lastName: {
            type: String, 
            required: [true, "Last name is mandatory field"], 
            minLength: 3, 
            maxLength: 15
        },
        phone: {
            type: Number, 
            required: [true, "phone number is mandatory field"], 
            validate(value){
                if(value.toString().length !== 10){
                    throw new Error("phone number should be 10 digits");
                }
            }
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid email");
                }
            }
        },
        pickUp: {
            type: String,
            required: true,
            trim: true,
            enum: {
                values: supportedCities,
                message: '{VALUE} is not a supported city. We currently only serve Mumbai, Pune, Nashik, Thane, and Raigad.'
            }
        },
        dropOff: {
            type: String,
            required: true,
            trim: true,
            enum: {
                values: supportedCities,
                message: '{VALUE} is not a supported city. We currently only serve Mumbai, Pune, Nashik, Thane, and Raigad.'
            }
        },
        propertyType: {
            type: String,
            enum: ['Domestic', 'Commercial'],
            required: true,
        },
        distanceCategory: {
            type: String,
            enum: ['Short', 'Long'],
            required: true,
        },
        movingDate: {
            type: Date,
            required: true,
        },
        movingSize: {
            type: String,
            enum: ['Small', 'Medium', 'Large'],
            required: true,
        },
        additionalInformation: {
            type: String,
            trim: true,
            default: ""
        },   
        status: {
            type: String,
            enum: ['Pending', 'Verified', 'Fake', 'Duplicate', 'Re-attempt', 'Matched'],
            default: 'Pending',
        },
        lead_score: {
            type: Number,
            default: 0,
            min: 0, 
            max: 100
        },
        lead_quality: {
            type: String,
            enum: ['Hot', 'Warm', 'Cold']
        },

    }, { timestamps: true }
)

const Lead = mongoose.model('Lead', leadSchema);
export { Lead };