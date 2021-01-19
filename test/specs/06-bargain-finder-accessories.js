const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Accessories category', () => {
        SalePage.open('sale/bags-and-accessories');
        SalePage.loadAllProducts('Accessories');
        SalePage.calculateDiscount();
        SalePage.logSaleItems('Accessories');
        console.log('=====>>> Accessories bargains search is finished <<<=====\n')
    });
});