export default interface ConnectionDatabase {
    query (statement: string, params: any): Promise<any>
    one (statement: string, params: any): Promise<any>
    close (): Promise<void>
}