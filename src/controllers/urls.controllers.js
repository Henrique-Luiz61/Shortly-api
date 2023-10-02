import { nanoid } from "nanoid";
import { findSessionByTokenDB } from "../repositories/users.repository.js";
import {
  createUrlsDB,
  findShortUrlDB,
  findUrlsByIdDB,
  verificUrlUserDB,
  deleteUrlsByIdDB,
  updateVisitCountDB,
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

    const shortUrlId = await findShortUrlDB(shortUrl);

    res.status(201).send({ id: shortUrlId.rows[0].id, shortUrl: shortUrl });
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

export async function getOpenShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const links = await findShortUrlDB(shortUrl);

    if (links.rowCount === 0)
      return res.status(404).send({ message: "ShortUrl not found!" });

    await updateVisitCountDB(links.rows[0].visitCount, shortUrl);

    res.redirect(`/urls/open/${links.rows[0].url}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
