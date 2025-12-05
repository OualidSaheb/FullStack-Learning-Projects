import User from "../database/models/user.model.js";

//Objectif: Récupérer les données de l'utilisateur par son ID
export const findUserByID = (id) => {
  return User.findById(id).select("-password");
};
export const deleteUserByEmail = (email) => {
  return User.findOneAndDelete({ email: email });
};

export const findUserByEmail = (email) => {
  return User.findOne({ email: email });
};

export const createUser = async (data) => {
  const user = await findUserByEmail(data.email);
  if (user) throw new Error("Courriel déjà utilisé");

  // rendu ici, on a un nouveau user en création.
  const hashedPassword = await User.hashPassword(data.password);
  const newUser = new User({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    addresses: [],
    cards: [],
  });
  return newUser.save();
};
