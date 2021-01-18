import dotenv from 'dotenv';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import mapEntry from './entryMapper';
import getUser from './queries/getUser';
import getUserCategories from './queries/getUserCategories';
import addEntry from './queries/addEntry';

dotenv.config();

const mysql = require('mysql');
const dbPool = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_NAME
});

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const othersCategoryName = "Others";
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

    const entryMapResult = mapEntry(requestBody.entry);

    if (entryMapResult.error) {
        return new Promise((resolve, reject) => resolve({
            statusCode: 400,
            body: JSON.stringify({
                message: entryMapResult.error
            })
        }));
    }

    let categories;
    
    try {
        categories = await getUserCategories(dbPool, userId);
    } catch(error) {
        console.error(error);

        return new Promise((resolve, reject) => resolve({
            statusCode: 500,
            body: JSON.stringify({
                message: "Something went wrong."
            })
        }));
    }

    let category = categories.find((category) => category.Name.toLowerCase() === entryMapResult.keyword.toLowerCase());
    if (category === undefined) {
        category = categories.find((category) => category.Name === othersCategoryName);
    }

    const entryDate = new Date(requestBody.date).toISOString().slice(0, 19);
    const createdAt = new Date().toISOString().slice(0, 19);

    const entry = {
        Amount: entryMapResult.amount,
        CategoryId: category.Id,
        Date: entryDate,
        CreatedAt : createdAt
    };

    try {
        await addEntry(dbPool, entry);
    } catch(error) {
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
            message: "Entry added successfully."
        })
    }));
};

/*
exports.handler(require("../test/eventAPI.json"))
.then((data: any) => console.log(data))
.catch((data: any) => console.error(data))
.finally(() => process.exit());
*/