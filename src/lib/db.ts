import Database from 'better-sqlite3';
import path from 'path';

// Define the path to the database file. It will be created in the project root.
const dbPath = path.resolve(process.cwd(), 'appraisals.db');

const db = new Database(dbPath);

const photoColumns = [
  'photoDriverFrontCorner',
  'photoDriverQuarterPanel',
  'photoPassengerQuarterPanel',
  'photoFrontSeats',
  'photoRearSeatArea',
  'photoDashboard',
  'photoDamage1',
  'photoDamage2',
  'photoDamage3',
  'photoDamage4',
  'photoFeature1',
  'photoFeature2',
  'photoFeature3',
  'photoFeature4',
];


// Function to initialize the database and create/update tables
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
      photoDamage4Description TEXT,
      photoFeature1Description TEXT,
      photoFeature2Description TEXT,
      photoFeature3Description TEXT,
      photoFeature4Description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safely add columns for photo filenames if they don't exist
  const columns = db.prepare("PRAGMA table_info(appraisals)").all();
  const columnNames = columns.map((col: any) => col.name);

  for (const col of photoColumns) {
    if (!columnNames.includes(col)) {
      try {
        db.exec(`ALTER TABLE appraisals ADD COLUMN ${col} TEXT`);
        console.log(`Added column: ${col}`);
      } catch (e) {
        // This might happen in a race condition but is generally safe to ignore
        console.warn(`Could not add column ${col}, it might exist already.`);
      }
    }
  }

  console.log('Database initialized.');
}

// Initialize the DB right away
initDb();

export default db;
