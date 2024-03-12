import { Connection, Table } from "vectordb";
import { Schema } from "apache-arrow";

interface SmemNodeFieldSchema {
    name: string;
    type: FieldDataType,
    nullable?: boolean;
}

interface SmemNode {
    table: Table;
    vectorSourceCol: string;
    open: () => Promise<Table>;
    add: (data: Array<Record<string, unknown>>) => Promise<void>;
    addRaw: (data: Array<Record<string, unknown>>) => Promise<void>;
    upsert: (data: Array<Record<string, unknown>>, idCol?: string) => Promise<void>;
    upsertRaw: (data: Array<Record<string, unknown>>, idCol?: string) => Promise<void>;
}

interface Smem {
    nodes: Record<string, SmemNode>;
    init: (dbpath: string) => Promise<Connection>;
    node: (name: string, schema: SmemNodeSchema, vectorSourceCol: string) => Promise<SmemNode>;
    nodeNames: () => Promise<string[]>;
    nodeFromSchema: (name: string, schema: Schema, vectorSourceCol: string) => Promise<SmemNode>;
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