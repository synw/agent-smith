import { Connection, Table } from "@lancedb/lancedb";
import { Schema } from "apache-arrow";

interface SmemNodeFieldSchema {
    name: string;
    type: FieldDataType,
    nullable?: boolean;
}

interface SmemNode<T extends Record<string, any> = Record<string, any>> {
    table: Table;
    vectorSourceCol: string;
    open: () => Promise<Table>;
    add: (data: Array<T>) => Promise<void>;
    addRaw: (data: Array<T>) => Promise<void>;
    upsert: (data: Array<T>, idCol?: string) => Promise<void>;
    insertIfNotExists: (data: Array<T>, idCol?: string) => Promise<void>;
    upsertRaw: (data: Array<T>, idCol?: string) => Promise<void>;
}

interface Smem {
    nodes: Record<string, SmemNode>;
    init: (dbpath: string) => Promise<Connection>;
    node: <T extends Record<string, any> = Record<string, any>>(name: string, schema: SmemNodeSchema, vectorSourceCol: string) => Promise<SmemNode<T>>;
    nodeNames: () => Promise<string[]>;
    nodeFromSchema: <T extends Record<string, any> = Record<string, any>> (name: string, schema: Schema, vectorSourceCol: string) => Promise<SmemNode<T>>;
    nodeFromData: <T extends Record<string, any> = Record<string, any>> (name: string, data: Array<Record<string, unknown>>, vectorSourceCol: string) => Promise<SmemNode<T>>;
    openTable: (name: string, sourceCol: string) => Promise<Table>;
    vector: (text: string) => Promise<number[]>;
    embed: (data: unknown[]) => Promise<number[][]>;
}

type SmemNodeSchema = Array<SmemNodeFieldSchema>;

type FieldDataType = "string" | "int" | "float" | "boolean";

export {
    SmemNodeFieldSchema,
    SmemNodeSchema,
    SmemNode,
    Smem,
}