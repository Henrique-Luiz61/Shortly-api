import { nanoid } from "nanoid";
import { findSessionByTokenDB } from "../repositories/users.repository.js";
import {
  createUrlsDB,
  findShortUrlIdDB,
  findUrlsByIdDB,
  verificUrlUserDB,
  deleteUrlsByIdDB,
} from "../repositories/urls.repository.js";

export async function postUrls(req, res) {
  const { url } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const shortUrl = nanoid(8);

  if (!token)
    return res.status(401).send({ message: "User not found. Log-in!" });

  try {
    const session = await findSessionByTokenDB(token);

    if (session.rowCount === 0)
      return res
        .status(401)
        .send({ message: "Session expired. Log-in again!" });

    await createUrlsDB(session.rows[0].userId, shortUrl, url);

    const shortUrlId = await findShortUrlIdDB(shortUrl);

    res.status(201).send({ id: shortUrlId.rows[0].id, shortUrl });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlsById(req, res) {
  const { id } = req.params;

  try {
    const urls = await findUrlsByIdDB(id);

    if (urls.rowCount === 0)
      return res.status(404).send({ message: "Links not found!" });

    delete urls.rows[0].userId;
    delete urls.rows[0].visitCount;
    delete urls.rows[0].createdAt;

    res.status(200).send(urls.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteUrls(req, res) {
  const { id } = req.params;
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

    const links = await verificUrlUserDB(id, session.rows[0].userId);

    if (links.rowCount > 0)
      return res
        .status(401)
        .send({ message: "Links does not belong to this user!" });

    const linksToDelete = await findUrlsByIdDB(id);

    if (linksToDelete.rowCount === 0)
      return res.status(404).send({ message: "Links not found!" });

    await deleteUrlsByIdDB(id);

    res.status(204).send({ message: "Links deleted successfully!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
