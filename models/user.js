const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password can not contain password');
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.statics.findbyCredential = async (email,password)=>{
    const user = await UserModel.findOne({ email })

    // console.log(user);

    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);

    // const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}

UserSchema.methods.generateAuthToken = async function(){
    const user = this;


    const token = jwt.sign({ _id : user._id.toString() },'SecrateKey')

    return token;
}

UserSchema.methods.toJSON = function(){
    const user = this;
    const UserObject = user.toObject();

    delete UserObject.password;
    delete UserObject.tokens;

    return UserObject;
}

UserSchema.virtual('products',{
    ref:'Product',
    localField: '_id',
    foreignField : 'owner',
})

// save middleware
UserSchema.pre('save', async function(next){
    const user = this;

    // console.log('Just before posting');
    // console.log(user);

    if(user.isModified('password')){
        // console.log(user.password);
        user.password = await bcrypt.hash(user.password , 8);
        // console.log(user.password);
    }

    next() // it's hange that code is still running and never save the user if next  isn't used.
}) //binding is importent but in this arrow function don't bind this.

// Delete user tasks when user is removed
// UserSchema.pre('deleteOne'  , async function (next) {
//     // console.log(this._conditions._id);
//     const owner = this.getFilter()["_id"];
//     // console.log("line 109 "+ user);
//     await Task.deleteMany({ owner })
//     next()
// });

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel ;