const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Shoes category', () => {
        SalePage.open('sale/shoes');
        // SalePage.loadAllProducts('Shoes');
        SalePage.calculateDiscount('Shoes');
        console.log('=====>>> Shoes bargains search is finished <<<=====\n')
    });
});