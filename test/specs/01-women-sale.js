const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(1);

    it('should find bargains from Women category', () => {
        const category = "women";
        discount = process.env.DISCOUNT || 70;
        onSalePage.open('sale/women');
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingScreenshots();
        onSalePage.catchBargains(category);
        onSalePage.verifyAllPagesAreScanned(category);
    });
});