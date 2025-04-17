jest.mock('N/email');
jest.mock('N/record');
jest.mock('N/file');

const email = require('N/email');
const record = require('N/record');
const file = require('N/file');

describe('Email sending script', () => {
    let mockRecord, mockFile;

    beforeAll(() => {
        global.define = jest.fn((deps, factory) => {
            factory(email, record, file);
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocking customer record creation
        mockRecord = {
            setValue: jest.fn(),
            save: jest.fn(() => 456) // fake recipientId
        };

        record.create = jest.fn(() => mockRecord);

        // Mocking file load
        mockFile = { name: 'mock.pdf' };
        file.load = jest.fn(() => mockFile);

        // Mock email send
        email.send = jest.fn();
    });

    it('should create a customer, load a file, and send an email', () => {
        // Load and execute the main script
        require('../scripts/emailSender'); // use the correct filename

        // 1. Customer created correctly
        expect(record.create).toHaveBeenCalledWith({
            type: record.Type.CUSTOMER,
            isDynamic: true
        });
        expect(mockRecord.setValue).toHaveBeenCalledWith({
            fieldId: 'subsidiary',
            value: '1'
        });
        expect(mockRecord.setValue).toHaveBeenCalledWith(expect.objectContaining({
            fieldId: 'companyname'
        }));
        expect(mockRecord.setValue).toHaveBeenCalledWith({
            fieldId: 'email',
            value: 'notify@myCompany.com'
        });
        expect(mockRecord.save).toHaveBeenCalled();

        // 2. File loaded correctly
        expect(file.load).toHaveBeenCalledWith({ id: 88 });

        // 3. Email sent correctly
        expect(email.send).toHaveBeenCalledWith(expect.objectContaining({
            author: -515,
            recipients: 456,
            subject: 'Test Sample Email Module',
            body: 'email body',
            attachments: [mockFile],
            relatedRecords: expect.any(Object)
        }));
    });
});
