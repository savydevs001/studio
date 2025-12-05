
import Database from 'better-sqlite3';
import path from 'path';

// Define the path to the database file. It will be created in the project root.
const dbPath = path.resolve(process.cwd(), 'appraisals.db');

const db = new Database(dbPath);

// Function to add a column to a table if it doesn't exist
function addColumnIfNotExists(table: string, column: string, type: string) {
  try {
    // Check if the column exists
    const result = db.prepare(`PRAGMA table_info(${table})`).all();
    const columnExists = result.some((col: any) => col.name === column);

    if (!columnExists) {
      db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run();
      console.log(`Column '${column}' added to table '${table}'.`);
    }
  } catch (error) {
    // This can happen if another process is initializing at the same time.
    // It's generally safe to ignore if the column check is robust.
    console.warn(`Could not add column ${column} to ${table}, it might already exist.`);
  }
}


// Function to initialize the database and create the table if it doesn't exist
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS appraisals (
      id TEXT PRIMARY KEY,
      vin TEXT,
      make TEXT,
      model TEXT,
      year INTEGER,
      odometer INTEGER,
      trim TEXT,
      transmission TEXT,
      drivetrain TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      accidentHistory TEXT,
      accidentDetails TEXT,
      frameDamage TEXT,
      frameDamageDetails TEXT,
      floodDamage TEXT,
      floodDamageDetails TEXT,
      smokedIn TEXT,
      smokedInDetails TEXT,
      mechanicalIssues TEXT,
      mechanicalIssuesDetails TEXT,
      odometerBroken TEXT,
      odometerBrokenDetails TEXT,
      paintBodyWork TEXT,
      paintBodyWorkDetails TEXT,
      rustHailDamage TEXT,
      rustHailDamageDetails TEXT,
      interiorBroken TEXT,
      interiorBrokenDetails TEXT,
      interiorRips TEXT,
      interiorRipsDetails TEXT,
      tiresNeedReplacement TEXT,
      tiresNeedReplacementDetails TEXT,
      keys TEXT,
      aftermarketModifications TEXT,
      aftermarketModificationsDetails TEXT,
      otherIssues TEXT,
      otherIssuesDetails TEXT,
      photoDamage1Description TEXT,
      photoDamage2Description TEXT,
      photoDamage3Description TEXT,
      photoFeature1Description TEXT,
      photoFeature2Description TEXT,
      photoFeature3Description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Add columns for the 4th optional photos, which might be missing from older schemas
  addColumnIfNotExists('appraisals', 'photoDamage4Description', 'TEXT');
  addColumnIfNotExists('appraisals', 'photoFeature4Description', 'TEXT');


  console.log('Database initialized.');
}

// Initialize the DB right away
initDb();

export default db;
