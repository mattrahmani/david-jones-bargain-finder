const { onSalesPage } = require("../support/page-Objects/salePage");

describe('David Jones bargain finder', () => {

    it('should find bargains from Electrical category', () => {
        onSalesPage.navigateTo('sale/electrical');
        onSalesPage.loadAllProducts('Electrical');
        // onSalesPage.calculateDiscount('Electrical');
        // console.log('=====>>> Electrical bargains search is finished <<<=====\n')
    });
});