const fs = require('fs');
const promisify = require('util').promisify;
const {google} = require('googleapis');
const getGmailClient = require('./gmailClient');



class EmailSender{
    constructor(){
        this._gmailClient = getGmailClient();
    }

    enviarMailCon(subject, bodyMessage, mailReceptor){
        this._gmailClient.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: this.createMessage(subject, bodyMessage, mailReceptor),
            },
        });
    }
    
    createMessage(subject, bodyMessage, mailReceptor) {
        // You can use UTF-8 encoding for the subject using the method below.
        // You can also just use a plain string if you don't need anything fancy.
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            'From: franciscospinelli98@gmail.com',
            `To: ${mailReceptor}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            bodyMessage ,
            '<br><br><br>Por favor no responer este mail.<br>Atte, <br>UNQfy.'
        ];
        const message = messageParts.join('\n');
  
        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  
        return encodedMessage;
    }
}

module.exports = { EmailSender };