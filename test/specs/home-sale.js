const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(1);

    it('should find bargains from Home category', () => {
        const category = "home";
        discount = process.env.DISCOUNT || 60;
        onSalePage.open('sale/home-and-food');
        onSalePage.loadAllProducts(category);
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingItems();
        onSalePage.calculateDiscount(category);
    });
});