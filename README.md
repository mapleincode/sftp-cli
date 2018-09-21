# sftp-cli

Callback 版本 sftp-cli，依赖 [ssh2-sftp-client](https://github.com/jyu213/ssh2-sftp-client)

## Install

```bash
npm install sftp-cli --save
```

## Usage

```javascript
const SftpCli = require('sftp-cli');

const client = new SftpCli(host, username, password, options);

client.connect(function() {
  client.list("/home/vagrant", function(err, result) {
    // do
  });
});

```
