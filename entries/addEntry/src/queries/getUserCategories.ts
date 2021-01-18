import { Pool, MysqlError, FieldInfo } from 'mysql';

interface Category {
    Id: number,
    UserId: number,
    Name: string,
    CreatedAt: string,
    DeletedAt: string
}

export default (dbPool: Pool, userId: number): Promise<Category[]> => new Promise((resolve, reject) => {
    dbPool.query(
        `SELECT * FROM Categories WHERE UserId=${userId}`, 
        (error: MysqlError, results: any, fields: FieldInfo[]) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
});