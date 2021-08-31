const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Men category', () => {
        SalePage.open('sale/men');
        // SalePage.loadAllProducts('Men');
        SalePage.calculateDiscount('Men');
        console.log('=====>>> Men bargains search is finished <<<=====\n')
    });
});