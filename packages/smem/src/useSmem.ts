import { Connection, connect, Table } from "@lancedb/lancedb";
import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import { Schema, Field, Float64, Int32, Utf8, FixedSizeList, Bool } from "apache-arrow";
import { useSnode } from "./useSnode.js";
import { SmemNodeSchema, SmemNode, Smem } from "./smeminterfaces.js";

const useSmem = (isVerbose = false): Smem => {
    const tables: Record<string, SmemNode> = {};

    let pipe: typeof FeatureExtractionPipeline;
    let db: Connection;

    const embed: (data: unknown[]) => Promise<number[][]> = async (batch) => {
        //console.log("BATCH", batch);
        const result: Array<Array<number>> = [];
        for (const text of batch) {
            //console.log("EMB", text)
            const res = await pipe(`${text}`, { pooling: 'mean', normalize: true })
            result.push(Array.from(res['data']))
        }
        return (result)
    }

    const init = async (dbpath: string): Promise<Connection> => {
        if (isVerbose) {
            console.log("Initializing db", dbpath);
        }
        pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        if (isVerbose) {
            console.log("Feature extraction pipeline ready");
        }
        db = await connect(dbpath);
        if (isVerbose) {
            console.log("Database ready");
        }
        return db
    }

    const nodeFromSchema = async <T extends Record<string, any> = Record<string, any>>(
        name: string,
        schema: Schema,
        vectorSourceCol: string
    ): Promise<SmemNode<T>> => {
        return await _initNode(name, vectorSourceCol, schema)
    }

    const nodeFromData = async <T extends Record<string, any> = Record<string, any>>(
        name: string,
        data: Array<Record<string, unknown>>,
        vectorSourceCol: string,
    ): Promise<SmemNode<T>> => {
        return await _initNode<T>(name, vectorSourceCol, undefined, data)
    }

    const node = async <T extends Record<string, any> = Record<string, any>>(
        name: string,
        schema: SmemNodeSchema,
        vectorSourceCol: string
    ): Promise<SmemNode<T>> => {
        return await _initNode<T>(name, vectorSourceCol, _createSchema(schema))
    }

    const nodeNames = async () => {
        _assertDbIsConnected("Create table");
        return db.tableNames()
    }

    const openTable = async (name: string): Promise<Table> => {
        _assertDbIsConnected("Open table");
        return await db.openTable(name);
    }

    const vector = async (text: string): Promise<Array<number>> => (await embed([text]))[0];

    const _initNode = async <T extends Record<string, any> = Record<string, any>>(
        name: string,
        vectorSourceCol: string,
        schema?: Schema,
        data?: Array<Record<string, unknown>>,
    ): Promise<SmemNode<T>> => {
        _assertDbIsConnected("Init node");
        if (isVerbose) {
            console.log("Initializing node", name);
        }
        const tn = await db.tableNames();
        if (tn.includes(name)) {
            if (isVerbose) {
                console.log("Opening node")
            }
            const tbl = await db.openTable(name);
            const t = useSnode<T>(db, tbl, vectorSourceCol, vector, isVerbose);
            tables[tbl.name] = t as SmemNode;
            return t
        }
        let tbl: Table;
        if (isVerbose) {
            console.log("Creating node")
        }
        if (schema) {
            tbl = await db.createEmptyTable(name, schema);
        } else if (data) {
            tbl = await db.createTable({ name: name, data: data });
        } else {
            throw new Error("Provide a schema or data to init a node")
        }

        const t = useSnode<T>(db, tbl, vectorSourceCol, vector, isVerbose);
        tables[name] = t as SmemNode;
        return t
    }


    function _createSchema(nodeSchema: SmemNodeSchema): Schema {
        const fields = new Array<Field>();
        nodeSchema.forEach((f) => {
            switch (f.type) {
                case "string":
                    fields.push(new Field(f.name, new Utf8(), f.nullable ?? false))
                    break;
                case "int":
                    fields.push(new Field(f.name, new Int32(), f.nullable ?? false))
                    break;
                case "float":
                    fields.push(new Field(f.name, new Float64(), f.nullable ?? false))
                    break;
                case "boolean":
                    fields.push(new Field(f.name, new Bool(), f.nullable ?? false))
                    break;
            };
        });
        fields.push(new Field(
            "vector",
            new FixedSizeList(384, new Field("value", new Float64())),
            false
        ));
        return new Schema(fields)
    }

    function _assertDbIsConnected(from: string, value: Connection = db): asserts value is NonNullable<Connection> {
        if (value === undefined || value === null) {
            throw new Error(`${from}: the database is not initialized`)
        }
    }

    return {
        get nodes() {
            return tables
        },
        init,
        node,
        nodeNames,
        nodeFromSchema,
        nodeFromData,
        openTable,
        vector,
        embed,
    }
}

export { useSmem }
