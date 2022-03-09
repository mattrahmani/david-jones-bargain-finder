const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(1);
    
    it('should find bargains from Men category', () => {
        const category = "men";
        discount = process.env.DISCOUNT || 70;
        onSalePage.open('sale/men');
        onSalePage.loadAllProducts(category);
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingItems();
        onSalePage.calculateDiscount(category);
    });
});