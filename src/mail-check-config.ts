import { ParsedMail } from 'mailparser';

import HandleMailChecker from './mail-handlers/HandleMailChecker';

export enum FilterProc {
  onlyNew, // parse only new mail
  all, // parse all messages every time
}

export interface EmailHandler {
  name: string;
  handler: EmailHandlerClass | any; // any, т.к. не смог указать, вид конструктора
  mailCredentials: any;
  filterProc: FilterProc;
}

// noinspection SpellCheckingInspection,SpellCheckingInspection
const mailCredentials = {
  user: 'opt@dokmarket.ru',
  password: 'password',
  host: 'imap.yandex.com',
  port: 993,
  tls: true,
};

// noinspection SpellCheckingInspection,SpellCheckingInspection
const emails: Array<EmailHandler> = [
  {
    name: 'rival',
    handler: new HandleMailChecker({
      handlerName: 'prolanding',
      subject: 'Stock DVI',
      from: 'info@prolanding.ru',
    }),
    filterProc: FilterProc.onlyNew,
    mailCredentials,
  },
  {
    name: 'autolider',
    handler: new HandleMailChecker({
      handlerName: 'autolider',
      subject: 'Stock',
      from: 'info@develex.ru',
    }),
    filterProc: FilterProc.onlyNew,
    mailCredentials,
  },
];

export default {
  cacheDir: __dirname + '/../cache/',
  handlers: {
    emails,
  },
};

export interface EmailHandlerClass {
  handleEmail(row: ParsedMail): Promise<boolean>;
  getSearchCriteria(email: Array<any>): Array<any>;
}
