import { Pool, MysqlError, FieldInfo } from 'mysql';

interface User {
    Id: number
}

export default (dbPool: Pool, guid: string): Promise<User> => new Promise((resolve, reject) => {
    dbPool.query(
        `SELECT Id FROM Users WHERE Guid='${guid}'`, 
        (error: MysqlError, results: any, fields: FieldInfo[]) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
});