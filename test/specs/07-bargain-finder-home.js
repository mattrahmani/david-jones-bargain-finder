const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Home category', () => {
        SalePage.open('sale/home-and-food');
        SalePage.loadAllProducts('Home');
        SalePage.calculateDiscount();
        SalePage.logSaleItems('Home');
        console.log('=====>>> Home bargains search is finished <<<=====\n')
    });
});