import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        addresses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address",
            },
        ],
        cards: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Card",
            },
        ],
        carts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Cart",
            },
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
    },
    { timestamps: true }
);

//Objectif: Obtenir une fonction statique pour hacher le mot de passe
userSchema.statics.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const start = Date.now();
        const hashedPassword = await bcrypt.hash(password, salt);
        const end = Date.now() - start;
        console.log(`Hashed password in ` + end.toLocaleString());
        return hashedPassword;
    } catch (error) {
        throw error;
    }
};

//Objectif: Pouvoir comparer le mot de passe haché du l'utilisateur en cours
//          avec le mot de passe non-haché fourni par le front-end
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
