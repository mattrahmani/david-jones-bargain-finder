const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Kids category', () => {
        SalePage.open('sale/kids');
        SalePage.loadAllProducts('Kids');
        SalePage.calculateDiscount();
        // SalePage.logSaleItems('Kids');
        console.log('=====>>> Kids bargains search is finished <<<=====\n')
    });
});