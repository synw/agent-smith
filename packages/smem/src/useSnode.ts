import { Connection, Data, Table } from "@lancedb/lancedb";
import { SmemNode } from "./smeminterfaces.js";

const useSnode = <T extends Record<string, any> = Record<string, any>>(
    db: Connection,
    table: Table,
    vectorSourceCol: string,
    vector: (text: string) => Promise<Array<number>>,
    isVerbose: boolean,
): SmemNode<T> => {

    const open = async (): Promise<Table> => {
        _assertDbIsConnected("Open table");
        table = await db.openTable(table.name);
        return table
    }

    const addRaw = async (data: Array<T>) => {
        if (isVerbose) {
            console.log(`Adding ${data.length} raw datapoints`)
        }
        // auto open
        if (!table) {
            await open();
        }
        await table.add(data as Data)
    }

    const add = async (data: Array<T>) => {
        if (isVerbose) {
            console.log(`Adding ${data.length} datapoints`)
        }
        // auto open
        if (!table) {
            await open();
        }
        const vectorData: Array<T> = [];
        data.forEach(async (row) => vectorData.push({
            ...row,
            vector: await vector(`${row[vectorSourceCol]}`)
        }));
        await table.add(vectorData)
    }

    const upsertRaw = async (data: Array<T>, idCol = "id") => {
        if (isVerbose) {
            console.log(`Upserting ${data.length} raw datapoints`)
        }
        // auto open
        if (!table) {
            table = await open();
        }
        await table
            .mergeInsert(idCol)
            .whenMatchedUpdateAll()
            .whenNotMatchedInsertAll()
            .execute(data);
    }

    const upsert = async (data: Array<T>, idCol = "id", update = true) => {
        return await _ingest(data, idCol, "upsert")
    }

    const insertIfNotExists = async (data: Array<T>, idCol = "id") => {
        return await _ingest(data, idCol, "insert")
    }

    const _ingest = async (data: Array<T>, idCol: string, mode: "insert" | "update" | "upsert") => {
        if (isVerbose) {
            console.log(`Upserting ${data.length} datapoints`)
        }
        // auto open
        if (!table) {
            table = await open();
        }
        const vectorData: Array<T> = [];
        data.forEach(async (row) => vectorData.push({
            ...row,
            vector: await vector(`${row[vectorSourceCol]}`)
        }));
        switch (mode) {
            case "insert":
                await table
                    .mergeInsert(idCol)
                    .whenNotMatchedInsertAll()
                    .execute(vectorData);
                break;
            case "upsert":
                await table
                    .mergeInsert(idCol)
                    .whenMatchedUpdateAll()
                    .whenNotMatchedInsertAll()
                    .execute(vectorData);
            case "update":
                await table
                    .mergeInsert(idCol)
                    .whenMatchedUpdateAll()
                    .execute(vectorData);
        }
    }

    function _assertDbIsConnected(from: string, value: Connection = db): asserts value is NonNullable<Connection> {
        if (value === undefined || value === null) {
            throw new Error(`${from}: the database is not initialized`)
        }
    }

    return {
        table,
        vectorSourceCol,
        open,
        add,
        addRaw,
        upsert,
        insertIfNotExists,
        upsertRaw,
    }
}

export { useSnode }