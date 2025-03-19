const SQLite = require("better-sqlite3");
const db = new SQLite("quiz.db");

let migrations = [
  {
    id: 1,
    name: "Create users table",
    up: () => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          email TEXT UNIQUE,
          password TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Users table created or already exists.");
    },
    down: () => {
      db.exec("DROP TABLE IF EXISTS users");
      console.log("Users table dropped.");
    },
  },
];

let seeders = [
  {
    id: 1,
    name: "Seed test users",
    seed: () => {
      const stmt = db.prepare(
        "INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)",
      );
      // bcrypt.hashSync("123456", process.env.HASH_SALTROUNDS)
      stmt.run("testuser", "user@test.com", "123qweasd");
      stmt.run("tester", "tester@test.com", "123456");
      console.log("Test users seeded.");
    },
  },
];

function migrate() {
  console.log("Migrating...");
  migrations.forEach((migration) => {
    try {
      migration.up();
      console.log(`${migration.name} migration applied.`);
    } catch (err) {
      console.error(`Error on ${migration.name} migration: ${err.message}`);
    }
  });
}

function freshMigrate() {
  console.log("Dropping all migrations...");
  migrations.forEach((migration) => {
    try {
      migration.down();
      console.log(`${migration.name} table dropped.`);
    } catch (err) {
      console.error(`Error dropping ${migration.name} table: ${err.message}`);
    }
  });
  migrate();
}

function seed() {
  console.log("Seeding...");
  seeders.forEach((seeder) => {
    try {
      seeder.seed();
      console.log(`${seeder.name} seeder applied.`);
    } catch (err) {
      console.error(`Error on ${seeder.name} seeder: ${err.message}`);
    }
  });
}

function freshSeed() {
  freshMigrate();
  seed();
}

if (require.main === module) {
  freshSeed();
  db.close();
}

module.exports = { db, migrate, freshMigrate, seed, freshSeed };
