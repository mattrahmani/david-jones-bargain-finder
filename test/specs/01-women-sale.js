const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(2);

    it('should find bargains from Women category', () => {
        const category = "women";
        discount = process.env.DISCOUNT || 70;
        onSalePage.open('sale/women');
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.catchBargains(category);
        onSalePage.verifyAllPagesAreScanned(category);
    });
});