import fs from 'fs';

export default class Cache {
  public lastUpdate: string;
  public prevLastUpdate: string;
  public parser: string;
  constructor(path: string, parser: string) {
    this.prevLastUpdate = '';
    this.lastUpdate = '';
    this.parser = path + '/' + parser;
  }
  readConfig(): void {
    try {
      this.lastUpdate = fs.readFileSync(this.parser, 'utf8');
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
      fs.writeFileSync(this.parser, this.lastUpdate, {
        flag: 'w',
      });
    } catch (e) {
      console.error(e);
    }
  }
}
