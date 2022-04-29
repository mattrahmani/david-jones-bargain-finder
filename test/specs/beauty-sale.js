const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(1);

    it('should find bargains from Beauty category', () => {
        const category = "beauty";
        discount = process.env.DISCOUNT || 60;
        onSalePage.open('sale/beauty');
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.getExistingScreenshots();
        onSalePage.catchBargains(category);
        onSalePage.verifyAllPagesAreScanned(category);
    });
});