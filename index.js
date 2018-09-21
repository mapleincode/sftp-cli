/**
 * Created by maple on 2017/7/27.
 */
"use strict";

const Ssh2SFtpClient = require('ssh2-sftp-client');


class Client {
    constructor(host, username, password, options) {
        const self = this;

        if(typeof host === "object") {
            options = host;
        } else {
            if(typeof options !== "object") {
                options = {};
            }
            options.host = host;
            options.username = username;
            options.password = password;
        }
        // this.sftp = new Ssh2SFtpClient();

        // 提取 timeout

        if(options.timeout) {
            try {
                this.timeout = options.timeout;
                delete options.timeout;
            } catch(e) {}
        }
        this.timeout = this.timeout || 5000;

        this.options = options;
        this.emptyFunc = function() {};
    }
    _destroy(callback) {
        this.sftp.end().then(function() {
            callback();
        }).catch(function(err) {
            return callback(err);
        });
    }
    _timeoutConnect(callback) {
        const self = this;
        const timeout = self.timeout || 5000;
        setTimeout(function() {
            callback();
        }, timeout);
    }

    connect(callback) {
        const self = this;
        let connectErrorStatus = false;
        if(!self.sftp) {
            self.sftp = new Ssh2SFtpClient();
        }
        self._timeoutConnect(function() {
            if(!self.connected && !connectErrorStatus) {
                connectErrorStatus = true;
                self._destroy(function() {
                    callback(new Error('connect sftp timeout!'));
                });

            }
        });
        self.sftp.connect(self.options).then(function() {
            if(!connectErrorStatus) {
                connectErrorStatus = true;
                self.connected = true;
                return callback();
            }
        }).catch(function(err) {
            if(!connectErrorStatus) {
                connectErrorStatus = true;
                self._destroy(function() {
                    return callback(err);
                });

            }
        });
    }

}


const methodList = [
    'list',
    'get',
    'put',
    'mkdir',
    'rmdir',
    'rename',
    'end',
    'fastGet',
    'fastPut',
    'delete',
    'chmod',
    'stat'
];

for(const method of methodList) {
    Client.prototype[method] = function() {
        const self = this;
        const callback = Array.prototype.pop.call(arguments) || this.emptyFunc;
        const argu = Array.prototype.slice.call(arguments);

        if(!self.connected) {
            return callback(new Error('client need connect!'));
        }

        self.sftp[method].apply(self.sftp, argu).then(function(data) {
            callback(undefined, data);
        }).catch(function(err) {
            callback(err);
        });
    }
}

Client.prototype.on = function(eventType, callback) {
    this.sftp.on(eventType, callback);
};

module.exports = Client;
