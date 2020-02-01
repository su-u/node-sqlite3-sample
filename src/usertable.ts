// @ts-ignore
// import sqlite3 from 'sqlite3';
const sqlite3 = require('sqlite3').verbose();


// ファイルに対応した、ただ１つのインスタンス
let database: any;

export class DBCommon {
  static init() {
    database = new sqlite3.Database(':memory:');
  }
  static get() {
    return database;
  }
}

export class User {
  public account: any;
  public name: any;
  public email: any;
  constructor(account: any, name: any, email: any) {
    this.account = account;
    this.name = name;
    this.email = email;
  }
}

export default class Table {
  private static _tabelName: string;
  static async createTableIfNotExists(tabelName: string) {
    Table._tabelName = tabelName;
    const db = DBCommon.get();
    return new Promise((resolve, reject) => {
      try {
        db.serialize(() => {
          db.run(`create table if not exists ${tabelName} (
            account text primary key,
            name text,
            email text
          )`);
        });
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }

  static async save(user: any) {
    const db = DBCommon.get();
    return new Promise((resolve, reject) => {
      try {
        db.run(
          `insert or replace into ${Table._tabelName} 
        (account, name, email) 
        values ($account, $name, $email)`,
          user.account,
          user.name,
          user.email
        );
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }

  static async count() {
    const db = DBCommon.get();
    return new Promise((resolve, reject) => {
      db.get(`select count(*) from ${Table._tabelName}`, (err: any, row: any) => {
        if (err) return reject(err);
        return resolve(row['count(*)']);
      });
    });
  }

  static async list(offset: number, limit: number) {
    const db = DBCommon.get();
    const result: any[] = [];
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(
          `select account, name, email from ${Table._tabelName}
        order by account limit ${limit} offset ${offset}`,
          (err: any, rows: any) => {
            if (err) return reject(err);
            rows.forEach((row: any) => {
              result.push(new User(row['account'], row['name'], row['email']));
            });
            return resolve(result);
          }
        );
      });
    });
  }

  static async delete(user: any) {
    const db = DBCommon.get();
    return new Promise((resolve, reject) => {
      try {
        db.run(
          `delete from ${Table._tabelName} where account = $account`,
          user.account
        );
        return resolve();
      } catch (err) {
        return reject(err);
      }
    });
  }
}
