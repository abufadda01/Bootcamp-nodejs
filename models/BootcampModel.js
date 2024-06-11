const mongoose = require('mongoose');
const slugify = require("slugify")
const geocoder = require("../utils/geoCoder");
const Course = require('./courseModel');



const BootcampSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
      },
      slug: String,
      description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
      },
      website: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          'Please use a valid URL with HTTP or HTTPS'
        ]
      },
      phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
      },
      email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      address: {
        type: String,
        required: [true, 'Please add an address']
      },
      location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
      careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
          'Web Development',
          'Mobile Development',
          'UI/UX',
          'Data Science',
          'Business',
          'Other'
        ]
      },
      averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
      },
      averageCost: Number,
      photo: {
        type: String,
        default: 'no-photo.jpg'
      },
      housing: {
        type: Boolean,
        default: false
      },
      jobAssistance: {
        type: Boolean,
        default: false
      },
      jobGuarantee: {
        type: Boolean,
        default: false
      },
      acceptGi: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      }
    },
    {
     toJSON : {virtuals : true} ,
     toObject : {virtuals : true} 
    }
  );
  
   

  // mongoose hook middleware
  
  // update the slug key value before saving the new schema  
  BootcampSchema.pre("save" , function(next){
    this.slug = slugify(this.name , {lower : true})
    next()
  })


  // Geocode , create location field
  BootcampSchema.pre("save" , async function(next){
    
    const loc = await geocoder.geocode(this.address)
    
    this.location = {
      type : "Point" ,
      coordinates : [loc[0].longitude , loc[0].latitude] ,
      formattedAddress : loc[0].formattedAddress ,
      street : loc[0].streetName ,
      city : loc[0].city ,
      state : loc[0].stateCode ,
      zipcode : loc[0].zipcode ,
      country : loc[0].countryCode ,
    }
    
    this.address = undefined
     
    next()

  }) 



  // virtuals 
  // means document keys that you can create and get but dont exist in the real schema definition 
  // useful with populate , reversed populate
  BootcampSchema.virtual("courses" , {
    ref : "courses" , // ref to the collection that we want to create a virtual from it
    localField : "_id" , // the key that we will use from the current collection in the virtual (_id from bootcamp schema)
    foreignField : "bootcamp" , // the key that we will use from the ref collection in the virtual (bootcamp from courses schema)
    justOne : false // to return an array not only one value
  })




  const Bootcamp = mongoose.model("bootcamps" , BootcampSchema)



  module.exports = Bootcamp