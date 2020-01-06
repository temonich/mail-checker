# email-checker
A Node.js module that check email and parse it

## Installation 
```sh
npm install email-checker --save
yarn add email-checker
```
## Usage
### TypeScript
Example in folder /examples/
```typescript
const email = new EmailChecker('/cache/', {
    name: 'handlerName',
    handler: new HandleMailChecker({
      handlerName: 'autolider',
      subject: 'Stock',
      from: 'info@develex.ru',
    }),
    filterProc: FilterProc.onlyNew,
    mailCredentials: {
      user: 'opt2@dokmarket.ru',
      password: 'password2',
      host: 'imap.yandex.com',
      port: 993,
      tls: true,
    },
  });

email.check().catch(e => {
  console.info(e);
  process.exit(1);
});
```

### Same additional info
Script for get emails and parse it.

 ** /handlers
contains add handlers.
HandleMailChecker.ts has example
 
all configs is here: config

/cache - for save last date parse 

в файле config.ts в архиве handlers указываются все обработчики: какие ящики проверять и как обрабатывать новые письма.
в папку cache - сохраняется последняя дата обновления письма.
=======
/src/mail-handlers
Containt all mail handlers. Your own handlers you can add to this folder.

/cache - for save last date parse  

All configs is here: mail-check-config

run: node mail-check.js

