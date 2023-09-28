import { db } from "../database/db.connection.js";

export function createUrlsDB(userId, shortUrl, url) {
  const linksCount = 0;
  const visitCount = 0;

  return db.query(
    `INSERT INTO urls ("userId", "shortUrl", url, "linksCount", "visitCount") 
        VALUES ($1, $2, $3, $4, $5);`,
    [userId, shortUrl, url, linksCount, visitCount]
  );
}

export function findShortUrlIdDB(shortUrl) {
  return db.query(`SELECT id FROM urls WHERE "shortUrl" = $1;`, [shortUrl]);
}
