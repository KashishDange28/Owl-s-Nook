import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
          validator: function(value) {
            return /^\S+@\S+\.\S+$/.test(value);
          },
          message: 'Please enter a valid email address'
        }
    },
    password: {   
        type: String, 
        required: true,
        minlength: 6
    },
    profileImage: {
        type: String,
        default: 'https://api.dicebear.com/6.x/avataaars/svg?seed=profile'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
//hash
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // ✅ fixed
};

const User = mongoose.model("User", userSchema);
export default User;