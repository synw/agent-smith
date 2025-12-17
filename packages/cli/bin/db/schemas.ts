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

const backend = `CREATE TABLE IF NOT EXISTS backend (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK ( type IN ('llamacpp', 'koboldcpp', 'ollama', 'openai') ),
    url TEXT NOT NULL,
    isdefault INTEGER NOT NULL,
    apiKey TEXT
);`

const tasksSettings = `CREATE TABLE IF NOT EXISTS tasksettings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    model TEXT,
    template TEXT,
    ctx INTEGER,
    maxtokens INTEGER
    topk INTEGER,
    topp REAL,
    minp REAL,
    temperature REAL,
    repeat REAL,
    backend TEXT
);`;

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
    adaptater,
    backend,
    tasksSettings,
];

export { schemas }