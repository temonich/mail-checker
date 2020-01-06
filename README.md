# email-checker
A Node.js module that check email and parse it

## Installation 
```sh
npm install dx-email-checker --save
yarn add dx-email-checker
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

email.check();
```
