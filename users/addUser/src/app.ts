import dotenv from 'dotenv';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import addUser from './queries/addUser';
import addCategory from './queries/addCategory';

dotenv.config();

const mysql = require('mysql');
const dbPool = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_NAME
});

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestBody = JSON.parse(event.body);

    const newUser = {
        Guid: requestBody.guid,
        CreatedAt: new Date().toISOString().slice(0, 19)
    };
    
    let userId;

    try {
        userId = await addUser(dbPool, newUser);
        console.log(userId);
    } catch (error) {
        console.error(error);

        return new Promise((resolve, reject) => resolve({
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong."
            })
        }));
    }

    const othersCategory = {
        UserId: userId,
        Name: "Others",
        CreatedAt: new Date().toISOString().slice(0, 19)
    }

    try {
        await addCategory(dbPool, othersCategory);
    } catch (error) {
        console.error(error);

        return new Promise((resolve, reject) => resolve({
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong."
            })
        }));
    }

    return new Promise((resolve, reject) => resolve({
        statusCode: 200,
        body: JSON.stringify({
            message: "User added successfully."
        })
    }));
};

/*
exports.handler(require("../test/event.json"))
.then((data: any) => console.log(data))
.catch((data: any) => console.error(data))
.finally(() => process.exit());
*/