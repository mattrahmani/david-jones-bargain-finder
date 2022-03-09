const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Accessories category', () => {
        const category = "accessories";
        discount = process.env.DISCOUNT || 60;
        onSalePage.open('sale/bags-and-accessories');
        onSalePage.loadAllProducts(category);
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingItems();
        onSalePage.calculateDiscount(category);
    });
});