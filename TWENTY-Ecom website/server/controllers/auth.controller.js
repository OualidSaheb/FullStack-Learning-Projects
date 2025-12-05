import jwt from "jsonwebtoken";
import { findUserByEmail } from "../queries/users.queries.js";
import { privateKey } from "../environment/keys/index.js";

// si non, retourner erreur.  si oui, verifier le mot de passe (comparte)
// si mdp ok, on cree le token
export const sessionCreate = async (req, res, next) => {
  try {
    console.log("Recu de req.body = ", req.body);
    const user = await findUserByEmail(req.body.email);
    if (user) {
      const match = user.comparePassword(req.body.password);
      if (match) {

        const token = jwt.sign({}, privateKey, {
          subject: user._id.toString(),
          expiresIn: 60 * 60 * 24 * 30,
          algorithm: "RS256",
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 24 * 60 * 60 * 1000,
        });
        console.log('Session created !');
        res.json(user);
      } else {
        res.json({ error: "Bad password" });
      }
    } else {
      res.json({ error: "Bad username" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }

};

export const sessionDelete = (req, res, next) => {
  try {
    res.clearCookie("token");
    console.log("Session deleted");
    res.end();
  } catch (error) {
    res.json({ error: error.message });
  }
};
