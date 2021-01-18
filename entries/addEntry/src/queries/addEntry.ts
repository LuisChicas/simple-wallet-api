import { Pool, MysqlError, FieldInfo } from 'mysql';

interface Entry {
    CategoryId: number,
    Amount: number,
    Date: string
    CreatedAt: string,
}

export default (dbPool: Pool, entry: Entry): Promise<any> => new Promise((resolve, reject) => {
    const query = 
        `INSERT INTO 
        Entries (CategoryId, Amount, Date, CreatedAt) 
        VALUES (${entry.CategoryId}, ${entry.Amount}, '${entry.Date}', '${entry.CreatedAt}')`;

    dbPool.query(query, (error: MysqlError, results: any, fields: FieldInfo[]) => {
        if (error) {
            reject(error);
        } else {
            resolve(results);
        }
    });
});