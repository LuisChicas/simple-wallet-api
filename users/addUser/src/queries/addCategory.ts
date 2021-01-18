import { Pool, MysqlError, FieldInfo } from 'mysql';

interface Category {
    UserId: number,
    Name: string,
    CreatedAt: string
}

export default (dbPool: Pool, category: Category): Promise<any> => new Promise((resolve, reject) => {
    const query = 
        `INSERT INTO 
        Categories (UserId, Name, CreatedAt) 
        VALUES ('${category.UserId}', '${category.Name}', '${category.CreatedAt}')`;

    dbPool.query(query, (error: MysqlError, results: any, fields: FieldInfo[]) => {
        if (error) {
            reject(error);
        } else {
            resolve(results);
        }
    });
});