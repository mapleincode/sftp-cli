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
        this.sftp = new Ssh2SFtpClient();
        this.options = options;
        this.emptyFunc = function() {};
    }

    connect(callback) {
        const self = this;

        self.sftp.connect(self.options).then(function() {
            self.connected = true;
            return callback();
        }).catch(function(err) {
            return callback(err);
        })
    }

}


const methodList = ['list', 'get', 'put', 'mkdir', 'rmdir', 'rename', 'end'];

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

module.exports = Client;
