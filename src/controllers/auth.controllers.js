import {
  findEmailConflictDB,
  createUserDB,
  findUserByEmailDB,
  createSessionDB,
} from "../repositories/users.repository.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  try {
    const emailConflict = await findEmailConflictDB(email);

    if (emailConflict.rowCount > 0)
      return res.status(409).send({ message: "Email already registered!" });

    await createUserDB(name, email, hash);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmailDB(email);

    if (user.rowCount === 0)
      return res.status(401).send({ message: "Email not registered!" });

    const passwordCorrect = bcrypt.compareSync(password, user.rows[0].password);
    if (!passwordCorrect) return res.status(401).send("Incorrect password!");

    const token = uuid();

    const userId = user.rows[0].id;
    const userName = user.rows[0].name;

    await createSessionDB(userId, userName, token);

    res.status(200).send({ token: token });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
