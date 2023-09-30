import {
  findSessionByTokenDB,
  findUserInfoDB,
} from "../repositories/users.repository.js";

export async function getUsers(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token)
    return res.status(401).send({ message: "User not found. Log-in!" });

  try {
    const session = await findSessionByTokenDB(token);

    if (session.rowCount === 0)
      return res
        .status(401)
        .send({ message: "Session expired. Log-in again!" });

    const userInfo = await findUserInfoDB(session.rows[0].userId);

    res.status(200).send(userInfo.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getRanking(req, res) {
  try {
  } catch (err) {
    res.status(500).send(err.message);
  }
}
