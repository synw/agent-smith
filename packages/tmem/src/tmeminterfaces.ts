interface Tmem<S extends Record<string, any>> {
    db: LocalForage;
    init: () => Promise<void>;
    set: (k: string, v: any) => Promise<void>;
    get: <T>(k: string) => Promise<T>;
    del: (k: string) => Promise<void>;
    keys: () => Promise<Array<string>>;
    all: <T = any>() => Promise<Record<string, T>>;
}

export {
    Tmem,
};