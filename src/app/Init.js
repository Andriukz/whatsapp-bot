import fs from 'fs';

function createRequiredFolders() {
  const userDataDir = './user-data';

  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir);
  }
}

export default function initialize() {
  createRequiredFolders();
}
