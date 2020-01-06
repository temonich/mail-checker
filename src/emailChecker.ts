import Imap, { ImapMessage, Box } from 'imap';
import { simpleParser } from 'mailparser';

import { EmailHandler, FilterProc } from './types';
import Cache from './cache';
import ReadableStream = NodeJS.ReadableStream;

export default class EmailChecker {
  public ph: EmailHandler;
  public conf: Cache;
  constructor(cacheDir: string, ph: EmailHandler) {
    this.ph = ph;
    this.conf = new Cache(cacheDir, this.ph.name);
    this.conf.readConfig();
  }
  public connect(imap: Imap): Promise<void> {
    return new Promise((resolve, reject) => {
      imap.once('ready', resolve);
      imap.once('error', (err: Error) => reject(err));
      imap.connect();
    });
  }
  public openMailBox(imap: Imap): Promise<Box> {
    return new Promise((resolve, reject) => {
      imap.openBox('INBOX', (error, mailbox) => {
        if (error) reject(error);
        resolve(mailbox);
      });
    });
  }
  public search(imap: Imap, searchCriteria: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      imap.search(searchCriteria, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
  public async fetch(imap: Imap, results: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const f = imap.fetch(results, { bodies: '' });
      let messagesRetrieved = 0;

      f.once('message', async (msg: ImapMessage) => {
        await this.msgParser(msg);
        messagesRetrieved++;
        if (messagesRetrieved === results.length) {
          f.removeAllListeners();
          resolve();
        }
      });
      f.once('error', err => {
        console.log('Fetch error: ' + err);
        reject();
      });
    });
  }
  public msgParser(msg: ImapMessage): Promise<any> {
    return new Promise(resolve => {
      msg.once(
        'body',
        async (stream: ReadableStream): Promise<void> => {
          await this.simpleParser(stream);
          msg.removeAllListeners();
          resolve();
        },
      );
    });
  }
  public simpleParser(stream: ReadableStream): Promise<void> {
    return new Promise(resolve => {
      simpleParser(stream)
        .then(mail => {
          return this.handleEmail(mail);
        })
        .then(() => {
          resolve();
        });
    });
  }
  public handleEmail(mail: any): Promise<void> {
    return new Promise(resolve => {
      if (this.ph.filterProc === FilterProc.all) {
        this.ph.handler.handleEmail(mail).then(() => {
          resolve();
        });
      }

      const lastUpdate = new Date(this.conf.lastUpdate);
      const mailDate = mail.date;
      if (
        lastUpdate.toString() === 'Invalid Date' ||
        (mailDate !== undefined && mailDate.getTime() > lastUpdate.getTime())
      ) {
        console.log('mailDate:' + mailDate);
        this.ph.handler.handleEmail(mail).then((res: boolean) => {
          if (res && mail.date !== undefined) {
            this.conf.lastUpdate = mail.date.toString();
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  public getSearchCriteria(): Array<any> {
    const searchCriteria: Array<any> = ['ALL'];
    if (this.ph.filterProc === FilterProc.onlyNew && this.conf.lastUpdate) {
      searchCriteria.push(['SINCE', this.conf.lastUpdate]);
    }
    return this.ph.handler.getSearchCriteria(searchCriteria);
  }
  public async check(): Promise<void> {
    const imap = new Imap(this.ph.mailCredentials);
    await this.connect(imap);
    await this.openMailBox(imap);

    const results = await this.search(imap, this.getSearchCriteria());
    if (results.length === 0) return;

    for (const result of results) {
      await this.fetch(imap, [result]);
    }
    imap.closeBox(true, () => {
      imap.end();
    });
    this.conf.writeConfig();
  }
}
