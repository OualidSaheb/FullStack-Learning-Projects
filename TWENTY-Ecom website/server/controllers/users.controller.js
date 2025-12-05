import { createUser, findUserByEmail, findUserByID, deleteUserByEmail } from "../queries/users.queries.js";
import { getUserOrders as getUserOrdersQuery } from "../queries/order.queries.js";
import { privateKey } from "../environment/keys/index.js";
import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";
import Order from "../database/models/order.model.js";

export const signup = async (req, res, next) => {
    console.log("signup");
    try {
        const user = await createUser(req.body);
        res.json(user);
    } catch (err) {
        res.json({ error: err.message });
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const user = await deleteUserByEmail(req.body.email);
        res.json({ message: `User ${user.name} deleted` });
    } catch (error) {
        res.json({ error: error.message });
    }
};

export const fetchCurrentUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        //console.log(token);
        if (token) {
            jwt.verify(token, privateKey, async (error, decoded) => {
                if (!error) {
                    const user = await findUserByID(decoded.sub);
                    if (user) {
                        console.log("Fetched User", user.name);
                        res.json(user);
                        return;
                    }
                } else {
                    res.clearCookie("token");
                    res.json(null);
                }
            });
        } else {
            res.json(null);
        }
    } catch (error) {
        console.log(error);
        res.json({ error: error.message });
    }
};

export const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, privateKey, (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Assuming decoded.sub contains the user ID
        req.user = { userId: decoded.sub };
        next();
    });
};

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const updatedData = req.body;
        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (updatedData.name) {
            user.name = updatedData.name;
        }
        if (updatedData.email) {
            user.email = updatedData.email;
        }

        // Save the updated user document
        await user.save();
        console.log("User updated information successfully");
        res.json({ message: "User information updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addAddress = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        //console.log(token);
        if (token) {
            jwt.verify(token, privateKey, async (error, decoded) => {
                if (!error) {
                    const user = await findUserByID(decoded.sub);
                    if (user) {
                        const newAddress = req.body.address;
                        // try {
                        //     const user = await createUser(req.body);
                        //     res.json(user);
                        // } catch (err) {
                        //     res.json({ error: err.message });
                        // }
                        //console.log("Fetched User", user.name);
                        user.addresses.push(newAddress);
                        user.save();
                        res.json(user.addresses);
                        return;
                    }
                } else {
                    res.clearCookie("token");
                    res.json(null);
                }
            });
        } else {
            res.json(null);
        }
    } catch (error) {
        console.log(error);
        res.json({ error: error.message });
    }

    //res.send({ name: "Eric Lessard", local: { email: "monEmail@pasTesAffaires.com" } });
};

export const addOrder = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (token) {
            jwt.verify(token, privateKey, async (error, decoded) => {
                if (!error) {
                    const user = await findUserByID(decoded.sub);
                    if (user) {
                        //console.log(req.body);

                        const newOrder = new Order({
                            email: req.body.email,
                            name: req.body.name,
                            address: req.body.address,
                            lines: req.body.lines,
                            subtotal: req.body.subtotal,
                            gst: req.body.gst,
                            qst: req.body.qst,
                            total: req.body.total,

                            paymentMethod: req.body.paymentMethod,
                        });

                        newOrder
                            .save()
                            .then((order) => {
                                user.orders.push(order);
                                user.save();
                            })
                            .catch((err) => console.log(err));
                        //user.orders.push(newOrder);
                        //user.save();
                        res.json(user.orders);
                        return;
                    }
                } else {
                    res.clearCookie("token");
                    res.json(null);
                }
            });
        } else {
            console.log("1");
            const newOrder = new Order({
                email: req.body.email,
                name: req.body.name,
                address: req.body.address,
                lines: req.body.lines,
                subtotal: req.body.subtotal,
                gst: req.body.gst,
                qst: req.body.qst,
                total: req.body.total,

                paymentMethod: req.body.paymentMethod,
            });

            console.log(newOrder);
            newOrder.save().catch((err) => console.log(err));
            //res.json(user.orders);
            return;
            //res.json(null);
        }
    } catch (error) {
        console.log(error);
        res.json({ error: error.message });
    }

    //res.send({ name: "Eric Lessard", local: { email: "monEmail@pasTesAffaires.com" } });
};

export const delOrder = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        //console.log(token);
        if (token) {
            jwt.verify(token, privateKey, async (error, decoded) => {
                if (!error) {
                    const user = await findUserByID(decoded.sub);
                    if (user) {
                        user.orders = [];
                        user.save();
                        res.json(user.orders);
                        return;
                    }
                } else {
                    res.clearCookie("token");
                    res.json(null);
                }
            });
        } else {
            res.json(null);
        }
    } catch (error) {
        console.log(error);
        res.json({ error: error.message });
    }

    //res.send({ name: "Eric Lessard", local: { email: "monEmail@pasTesAffaires.com" } });
};

export const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const orders = await getUserOrdersQuery(userId);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
