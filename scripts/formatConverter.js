/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
    define(['N/ui/serverWidget', 'N/format'], function(serverWidget, format) {
        function parseAndFormatDateString() {
                    // Assuming Date format is MM/DD/YYYY
                    var initialFormattedDateString = "07/28/2015";
                    var parsedDateStringAsRawDateObject = format.parse({
                        value: initialFormattedDateString,
                        type: format.Type.DATE
                    });
                    var formattedDateString = format.format({
                        value: parsedDateStringAsRawDateObject,
                        type: format.Type.DATE
                    });
                    return [parsedDateStringAsRawDateObject, formattedDateString];
                }
                function onRequest(context) {
                    var data = parseAndFormatDateString();
            
                    var form = serverWidget.createForm({
                        title: "Date"
                    });
            
                    var fldDate = form.addField({
                        type: serverWidget.FieldType.DATE,
                        id: "date",
                        label: "Date"
                    });
                    fldDate.defaultValue = data[0];
            
                    var fldString = form.addField({
                        type: serverWidget.FieldType.TEXT,
                        id: "dateastext",
                        label: "Date as text"
                    });
                    fldString.defaultValue = data[1];
            
                    context.response.writePage(form);
                }
                return {
                    onRequest: onRequest
                };
            }); 
            
                      