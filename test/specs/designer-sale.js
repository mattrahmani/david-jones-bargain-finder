const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(1);

    it('should find bargains from Designer category', () => {
        const category = "designer";
        discount = process.env.DISCOUNT || 70;
        onSalePage.open('sale/designer-sale');
        onSalePage.loadAllProducts(category);
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingItems();
        onSalePage.calculateDiscount(category);
    });
});