# gandi-pw-change
Utility to allow users to change themselves their password on Gandi Mail. You can see it in production at [pw.webmail.redado.com](pw.webmail.redado.com);

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

To set up in production, create a service with [systemd](https://rocketeer.be/articles/deploying-node-js-with-systemd/), and put it behind a reverse proxy such as Nginx. Do not forget to add `NODE_ENV=production` environment variable.
