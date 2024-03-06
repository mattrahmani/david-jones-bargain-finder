const onSalePage = require('../pageobjects/sale-page');

describe('David Jones bargain finder', function () {
    // this.retries(2);

    it('should find bargains from Electrical category', () => {
        const category = "electrical";
        discount = process.env.DISCOUNT || 50;
        onSalePage.open('sale/electrical');
        onSalePage.confirmScreenshotFolderIsExisting(category);
        onSalePage.catchBargains(category);
        onSalePage.verifyAllPagesAreScanned(category);
    });
});