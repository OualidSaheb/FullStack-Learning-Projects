import { setResetPassTokenQuery, updateUserStateQuery } from "../database/queries/users.queries.js";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";

export const sendUpdatePasswordMessages = (users) => {
  users.forEach(async user => {
    if (!(user.state == 'active')) {
      await this.sendUpdatePasswordMessage(user);
      console.log("password update message sent to " + user.local.email);
    }
  });
};

export const sendUpdatePasswordMessage = async (user) => {

  const resetPassToken = uuidv4();
  const resetLink = `${process.env.SENDGRID_BASE_URL}updatePassword?token=${resetPassToken}&email=${user.local.email}`;
  const emailHtml = `
      <p>Bonjour ${user.firstName},</p>
      <p>Poursuivez votre inscription à RetroAction en cliquant sur ce bouton :</p>
      <a href="${resetLink}" style="background-color: #008CBA; color: white; padding: 12px 24px; text-align: center; 
      text-decoration: none; display: inline-block; border-radius: 4px;">
      S'inscrire à RetroAction
      </a>
      <p>Cordialement,</p>
      <p>L'équipe RetroAction</p>
      `;

  const msg = {
    to: user.local.email,
    from: process.env.SENDGRID_FROM_ADDRESS,
    subject: 'Initialisation de votre compte Retroaction',
    html: emailHtml,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg);

  await setResetPassToken(user._id, resetPassToken);
  await updateUserState(user._id, 'pending');
};

export const sendResetPasswordMessage = async (user) => {

  const resetPassToken = uuidv4();
  const resetLink = `${process.env.SENDGRID_BASE_URL}updatePassword?token=${resetPassToken}&email=${user.local.email}`;
  const emailHtml = `
      <p>Bonjour,</p>
      <p>Poursuivez votre changement de mot de passe à RetroAction en cliquant sur ce bouton :</p>
      <a href="${resetLink}" style="background-color: #008CBA; color: white; padding: 12px 24px; text-align: center; 
      text-decoration: none; display: inline-block; border-radius: 4px;">
      Changer de Mot de passe
      </a>
      <p>Cordialement,</p>
      <p>L'équipe RetroAction</p>
      `;

  const msg = {
    to: user.local.email,
    from: process.env.SENDGRID_FROM_ADDRESS,
    subject: 'Demande de changement de Mot de Passe',
    html: emailHtml,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg);

  await setResetPassToken(user._id, resetPassToken);
  
};