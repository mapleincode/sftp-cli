# sftp-cli

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
