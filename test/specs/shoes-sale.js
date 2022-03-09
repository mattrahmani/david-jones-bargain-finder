const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Shoes category', () => {
        const category = "shoes";
        discount = process.env.DISCOUNT || 70;
        onSalePage.open('sale/shoes');
        onSalePage.loadAllProducts(category);
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingItems();
        onSalePage.calculateDiscount(category);
    });
});