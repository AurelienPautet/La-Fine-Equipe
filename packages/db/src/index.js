"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.getDb = getDb;
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("./schema");
let _db = null;
function getDb() {
    if (!_db) {
        const pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        });
        _db = (0, node_postgres_1.drizzle)(pool, { schema: { articles: schema_1.articles } });
    }
    return _db;
}
// For backwards compatibility
exports.db = new Proxy({}, {
    get(_, prop) {
        return getDb()[prop];
    }
});
