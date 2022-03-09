const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', () => {

    it('should find bargains from Beauty category', () => {
        const category = "beauty";
        discount = process.env.DISCOUNT || 60;
        onSalePage.open('sale/beauty');
        onSalePage.loadAllProducts(category);
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingItems();
        onSalePage.calculateDiscount(category);
    });
});