const filepath = `CREATE TABLE IF NOT EXISTS filepath (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL
);`;

const featurespath = `CREATE TABLE IF NOT EXISTS featurespath (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL
);`;

const plugin = `CREATE TABLE IF NOT EXISTS plugin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL
);`;

const tasks = `CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    variables TEXT,
    ext TEXT NOT NULL CHECK ( ext IN ('yml') )
);`;

const workflow = `CREATE TABLE IF NOT EXISTS workflow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    variables TEXT,
    ext TEXT NOT NULL CHECK ( ext IN ('yml') )
);`;

const action = `CREATE TABLE IF NOT EXISTS action (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    variables TEXT,
    ext TEXT NOT NULL CHECK ( ext IN ('yml', 'js', 'py') )
);`;

const adaptater = `CREATE TABLE IF NOT EXISTS adaptater (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    variables TEXT,
    ext TEXT NOT NULL CHECK ( ext IN ('yml', 'js', 'py') )
);`;

const cmd = `CREATE TABLE IF NOT EXISTS cmd (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    variables TEXT,
    ext TEXT NOT NULL CHECK ( ext IN ('js') )
);`;

const tool = `CREATE TABLE IF NOT EXISTS tool (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    spec TEXT NOT NULL,
    type TEXT NOT NULL CHECK ( type IN ('task', 'action', 'workflow') )
);`;

const alias = `CREATE TABLE IF NOT EXISTS aliases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK ( type IN ('task', 'action', 'workflow') )
);`;

const modelfile = `CREATE TABLE IF NOT EXISTS modelfile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    variables TEXT,
    ext TEXT NOT NULL CHECK ( ext IN ('yml') )
);`;

const model = `CREATE TABLE IF NOT EXISTS model (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    shortname TEXT UNIQUE NOT NULL,
    data TEXT NOT NULL
);`;

/*const override = `CREATE TABLE IF NOT EXISTS override (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
);`;*/

const schemas = [
    filepath,
    featurespath,
    tasks,
    workflow,
    action,
    tool,
    cmd,
    plugin,
    alias,
    model,
    modelfile,
    adaptater,
];

export { schemas }