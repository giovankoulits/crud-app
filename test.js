const fsPromises = require('fs').promises;
const path = require('node:path');

const str = 'Henlo friend! \n';

(async function main() {
  try {
    await fsPromises.appendFile(
      path.join(__dirname, 'logs', 'eventlog.txt'),
      str
    );
    const readFile = await fsPromises.readFile(
      path.join(__dirname, 'logs', 'eventlog.txt'),
      { encoding: 'utf8', flag: 'r' }
    );

    console.log(readFile);
  } catch (error) {
    console.error(error);
  }
})();
