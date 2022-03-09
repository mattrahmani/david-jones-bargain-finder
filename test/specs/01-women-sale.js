const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Women category', () => {
        const category = "women";
        discount = process.env.DISCOUNT || 70;
        onSalePage.open('sale/women');
        onSalePage.loadAllProducts(category);
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingItems();
        onSalePage.calculateDiscount(category);
    });
});