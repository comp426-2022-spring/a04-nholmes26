"use strict";

import database from 'better-sqlite3';

const db = new database('log.db')

const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`)

let row = stmt.get();

if (row === undefined) {
    console.log('Log database appears to be empty. Creating log database...')

    const sqlInit = `
        CREATE TABLE accesslog ( 
            id INTEGER PRIMARY KEY, 
            remote_addr VARCHAR, 
            remote_user VARCHAR, 
            date VARCHAR, 
            method VARCHAR, 
            url VARCHAR, 
            http_version NUMERIC, 
            status INTEGER, 
            content_length NUMERIC,
            referrer_url VARCHAR,
            user_agent VARCHAR
        );
    `

    db.exec(sqlInit)
} else {
    console.log('Log database exists.')
}

export default db;