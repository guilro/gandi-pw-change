# gandi-pw-change
Utility to allow users to change themselves their password on Gandi Mail via web interface. You can see it in production at [pw.webmail.redado.com](https://pw.webmail.redado.com).

## How does it work ?
Mailbox users cannot change their password on Gandi Mail, they have to ask the administrator.

The app checks users mailbox old password against Gandi's SMTP server. If the old password is correct, password is changed using Gandi API.

## Install

```bash
git clone https://github.com/guilro/gandi-pw-change
cd gandi-pw-change
npm install
```

To launch in development mode :
```bash
API_KEY={your_gandi_api_key} node index.js
```

You can get a Gandi API key on this page : [https://www.gandi.net/admin/api_key](https://www.gandi.net/admin/api_key)

To set up in production, create a service with [systemd](https://rocketeer.be/articles/deploying-node-js-with-systemd/), and put it behind a reverse proxy such as Nginx. Do not forget to add `NODE_ENV=production` environment variable.
