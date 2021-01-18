import { Pool, MysqlError, FieldInfo } from 'mysql';

export interface Category {
    Id: number,
    UserId: number,
    Name: string,
    CreatedAt: string
}

export default (dbPool: Pool, userId: number): Promise<Category[]> => new Promise((resolve, reject) => {
    const query = 
        `SELECT * 
        FROM Categories 
        WHERE UserId = ${userId} and DeletedAt is null`;

    dbPool.query(query, (error: MysqlError, results: any, fields: FieldInfo[]) => {
        if (error) {
            reject(error);
        } else {
            resolve(results);
        }
    });
});