const Page = require('./page');

let itemCounts;
/**
 * sub page containing specific selectors and methods for a specific page
 */
class SalePage extends Page {
    get loadMoreBtn() {return $('span*=Load next')}
    get noMoreResults() {return $('span=No more results')}
    get items() {return $$('div.item')}

    loadAllProducts() {
        for (let i=0; i<100; i++) {
            if (this.noMoreResults.isDisplayed()) {
                break;
            }
            else {
                this.loadMoreBtn.waitForClickable();
                this.loadMoreBtn.click();
                browser.pause(500)
            }
        }
        itemCounts = this.items.length;
    }
    
}

module.exports = new SalePage();
