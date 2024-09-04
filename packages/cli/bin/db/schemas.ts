const filepaths = `CREATE TABLE IF NOT EXISTS filepath (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL
);`;

const featurespaths = `CREATE TABLE IF NOT EXISTS featurespath (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL
);`;

const plugins = `CREATE TABLE IF NOT EXISTS plugin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL
);`;

const tasks = `CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    ext TEXT NOT NULL CHECK ( ext IN ('yml') )
);`;

const jobs = `CREATE TABLE IF NOT EXISTS job (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    ext TEXT NOT NULL CHECK ( ext IN ('yml') )
);`;

const actions = `CREATE TABLE IF NOT EXISTS action (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    ext TEXT NOT NULL CHECK ( ext IN ('yml', 'js', 'py') )
);`;

const cmds = `CREATE TABLE IF NOT EXISTS cmd (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    ext TEXT NOT NULL CHECK ( ext IN ('js') )
);`;

const aliases = `CREATE TABLE IF NOT EXISTS aliases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK ( type IN ('task', 'action', 'job') )
);`;

const schemas = [
    filepaths, featurespaths, tasks, jobs, actions, cmds, plugins, aliases
];

export { schemas }