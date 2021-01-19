const { assert } = require('chai');
const Page = require('./page');

let itemCounts;
let saleRange1 = [];
let saleRange2 = [];
let saleRange3 = [];

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

    calculateDiscount() {
        let priceNow, priceWas, itemBrand, itemName, name, filePath;
        let itemsCalculated = 0;
        this.items.forEach(item => {
            itemsCalculated++;
            item.scrollIntoView(false);
            let itemTxt = item.getHTML();
            if (itemTxt.includes('price now') && itemTxt.includes('price was')) {
                priceWas = item.$('p.price.was span.price-display').getText();
                priceNow = item.$('p.price.now span.price-display').getText();
                let percent = (1-(this.getNumber(priceNow)/this.getNumber(priceWas)))*100;
                if (50<=percent && percent<70) {
                    itemBrand = item.$('div.item-brand').getText();
                    itemName = item.$('div.item-detail h4 a').getText();
                    name = itemBrand + ' ' + itemName;
                    saleRange1.push(name);
                    if (itemTxt.includes('EXTRA')) {
                        item.$('div.item-brand').doubleClick();
                        name = name.split('.').join('').split('/').join('');
                        filePath = 'screenshots/60to70/' + name + '.png';
                        browser.saveScreenshot(filePath);
                    }
                }
                if (70<=percent && percent<80) {
                    itemBrand = item.$('div.item-brand').getText();
                    itemName = item.$('div.item-detail h4 a').getText();
                    name = itemBrand + ' ' + itemName;
                    // saleRange2.push(name);
                    item.$('div.item-brand').doubleClick();
                    name = name.split('.').join('').split('/').join('');
                    filePath = 'screenshots/70to80/' + name + '.png';
                    browser.saveScreenshot(filePath);
                }
                if (80<=percent) {
                    itemBrand = item.$('div.item-brand').getText();
                    itemName = item.$('div.item-detail h4 a').getText();
                    name = itemBrand + ' ' + itemName;
                    // saleRange3.push(name);
                    item.$('div.item-brand').doubleClick();
                    name = name.split('.').join('').split('/').join('');
                    filePath = 'screenshots/over80/' + name + '.png';
                    browser.saveScreenshot(filePath);
                }
                
            }
        })
        assert.equal(itemCounts, itemsCalculated, '!!!!! Some items are not calculated !!!!!');
    }

    getNumber(text) {
        return Number(text.slice(1).split(',').join(''));
    }

    logSaleItems(category) {
        console.log('\n=====>>>' + category + ' sale list between 60%-70%:');
        for (let i=0; i<saleRange1.length; i++) {
            console.log('=====>>> ' + i + ' - ' + saleRange1[i]);
        }
        console.log('Number of Items in ' + category + ' =====>>> ' + items) + '\n';
    }
    
}

module.exports = new SalePage();