const { assert } = require('chai');
const Page = require('./page');
const fs = require('fs');

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
                this.loadMoreBtn.scrollIntoView();
                this.loadMoreBtn.click();
                j++;
                browser.waitUntil(() => $('div.page-'+j+'.isUpdated').isExisting());
            }
        }
        this.backTopButton.click();
    }

    calculateDiscount() {

        let priceNow, priceWas, itemBrand, itemName, name, filePath, percent, discount, discountRate, pricingHtml, offerText;
        let itemsCalculated = 0;
        let itemCounts = this.items.length;

        this.items.forEach(item => {
            itemsCalculated++;
            if (item.getAttribute('class') == 'item type-0 isUpdated') {
                pricingHtml = item.$('div.pricing').getHTML();
                if (pricingHtml.includes('was')) {
                    priceWas = this.getNumber(item.$('p.price.was span.price-display').getText());
                    priceNow = this.getNumber(item.$('p.price.now span.price-display').getText());
                    if (item.$('div.item-detail').getText().includes('SAVE')) {
                        discount = (item.$('p.offer').getText().split(' '))[1];
                        discountRate = discount.slice(0,2);
                        priceNow = priceNow - (priceNow * discountRate/100);
                    }
                    if (item.$('div.item-detail').getText().includes('EXTRA')) {
                        offerText = item.$('p.offer').getText();
                        console.log(offerText);
                        discount = (item.$('p.offer').getText().split(' '))[1];
                        discountRate = discount.slice(0,2);
                        priceNow = priceNow - (priceNow * discountRate/100);
                    }
                
                    percent = ((1-(priceNow/priceWas))*100).toFixed(0);

                    if (65<=percent && percent<70) {
                        
                        itemBrand = item.$('div.item-brand').getText();
                        itemName = item.$('div.item-detail h4 a').getText();
                        name = itemBrand + ' ' + itemName;
                        name = name.split('.').join('').split('/').join('');
                        filePath = 'screenshots/60to70/' + percent + ' ' + name + '.png';
                        if (!fs.existsSync(filePath)) {
                            item.scrollIntoView();
                            browser.highlightItem(item);
                            browser.saveScreenshot(filePath);
                            browser.removeHighlight(item);
                        }
                    }
                    if (70<=percent && percent<80) {
                        itemBrand = item.$('div.item-brand').getText();
                        itemName = item.$('div.item-detail h4 a').getText();
                        name = itemBrand + ' ' + itemName;
                        name = name.split('.').join('').split('/').join('');
                        filePath = 'screenshots/70to80/' + percent + ' ' + name + '.png';
                        if (!fs.existsSync(filePath)) {
                            item.scrollIntoView();
                            browser.highlightItem(item);
                            browser.saveScreenshot(filePath);
                            browser.removeHighlight(item);
                        }
                    }
                    if (80<=percent) {
                        itemBrand = item.$('div.item-brand').getText();
                        itemName = item.$('div.item-detail h4 a').getText();
                        name = itemBrand + ' ' + itemName;
                        name = name.split('.').join('').split('/').join('');
                        filePath = 'screenshots/over80/' + percent + ' ' + name + '.png';
                        if (!fs.existsSync(filePath)) {
                            item.scrollIntoView();
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

    logSaleItems(category) {
        // console.log('\n=====>>>' + category + ' sale list between 60%-70%:');
        // for (let i=0; i<saleRange1.length; i++) {
        //     console.log('=====>>> ' + i + ' - ' + saleRange1[i]);
        // }
        console.log('Number of Items in ' + category + ' =====>>> ' + itemCounts) + '\n';
    }
}

module.exports = new SalePage();