const { assert } = require('chai');
const Page = require('./page');
const fs = require('fs');

class SalePage extends Page {
    get loadMoreBtn() { return $('a[class="btn load-products loading-button externalLink"]') }
    get noMoreResults() { return $('a.btn.load-products.loading-button.externalLink.disabled') }
    get items() { return $$('div.item') }
    // get items() {return $$('div.item>div.item-detail')}
    get backTopButton() { return $('div#back-top') }

    loadAllProducts(category) {
        let j = 1;
        for (let i = 0; i < 1000; i++) {
            // browser.deleteAllCookies();
            console.log(category.concat(i + 1));
            if (this.noMoreResults.isExisting()) {
                break;
            }
            else {
                this.loadMoreBtn.scrollIntoView(false);
                this.loadMoreBtn.waitForClickable()
                // browser.waitUntil(() => {
                //     return this.loadMoreBtn.isDisplayed();
                // })
                this.loadMoreBtn.click();
                j++;
                browser.waitUntil(() => $$('div.page-' + j + '.isUpdated').length > 0)
            }
        }
        this.backTopButton.click();
    }

    // calculateDiscount(category) {

    //     let priceNow, priceWas, itemBrand, itemName, name, filePath, percent, discount, discountRate, pricingHtml, itemDetail, buttonText;
    //     let itemsCalculated = 0, i = 0;
    //     let itemCounts;


    //     do {
    //         for (i; i < this.items.length; i++) {
    //             itemCounts = this.items.length;
    //             itemsCalculated++;
    //             const item = this.items[i];
    //             if (item.getAttribute('class').startsWith('item')) {
    //                 pricingHtml = item.$('div.pricing').getHTML(false);
    //                 if (pricingHtml.includes('was')) {
    //                     priceWas = this.getNumber(item.$('p.price.was span.price-display').getText());
    //                     priceNow = this.getNumber(item.$('p.price.now span.price-display').getText());
    //                     itemDetail = item.$('div.item-detail').getText();
    //                     if (itemDetail.includes('SAVE') && itemDetail.includes('%')) {
    //                         discount = (item.$('p.offer').getText().split(' '))[1];
    //                         discountRate = discount.slice(0, 2);
    //                         priceNow = priceNow - (priceNow * discountRate / 100);
    //                     }
    //                     if (itemDetail.includes('EXTRA') && itemDetail.includes('%')) {
    //                         discount = (item.$('p.offer').getText().slice(-3));
    //                         discountRate = discount.slice(0, 2);
    //                         priceNow = priceNow - (priceNow * discountRate / 100);
    //                     }

    //                     percent = ((1 - (priceNow / priceWas)) * 100).toFixed(0);

    //                     if (percent >= 70) {

    //                         itemBrand = item.$('div.item-brand').getText();
    //                         itemName = item.$('div.item-detail h4 a').getText();
    //                         name = itemBrand + ' ' + itemName;
    //                         name = name.split('.').join('').split('/').join('');
    //                         filePath = 'screenshots/' + category + '/' + percent + ' ' + name + '.png';
    //                         if (!fs.existsSync(filePath)) {
    //                             item.scrollIntoView();
    //                             browser.waitUntil(() => {
    //                                 return item.isDisplayed();
    //                             });
    //                             browser.highlightItem(item);
    //                             browser.saveScreenshot(filePath);
    //                             browser.removeHighlight(item);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         if (this.loadMoreBtn.isExisting()) {
    //             browser.waitUntil(function () {
    //                 browser.$('a[class="btn load-products loading-button externalLink"]').scrollIntoView();
    //                 return browser.$('a[class="btn load-products loading-button externalLink"]').isDisplayedInViewport();
    //             }, { timeout: 120000 });
    //             buttonText = this.loadMoreBtn.getText();
    //             this.loadMoreBtn.click();
    //             browser.waitUntil(()=> {
    //                 return this.items.length != i;
    //             })
    //             // $('a.progress-completed').waitForExist({ timeout: 120000 })
    //             // $('a.progress-completed').waitForExist(true, { timeout: 120000 })
    //         } else {
    //             console.log('... ... ' + category + ' ' + buttonText);
    //             console.log('... ... Total items: ' + i);
    //             break;
    //         }
    //     } while (this.items.length > i);


    // assert.equal(itemCounts, itemsCalculated, '!!!!! Some items are not calculated !!!!!');
    // }
    calculateDiscount(category) {

        let priceNow, priceWas, itemBrand, itemName, name, filePath, percent, discount, discountRate, pricingHtml, itemDetail;
        let itemsCalculated = 0;
        let itemCounts = this.items.length;

        this.items.forEach(item => {
            itemsCalculated++;
            if (item.getAttribute('class').startsWith('item')) {
                pricingHtml = item.$('div.pricing').getHTML(false);
                if (pricingHtml.includes('was')) {
                    priceWas = this.getNumber(item.$('p.price.was span.price-display').getText());
                    priceNow = this.getNumber(item.$('p.price.now span.price-display').getText());
                    itemDetail = item.$('div.item-detail').getText();
                    if (itemDetail.includes('SAVE') && itemDetail.includes('%')) {
                        discount = (item.$('p.offer').getText().split(' '))[1];
                        discountRate = discount.slice(0, 2);
                        priceNow = priceNow - (priceNow * discountRate / 100);
                    }
                    if (itemDetail.includes('EXTRA') && itemDetail.includes('%')) {
                        discount = (item.$('p.offer').getText().slice(-3));
                        discountRate = discount.slice(0, 2);
                        priceNow = priceNow - (priceNow * discountRate / 100);
                    }

                    percent = ((1 - (priceNow / priceWas)) * 100).toFixed(0);

                    if (percent >= 70) {
                        itemBrand = item.$('div.item-brand').getText();
                        itemName = item.$('div.item-detail h4 a').getText();
                        name = itemBrand + ' ' + itemName;
                        name = name.split('.').join('').split('/').join('');
                        filePath = 'screenshots/' + category + '/' + percent + ' ' + name + '.png';
                        if (!fs.existsSync(filePath)) {
                            item.scrollIntoView();
                            browser.waitUntil(() => item.$('img').isDisplayed());
                            browser.highlightItem(item);
                            browser.saveScreenshot(filePath);
                            browser.removeHighlight(item);
                        }
                    }
                }
            }
        })

        assert.equal(itemCounts, itemsCalculated, '!!!!! Some items are not calculated !!!!!');
    }

    getNumber(text) {
        return Number(text.slice(1).split(',').join(''));
    }

    getItemsCount() {
        return this.items.length;
    }
}

module.exports = new SalePage();