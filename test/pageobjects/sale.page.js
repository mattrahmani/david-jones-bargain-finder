const { assert } = require('chai');
const Page = require('./page');
const fs = require('fs');

// let itemCounts;
// let saleRange1 = [];
// let saleRange2 = [];
// let saleRange3 = [];
// let priceNow, priceWas, itemBrand, itemName, name, filePath;
// let i = 0;
// let itemsCalculated = 0;

class SalePage extends Page {
    get loadMoreBtn() {return $('a[class="btn load-products loading-button externalLink"]')}
    get loadCompletedBtn() {return $('a.progress-completed')}
    get noMoreResults() {return $('a.btn.load-products.loading-button.externalLink.disabled')}
    get items() {return $$('div.item')}
    get productLoaderButton() {return $('div.product-loader-button a')}
    get backTopButton() {return $('div#back-top')}

    loadAllProducts(category) {
        let j=1;
        for (let i=0; i<100; i++) {
            browser.deleteAllCookies();
            console.log(category.concat(i+1));
            if (this.noMoreResults.isExisting()) {
                break;
            }
            else {
                this.loadMoreBtn.click();
                j++;
                browser.waitUntil(() => $('div.page-'+j+'.isUpdated').isExisting());
            }
        }
        this.backTopButton.click();
    }

    calculateDiscount() {
        let priceNow, priceWas, itemBrand, itemName, name, filePath, itemTxt;
        let itemsCalculated = 0;
        let itemCounts = this.items.length;
        this.items.forEach(item => {
            itemsCalculated++;
            item.scrollIntoView();
            browser.waitUntil(() => item.isDisplayedInViewport());
            itemTxt = item.getHTML();
            if (itemTxt.includes('price was')) {
                priceWas = item.$('p.price.was span.price-display').getText();
                priceNow = item.$('p.price.now span.price-display').getText();
                let percent = (1-(this.getNumber(priceNow)/this.getNumber(priceWas)))*100;
                // if (50<=percent && percent<70) {
                //     // saleRange1.push(name);
                //     if (itemTxt.includes('EXTRA')) {
                //         itemBrand = item.$('div.item-brand').getText();
                //         itemName = item.$('div.item-detail h4 a').getText();
                //         name = itemBrand + ' ' + itemName;
                //         name = name.split('.').join('').split('/').join('');
                //         filePath = 'screenshots/60to70/' + name + '.png';
                //         if (!fs.existsSync(filePath)) {
                //             browser.highlightItem(item.$('div.item-brand'));
                //             browser.saveScreenshot(filePath);
                //             browser.removeHighlight(item.$('div.item-brand'));
                //         }
                //     }
                // }
                if (70<=percent && percent<80) {
                    itemBrand = item.$('div.item-brand').getText();
                    itemName = item.$('div.item-detail h4 a').getText();
                    name = itemBrand + ' ' + itemName;
                    // saleRange2.push(name);
                    name = name.split('.').join('').split('/').join('');
                    filePath = 'screenshots/70to80/' + name + '.png';
                    if (!fs.existsSync(filePath)) {
                        browser.highlightItem(item.$('div.item-brand'));
                        browser.saveScreenshot(filePath);
                        browser.removeHighlight(item.$('div.item-brand'));
                    }
                }
                if (80<=percent) {
                    itemBrand = item.$('div.item-brand').getText();
                    itemName = item.$('div.item-detail h4 a').getText();
                    name = itemBrand + ' ' + itemName;
                    // saleRange3.push(name);
                    name = name.split('.').join('').split('/').join('');
                    filePath = 'screenshots/over80/' + name + '.png';
                    if (!fs.existsSync(filePath)) {
                        browser.highlightItem(item.$('div.item-brand'));
                        browser.saveScreenshot(filePath);
                        browser.removeHighlight(item.$('div.item-brand'));
                    }
                }
                
            }
        })
        assert.equal(itemCounts, itemsCalculated, '!!!!! Some items are not calculated !!!!!');
    }

    getNumber(text) {
        return Number(text.slice(1).split(',').join(''));
    }

    logSaleItems(category) {
        // console.log('\n=====>>>' + category + ' sale list between 60%-70%:');
        // for (let i=0; i<saleRange1.length; i++) {
        //     console.log('=====>>> ' + i + ' - ' + saleRange1[i]);
        // }
        console.log('Number of Items in ' + category + ' =====>>> ' + itemCounts) + '\n';
    }
}

module.exports = new SalePage();