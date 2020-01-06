import * as fs from 'fs';
import { ParsedMail } from 'mailparser';
import { EmailHandlerClass } from '../../lib/types';

// Example for parsing Email
export default class EmailHandler implements EmailHandlerClass {
  public file = '';
  public subject = '';
  public from = '';
  constructor(args: any) {
    this.file = args.file;
    this.subject = args.subject;
    this.from = args.from;
  }
  public getSearchCriteria(criteria: Array<any>): Array<any> {
    criteria.push(['FROM', this.from]);
    return criteria;
  }
  public async handleEmail(mail: ParsedMail): Promise<boolean> {
    if (
      !mail ||
      !mail.attachments ||
      mail.subject !== this.subject ||
      mail.attachments?.length == 0
    )
      return false;

    for (let i = 0; i < mail.attachments.length; i += 1) {
      const attachment = mail.attachments[i];
      await fs.writeFileSync(this.file, attachment.content, 'base64'); // take encoding from attachment ?
    }
    return true;
  }
}
