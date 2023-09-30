import { db } from "../database/db.connection.js";

export function createUrlsDB(userId, shortUrl, url) {
  return db.query(
    `INSERT INTO urls ("userId", "shortUrl", url) 
        VALUES ($1, $2, $3);`,
    [userId, shortUrl, url]
  );
}

export function findShortUrlDB(shortUrl) {
  return db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`, [shortUrl]);
}

export function findUrlsByIdDB(id) {
  return db.query(`SELECT * FROM urls WHERE id = $1;`, [id]);
}

export function verificUrlUserDB(id, userId) {
  return db.query(`SELECT * FROM urls WHERE id = $1 AND "userId" <> $2;`, [
    id,
    userId,
  ]);
}

export function deleteUrlsByIdDB(id) {
  return db.query(`DELETE FROM urls WHERE id = $1;`, [id]);
}

export function updateVisitCountDB(visitCount, shortUrl) {
  return db.query(`UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2;`, [
    visitCount + 1,
    shortUrl,
  ]);
}
