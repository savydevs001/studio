import Database from 'better-sqlite3';
import path from 'path';

// Define the path to the database file. It will be created in the project root.
const dbPath = path.resolve(process.cwd(), 'appraisals.db');

const db = new Database(dbPath);

// Function to initialize the database and create tables if they don't exist
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
      
      photoDriverFrontCorner TEXT,
      photoDriverQuarterPanel TEXT,
      photoPassengerQuarterPanel TEXT,
      photoFrontSeats TEXT,
      photoRearSeatArea TEXT,
      photoDashboard TEXT,

      photoDamage1 TEXT,
      photoDamage1Description TEXT,
      photoDamage2 TEXT,
      photoDamage2Description TEXT,
      photoDamage3 TEXT,
      photoDamage3Description TEXT,
      photoDamage4 TEXT,
      photoDamage4Description TEXT,
      photoFeature1 TEXT,
      photoFeature1Description TEXT,
      photoFeature2 TEXT,
      photoFeature2Description TEXT,
      photoFeature3 TEXT,
      photoFeature3Description TEXT,
      photoFeature4 TEXT,
      photoFeature4Description TEXT,
      
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Database initialized.');
}

// Initialize the DB right away
initDb();

export default db;
