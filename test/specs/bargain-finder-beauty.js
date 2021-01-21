const SalePage = require('../pageobjects/sale.page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Beauty category', () => {
        SalePage.open('sale/beauty');
        SalePage.loadAllProducts('Beauty');
        SalePage.calculateDiscount();
        // SalePage.logSaleItems('Beauty');
        console.log('=====>>> Beauty bargains search is finished <<<=====\n')
    });
});