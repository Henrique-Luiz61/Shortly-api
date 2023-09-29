import { db } from "../database/db.connection.js";

export function createUrlsDB(userId, shortUrl, url) {
  return db.query(
    `INSERT INTO urls ("userId", "shortUrl", url) 
        VALUES ($1, $2, $3);`,
    [userId, shortUrl, url]
  );
}

export function findShortUrlIdDB(shortUrl) {
  return db.query(`SELECT id FROM urls WHERE "shortUrl" = $1;`, [shortUrl]);
}

export function findUrlsByIdDB(id) {
  return db.query(`SELECT id, "shortUrl", url FROM urls WHERE id = $1;`, [id]);
}
