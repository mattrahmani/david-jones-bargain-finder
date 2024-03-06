const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    this.retries(2);

    it('should find bargains from Beauty category', () => {
        const category = "beauty";
        discount = process.env.DISCOUNT || 60;
        onSalePage.open('sale/beauty');
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.catchBargains(category);
        onSalePage.verifyAllPagesAreScanned(category);
    });
});