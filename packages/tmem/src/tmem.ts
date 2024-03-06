import * as localForage from "localforage";
import { Tmem } from "./tmeminterfaces.js";

const useTmem = <S extends Record<string, any> = Record<string, any>>(name: string, initial: S, verbose = false) => {
    const db = localForage.createInstance({
        name: "tmem",
        driver: localForage.INDEXEDDB,
        storeName: name,
    });

    const init = async () => {
        await db.ready();
        // fill initial data
        if ((await keys()).length == 0) {
            if (verbose) {
                console.log(`Tmem: setting initial data for store ${name}`)
            }
            for (const [k, v] of Object.entries(initial)) {
                set(k, v)
            }
        }
    };

    const set = async (k: string, v: any) => {
        await db.ready();
        await db.setItem(k, v);
    };

    const get = async <T>(k: string): Promise<T> => {
        //console.log("TMEM GET", k);
        await db.ready();
        const v = await db.getItem<T>(k);
        if (v === null) {
            throw new Error(`Key ${k} not found`)
        }
        return v
    };

    const del = async (k: string) => {
        await db.ready();
        await db.removeItem(k);
    };

    const keys = async (): Promise<Array<string>> => {
        await db.ready();
        return await db.keys();
    };

    const all = async <T = any>(): Promise<Record<string, T>> => {
        await db.ready();
        const _t: Record<string, any> = {};
        await db.iterate((v, k, i) => {
            _t[k] = v
        });
        return _t as Record<string, T>
    }

    return {
        db,
        init,
        set,
        get,
        del,
        keys,
        all,
    } as Tmem<S>
}

export { useTmem }