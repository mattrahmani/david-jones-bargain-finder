const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Designer category', () => {
        SalePage.open('sale/designer-sale');
        SalePage.loadAllProducts('Designer');
        SalePage.calculateDiscount();
        // SalePage.logSaleItems('Designer');
        console.log('=====>>> Designer bargains search is finished <<<=====\n')
    });
});