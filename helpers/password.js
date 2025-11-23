import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  // Compatibilidad con hashes generados en PHP
  const normalizedHash = hashedPassword.replace(/^\$2y\$/, "$2a$");
  return await bcrypt.compare(password, normalizedHash);
};
