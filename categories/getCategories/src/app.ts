import dotenv from 'dotenv';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import getUser from './queries/getUser';
import getUserCategories, { Category } from './queries/getUserCategories';

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

    let userId;

    try {
        const user = await getUser(dbPool, requestBody.guid);
        userId = user.Id;
    } catch (error) {
        console.error(error);

        return new Promise((resolve, reject) => resolve({
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong."
            })
        }));
    }

    let categories: Category[];

    try {
        categories = await getUserCategories(dbPool, userId);
        console.log(userId);
        console.log(categories);
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
            message: "User added successfully.",
            data: categories
        })
    }));
};

exports.handler(require("../test/event.json"))
.then((data: any) => console.log(data))
.catch((data: any) => console.error(data))
.finally(() => process.exit());
/*
*/