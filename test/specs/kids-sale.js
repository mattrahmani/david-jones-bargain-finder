const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(1);

    it('should find bargains from Kids category', () => {
        const category = "kids";
        discount = process.env.DISCOUNT || 60;
        onSalePage.open('sale/kids');
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingScreenshots();
        onSalePage.catchBargains(category);
        onSalePage.verifyAllPagesAreScanned(category);
    });
});