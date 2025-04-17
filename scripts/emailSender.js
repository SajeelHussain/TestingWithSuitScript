/**
 * @NApiVersion 2.1
 */

// This script sends an email with an attachment.

define(['N/email', 'N/record', 'N/file'], function(email, record, file) {
    const senderId = -515;
    const recipientEmail = 'notify@myCompany.com';
    let timeStamp = new Date().getUTCMilliseconds();

    let recipient = record.create({
        type: record.Type.CUSTOMER,
        isDynamic: true
    });
    recipient.setValue({
        fieldId: 'subsidiary',
        value: '1'
    });
    recipient.setValue({
        fieldId: 'companyname',
        value: 'Test Company' + timeStamp
    });
    recipient.setValue({
        fieldId: 'email',
        value: recipientEmail
    });

    let recipientId = recipient.save();

    let fileObj = file.load({
        id: 88
    });

    email.send({
        author: senderId,
        recipients: recipientId,
        subject: 'Test Sample Email Module',
        body: 'email body',
        attachments: [fileObj],
        relatedRecords: {
            entityId: recipientId,
            customRecord: {
                id: 123,
                recordType: 'customrecord_type'
            }
        }
    });
}); 