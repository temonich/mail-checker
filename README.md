# email-checker
A Node.js module that check email and parse it

## Installation 
```sh
npm install dx-email-checker --save
yarn add dx-email-checker
```
## Usage
Example in folder /examples/
```typescript
import { FilterProc, EmailHandlerClass } from 'dx-email-checker/lib/types';
import EmailChecker from 'dx-email-checker/lib/emailChecker';
import { ParsedMail } from 'mailparser';

class HandleMail implements EmailHandlerClass {
  // set criteria for search mail
  public getSearchCriteria(criteria: Array<any>): Array<any> {
    // get mail only from test@example.com. 
    criteria.push(['FROM', 'test@example.com']);
    return criteria;
  }
  // handle email
  public handleEmail(mail: ParsedMail): boolean {
    if ( !mail )
      return false;

    // do same thing with email content ...
    // Show subject:
    console.log(mail.subject);

    // Show body:
    console.log(mail.body);

    // Write attachment to file
    for (let i = 0; i < mail.attachments.length; i += 1) {
      const attachment = mail.attachments[i];
      fs.writeFileSync('file.name', attachment.content, 'base64');
    }

    return true;
  }
}

const email = new EmailChecker(
    '/cache/', // folder for save last email handler 
    {
    // Simple name
    name: 'handlerName',
    // Email handler
    handler: new HandleMail(),
    // Get all message or only new 
    filterProc: FilterProc.onlyNew,
    // mail credentials for mail server
    mailCredentials: {
      user: 'opt2@dokmarket.ru',
      password: 'password2',
      host: 'imap.yandex.com',
      port: 993,
      tls: true,
    },
  });

//  run check
email.check();
```

### Email object

Parsed mail* object has the following properties

        * headers – a Map object with lowercase header keys
        * subject is the subject line (also available from the header mail.headers.get(‘subject’))
        * from is an address object for the From: header
        * to is an address object for the To: header
        * cc is an address object for the Cc: header
        * bcc is an address object for the Bcc: header (usually not present)
        * date is a Date object for the Date: header
        * messageId is the Message-ID value string
        * inReplyTo is the In-Reply-To value string
        * reply-to is an address object for the Cc: header
        * references is an array of referenced Message-ID values
        * html is the HTML body of the message. If the message included embedded images as cid: urls then these are all replaced with base64 formatted data: URIs
        * text is the plaintext body of the message
        * textAsHtml is the plaintext body of the message formatted as HTML
        * attachments is an array of attachments
More info about parse email: https://nodemailer.com/extras/mailparser/

### Criteria for email filter
* `criteria` is a list describing what you want to find. For criteria types that require arguments, use an _array_ instead of just the string criteria type name (e.g. ['FROM', 'foo@bar.com']). Prefix criteria types with an "!" to negate.

    * The following message flags are valid types that do not have arguments:

        * 'ALL' - All messages.
        * 'ANSWERED' - Messages with the Answered flag set.
        * 'DELETED' - Messages with the Deleted flag set.
        * 'DRAFT' - Messages with the Draft flag set.
        * 'FLAGGED' - Messages with the Flagged flag set.
        * 'NEW' - Messages that have the Recent flag set but not the Seen flag.
        * 'SEEN' - Messages that have the Seen flag set.
        * 'RECENT' - Messages that have the Recent flag set.
        * 'OLD' - Messages that do not have the Recent flag set. This is functionally equivalent to "!RECENT" (as opposed to "!NEW").
        * 'UNANSWERED' - Messages that do not have the Answered flag set.
        * 'UNDELETED' - Messages that do not have the Deleted flag set.
        * 'UNDRAFT' - Messages that do not have the Draft flag set.
        * 'UNFLAGGED' - Messages that do not have the Flagged flag set.
        * 'UNSEEN' - Messages that do not have the Seen flag set.

    * The following are valid types that require string value(s):

        * 'BCC' - Messages that contain the specified string in the BCC field.
        * 'CC' - Messages that contain the specified string in the CC field.
        * 'FROM' - Messages that contain the specified string in the FROM field.
        * 'SUBJECT' - Messages that contain the specified string in the SUBJECT field.
        * 'TO' - Messages that contain the specified string in the TO field.
        * 'BODY' - Messages that contain the specified string in the message body.
        * 'TEXT' - Messages that contain the specified string in the header OR the message body.
        * 'KEYWORD' - Messages with the specified keyword set.
        * 'HEADER' - **Requires two string values, with the first being the header name and the second being the value to search for.** If this second string is empty, all messages that contain the given header name will be returned.

    * The following are valid types that require a string parseable by JavaScript's Date object OR a Date instance:

        * 'BEFORE' - Messages whose internal date (disregarding time and timezone) is earlier than the specified date.
        * 'ON' - Messages whose internal date (disregarding time and timezone) is within the specified date.
        * 'SINCE' - Messages whose internal date (disregarding time and timezone) is within or later than the specified date.
        * 'SENTBEFORE' - Messages whose Date header (disregarding time and timezone) is earlier than the specified date.
        * 'SENTON' - Messages whose Date header (disregarding time and timezone) is within the specified date.
        * 'SENTSINCE' - Messages whose Date header (disregarding time and timezone) is within or later than the specified date.

    * The following are valid types that require one Integer value:

        * 'LARGER' - Messages with a size larger than the specified number of bytes.
        * 'SMALLER' - Messages with a size smaller than the specified number of bytes.

    * The following are valid criterion that require one or more Integer values:

        * 'UID' - Messages with UIDs corresponding to the specified UID set. Ranges are permitted (e.g. '2504:2507' or '\*' or '2504:\*').

    * **Note 1:** For the UID-based search (i.e. "conn.search()"), you can retrieve the UIDs for sequence numbers by just supplying an _array_ of sequence numbers and/or ranges as a criteria (e.g. [ '24:29', 19, '66:*' ]).

    * **Note 2:** By default, all criterion are ANDed together. You can use the special 'OR' on **two** criterion to find messages matching either search criteria (see example below).

  `criteria` examples:

    * Unread messages since April 20, 2010: [ 'UNSEEN', ['SINCE', 'April 20, 2010'] ]
    * Messages that are EITHER unread OR are dated April 20, 2010 or later, you could use: [ ['OR', 'UNSEEN', ['SINCE', 'April 20, 2010'] ] ]
    * All messages that have 'node-imap' in the subject header: [ ['HEADER', 'SUBJECT', 'node-imap'] ]
    * All messages that _do not_ have 'node-imap' in the subject header: [ ['!HEADER', 'SUBJECT', 'node-imap'] ]
    
    More info about criteria: https://github.com/mscdex/node-imap/blob/master/README.md
    