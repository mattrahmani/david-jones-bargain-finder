const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(2);

    it('should find bargains from Home category', () => {
        const category = "home";
        discount = process.env.DISCOUNT || 60;
        onSalePage.open('sale-and-offers/home');
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.catchBargains(category);
        onSalePage.verifyAllPagesAreScanned(category);
    });
});