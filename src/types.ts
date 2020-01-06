import { ParsedMail } from 'mailparser';

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

export interface EmailHandlerClass {
  handleEmail(row: ParsedMail): Promise<boolean>;
  getSearchCriteria(email: Array<any>): Array<any>;
}
