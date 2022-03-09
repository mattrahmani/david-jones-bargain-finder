const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Electrical category', () => {
        const category = "electrical";
        discount = process.env.DISCOUNT || 60;
        onSalePage.open('sale/electrical');
        onSalePage.loadAllProducts(category);
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingItems();
        onSalePage.calculateDiscount(category);
    });
});