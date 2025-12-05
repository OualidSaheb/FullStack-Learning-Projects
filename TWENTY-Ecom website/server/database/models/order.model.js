import mongoose from "mongoose";


const orderSchema = mongoose.Schema(
    {
        email: { type: String },
        name: { type: String },
        address: { type: String },
        lines: { type: Array },
        subtotal: { type: Number },
        gst: { type: Number },
        qst: { type: Number },
        total: { type: Number },

        paymentMethod: {},
    },
    { timestamps: true }
);

export default mongoose.model("order", orderSchema);
