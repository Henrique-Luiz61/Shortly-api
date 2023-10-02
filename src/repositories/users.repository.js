import { db } from "../database/db.connection.js";

export function findEmailConflictDB(email) {
  return db.query(`SELECT email FROM users WHERE email = $1;`, [email]);
}

export function createUserDB(name, email, hash) {
  return db.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
    [name, email, hash]
  );
}

export function findUserByEmailDB(email) {
  return db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
}

export function createSessionDB(userId, userName, token) {
  return db.query(
    `INSERT INTO sessions ("userId", "userName", token) 
            VALUES ($1, $2, $3);`,
    [userId, userName, token]
  );
}

export function findSessionByTokenDB(token) {
  return db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
}

export function findUserInfoDB(id) {
  return db.query(
    `
    SELECT users.id, users.name, SUM(urls."visitCount") AS "visitCount",
      JSON_AGG(JSON_BUILD_OBJECT('id', urls.id, 'shortUrl', urls."shortUrl", 
                            'url', urls.url, 'visitCount', urls."visitCount")
      ) AS "shortenedUrls"
    FROM users
    JOIN urls ON urls."userId" = users.id
    WHERE users.id = $1
    GROUP BY users.id;`,
    [id]
  );
}

export function findRankingDB() {
  return db.query(
    `SELECT users.id, users.name, COUNT(urls."shortUrl") 
	      AS "linksCount", SUM(urls."visitCount") AS "visitCount"
	    FROM users
	    JOIN urls ON urls."userId" = users.id
	    WHERE users.id = urls."userId"
	    GROUP BY users.id
	    ORDER BY "visitCount" DESC
	    LIMIT 10;`
  );
}
