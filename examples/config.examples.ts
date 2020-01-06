// Example for config.ts
import HandleMailChecker from './handlers/HandleMailChecker';
import { FilterProc } from '../lib/types';

export default {
  cacheDir: __dirname + '/../cache/',
  handlers: [
    {
      name: 'rival',
      handler: new HandleMailChecker({
        handlerName: 'prolanding',
        subject: 'Stock DVI',
        from: 'info@prolanding.ru',
      }),
      filterProc: FilterProc.onlyNew,
      mailCredentials: {
        user: 'opt@dokmarket.ru',
        password: 'password',
        host: 'imap.yandex.com',
        port: 993,
        tls: true,
      },
    },
    {
      name: 'autolider',
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
    },
  ]
};
