const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Women category', () => {
        SalePage.open('sale/women');
        SalePage.loadAllProducts();
        SalePage.calculateDiscount();
        SalePage.logSaleItems('Women');
        console.log('=====>>> Women bargains search is finished <<<=====\n')
    });
});