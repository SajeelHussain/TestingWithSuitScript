define(['N/currency'], function(currency) {
    function getUSDFromCAD(amount, date) {
        if (!amount) return 0;
        var rate = currency.exchangeRate({
            source: 'CAD',
            target: 'USD',
            date: date
        });
        return amount * rate;
    }
    return {
        getUSDFromCAD: getUSDFromCAD
    };
});
