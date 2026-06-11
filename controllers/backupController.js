import { getBackupData } from '../libraryManager.js';

export async function downloadBackup(req, res) {
  try {
    const backup = await getBackupData();
    res.setHeader('Content-Disposition', 'attachment; filename=backup.json');
    res.status(200).json(backup);
  } catch (error) {
    console.error('Error generating backup:', error);
    res.status(500).json({ error: 'Failed to generate backup', details: error.message });
  }
}
