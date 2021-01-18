import { Pool, MysqlError, FieldInfo } from 'mysql';

interface User {
    Guid: string
    CreatedAt: string,
}

export default (dbPool: Pool, user: User): Promise<number> => new Promise((resolve, reject) => {
    const query = 
        `INSERT INTO 
        Users (Guid, CreatedAt) 
        VALUES ('${user.Guid}', '${user.CreatedAt}')`;

    dbPool.query(query, (error: MysqlError, results: any, fields: FieldInfo[]) => {
        if (error) {
            reject(error);
        } else {
            resolve(results.insertId);
        }
    });
});