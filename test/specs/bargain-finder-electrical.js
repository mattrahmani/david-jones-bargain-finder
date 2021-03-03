const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Electrical category', () => {
        SalePage.open('sale/electrical');
        SalePage.loadAllProducts('Electrical');
        SalePage.calculateDiscount('Electrical');
        console.log('=====>>> Electrical bargains search is finished <<<=====\n')
    });
});