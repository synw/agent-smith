import { Connection, Table } from "@lancedb/lancedb";
import { SmemNode } from "./smeminterfaces.js";

const useSnode = (
    db: Connection,
    table: Table,
    vectorSourceCol: string,
    vector: (text: string) => Promise<Array<number>>,
    isVerbose: boolean,
): SmemNode => {

    const open = async (): Promise<Table> => {
        _assertDbIsConnected("Open table");
        table = await db.openTable(table.name);
        return table
    }

    const addRaw = async (data: Array<Record<string, unknown>>) => {
        if (isVerbose) {
            console.log(`Adding ${data.length} raw datapoints`)
        }
        // auto open
        if (!table) {
            await open();
        }
        await table.add(data)
    }

    const add = async (data: Array<Record<string, unknown>>) => {
        if (isVerbose) {
            console.log(`Adding ${data.length} datapoints`)
        }
        // auto open
        if (!table) {
            await open();
        }
        const vectorData: Array<Record<string, unknown>> = [];
        data.forEach(async (row) => vectorData.push({
            ...row,
            vector: await vector(`${row[vectorSourceCol]}`)
        }));
        await table.add(vectorData)
    }

    const upsertRaw = async (data: Array<Record<string, unknown>>, idCol = "id") => {
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

    const upsert = async (data: Array<Record<string, unknown>>, idCol = "id") => {
        if (isVerbose) {
            console.log(`Upserting ${data.length} datapoints`)
        }
        // auto open
        if (!table) {
            table = await open();
        }
        const vectorData: Array<Record<string, unknown>> = [];
        data.forEach(async (row) => vectorData.push({
            ...row,
            vector: await vector(`${row[vectorSourceCol]}`)
        }));
        await table
            .mergeInsert(idCol)
            .whenMatchedUpdateAll()
            .whenNotMatchedInsertAll()
            .execute(vectorData);
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
        upsertRaw,
    }
}

export { useSnode }