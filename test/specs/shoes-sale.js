const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(2);

    it('should find bargains from Shoes category', () => {
        const category = "shoes";
        discount = process.env.DISCOUNT || 70;
        onSalePage.open('sale/shoes');
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.catchBargains(category);
        onSalePage.verifyAllPagesAreScanned(category);
    });
});