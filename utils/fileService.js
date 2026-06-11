import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

export const studentsPath = path.join(rootDir, 'students.json');
export const dueStudentsPath = path.join(rootDir, 'dueStudents.json');
export const completeStudentsPath = path.join(rootDir, 'completeStudents.json');
export const paymentHistoryPath = path.join(rootDir, 'paymentHistory.json');

export async function ensureJsonFile(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    await writeJson(filePath, []);
  }
}

export async function readJson(filePath) {
  await ensureJsonFile(filePath);
  const raw = await fs.readFile(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${filePath}: ${error.message}`);
  }
}

export async function writeJson(filePath, data) {
  const text = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, text, 'utf8');
}

export async function ensureAllDataFiles() {
  await Promise.all([
    ensureJsonFile(studentsPath),
    ensureJsonFile(dueStudentsPath),
    ensureJsonFile(completeStudentsPath),
    ensureJsonFile(paymentHistoryPath),
  ]);
}
