import { parseCSV, csvToProspect } from './csvParser.js';

export const seedDataFromCSV = (csvText, userId, userName) => {
  const rows = parseCSV(csvText);
  return rows.map((row) => ({
    ...csvToProspect(row),
    userId,
    userName,
  }));
};
