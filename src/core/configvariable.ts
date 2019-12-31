import fs from 'fs';
import config from '../mail-check-config';

export default class ConfigVariable {
  public lastUpdate: string;
  public prevLastUpdate: string;
  public parser: string;
  constructor(path: string, parser: string) {
    this.prevLastUpdate = '';
    this.lastUpdate = '';
    this.parser = parser;
  }
  readConfig(): void {
    try {
      this.lastUpdate = fs.readFileSync(config.cacheDir + this.parser, 'utf8');
      const date = new Date(this.lastUpdate);
      if (date.toString() === 'Invalid Date') this.lastUpdate = '';
    } catch (e) {
      this.lastUpdate = '';
    }
    this.prevLastUpdate = this.lastUpdate;
  }
  writeConfig(): void {
    if (this.prevLastUpdate === this.lastUpdate) return;
    try {
      fs.writeFileSync(config.cacheDir + this.parser, this.lastUpdate, {
        flag: 'w',
      });
    } catch (e) {
      console.error(e);
    }
  }
}
