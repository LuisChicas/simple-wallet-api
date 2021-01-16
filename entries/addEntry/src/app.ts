import dotenv from 'dotenv';
import mapEntry from './entryMapper';

dotenv.config();

const mysql = require('mysql');
const dbPool = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_NAME
});

const handler = (event:any, callback:Function) => {
    const entry = "Bills $10.50";

    callback(mapEntry(entry));
};

handler({}, (data:any) => console.log(data));