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
            // this.loadCompletedBtn.waitForExist();
        }
    }

    calculateDiscount() {
        let priceNow, priceWas, itemBrand, itemName, name, filePath, itemTxt;
        let itemsCalculated = 0;
        let itemCounts = this.items.length;
        this.items.forEach(item => {
            itemsCalculated++;
            item.scrollIntoView();
            itemTxt = item.getHTML();
            if (itemTxt.includes('price was')) {
                priceWas = item.$('p.price.was span.price-display').getText();
                priceNow = item.$('p.price.now span.price-display').getText();
                let percent = (1-(this.getNumber(priceNow)/this.getNumber(priceWas)))*100;
                if (50<=percent && percent<70) {
                    // itemBrand = item.$('div.item-brand').getText();
                    // itemName = item.$('div.item-detail h4 a').getText();
                    // name = itemBrand + ' ' + itemName;
                    // saleRange1.push(name);
                    if (itemTxt.includes('EXTRA')) {
                        itemBrand = item.$('div.item-brand').getText();
                        itemName = item.$('div.item-detail h4 a').getText();
                        name = itemBrand + ' ' + itemName;
                        item.$('div.item-brand').doubleClick();
                        name = name.split('.').join('').split('/').join('');
                        filePath = 'screenshots/60to70/' + name + '.png';
                        if (!fs.existsSync(filePath)) {
                            browser.saveScreenshot(filePath);
                        }
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
                    if (!fs.existsSync(filePath)) {
                        browser.saveScreenshot(filePath);
                    }
                }
                if (80<=percent) {
                    itemBrand = item.$('div.item-brand').getText();
                    itemName = item.$('div.item-detail h4 a').getText();
                    name = itemBrand + ' ' + itemName;
                    // saleRange3.push(name);
                    item.$('div.item-brand').doubleClick();
                    name = name.split('.').join('').split('/').join('');
                    filePath = 'screenshots/over80/' + name + '.png';
                    if (!fs.existsSync(filePath)) {
                        browser.saveScreenshot(filePath);
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

    // newFinder(category) {
    //     let page = 1;
    //     for (let j=0; j<100; j++) {
    //         browser.deleteAllCookies();
    //         browser.delete
    //         console.log(category + page);
    //         this.itemFinder();
            
    //         if (this.loadMoreBtn.isExisting()) {
    //             this.loadMoreBtn.click();
    //             browser.pause(1000);
    //             page++;
    //         }
    //         else {
    //             itemCounts = this.items.length;
    //             break;
    //         }
    //     }
    //     assert.equal(itemCounts, itemsCalculated, '!!!!! Some items are not calculated !!!!!');
    // }

    // itemFinder() {
    //     for (i; i<this.items.length; i++) {
    //         // console.log('i: ' + i);
    //         // console.log('Items: ' + this.items.length);
    //         itemsCalculated++;
    //         this.items[i].scrollIntoView();
    //         // this.items[i].waitForDisplayed();
    //         let itemTxt = this.items[i].getHTML();
    //         if (itemTxt.includes('price now') && itemTxt.includes('price was')) {
    //             priceWas = this.items[i].$('p.price.was span.price-display').getText();
    //             priceNow = this.items[i].$('p.price.now span.price-display').getText();
    //             let percent = (1-(this.getNumber(priceNow)/this.getNumber(priceWas)))*100;

    //             if (50<=percent && percent<70) {
    //                 itemBrand = this.items[i].$('div.item-brand').getText();
    //                 itemName = this.items[i].$('div.item-detail h4 a').getText();
    //                 name = itemBrand + ' ' + itemName;
    //                 // saleRange1.push(name);
    //                 if (itemTxt.includes('EXTRA')) {
    //                     this.items[i].$('div.item-brand').doubleClick();
    //                     name = name.split('.').join('').split('/').join('');
    //                     filePath = 'screenshots/60to70/' + name + '.png';
    //                     browser.saveScreenshot(filePath);
    //                 }
    //             }
    //             if (70<=percent && percent<80) {
    //                 itemBrand = this.items[i].$('div.item-brand').getText();
    //                 itemName = this.items[i].$('div.item-detail h4 a').getText();
    //                 name = itemBrand + ' ' + itemName;
    //                 // saleRange2.push(name);
    //                 this.items[i].$('div.item-brand').doubleClick();
    //                 name = name.split('.').join('').split('/').join('');
    //                 filePath = 'screenshots/70to80/' + name + '.png';
    //                 browser.saveScreenshot(filePath);
    //             }
    //             if (80<=percent) {
    //                 itemBrand = this.items[i].$('div.item-brand').getText();
    //                 itemName = this.items[i].$('div.item-detail h4 a').getText();
    //                 name = itemBrand + ' ' + itemName;
    //                 // saleRange3.push(name);
    //                 this.items[i].$('div.item-brand').doubleClick();
    //                 name = name.split('.').join('').split('/').join('');
    //                 filePath = 'screenshots/over80/' + name + '.png';
    //                 browser.saveScreenshot(filePath);
    //             }
    //         }
            
    //     }
    // }
}

module.exports = new SalePage();