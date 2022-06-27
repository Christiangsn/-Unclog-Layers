import pgp, { IDatabase } from 'pg-promise'
import pg from 'pg-promise/typescript/pg-subset';

import ConnectionDatabase from "./Connection";

export class PostGresSQLDBAdapter implements ConnectionDatabase {
    connection: pgp.IDatabase<{}, pg.IClient>

    constructor ( ) { 
        this.connection = pgp()('postgres://postgres:123456@localhost:5432/app')
    }

    query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params)
    }

    one(statement: string, params: any): Promise<any> {
        return this.connection.one(statement, params)
    }
    
    close(): Promise<void> {
        return this.connection.$pool.end()
    }

}