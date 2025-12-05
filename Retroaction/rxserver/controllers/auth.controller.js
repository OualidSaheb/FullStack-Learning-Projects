import { sessionCreateQuery, updateUserPasswordQuery/*, checkEmailQuery*/ } from "../database/queries/auth.queries.js";
import { findUserByEmailQuery } from "../database/queries/users.queries.js";
import { sendUpdatePasswordMessages, sendResetPasswordMessage} from "../utils/mailer.js";

export const sessionCreate = async (req, res, next) => {
  try {
    const { user, token } = await sessionCreateQuery(req.body);
    res.status(200).json({ result: { token, user: user } });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const user = await updateUserPasswordQuery(req.body);
    res.status(200).json({ result: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Send email to update password for a group or a single user
 * @param {UserFormInterface[]} req 
 * @param {*} res 
 */
export const sendEmailToUpdatePassword = async (req, res) => {
  try {
    const users = req.body.data;
    sendUpdatePasswordMessages(users);
    res.status(200).json({ result: 'Courriels envoyés avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendEmailToResetPassword = async (req, res) => {
  try {
    const email = req.body.data;
    user= await findUserByEmailQuery(email);
    sendResetPasswordMessage(user);
    res.status(200).json({ result: 'Courriel envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};
