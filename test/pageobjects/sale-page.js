const { assert } = require('chai');
const Page = require('./page');
const fs = require('fs');
const path = require('path');
let screenshotSubFolder, totalPages, totalItems, existingItems, today;

class onSalePage extends Page {
    get loadMoreBtn() { return $('a[class="btn load-products loading-button externalLink"]') }
    get noMoreResults() { return $('a.btn.load-products.loading-button.externalLink.disabled') }
    get items() { return $$('div.item') }
    // get items() {return $$('div.item>div.item-detail')}
    get backTopButton() { return $('div#back-top') }
    get totalItemsElement() { return $('span.search-numbers') }

    loadAllProducts(category) {
        this.calculateTotalPages();
        let j = 2, i;
        for (i = 0; i < totalPages; i++) {
            console.log(category + ' --->> loading page ' + (i+1) + ' of ' + totalPages);
            if (this.noMoreResults.isExisting()) {
                break;
            }
            else {
                this.loadMoreBtn.scrollIntoView(false);
                this.loadMoreBtn.waitForClickable();
                this.loadMoreBtn.click();
                browser.waitUntil(() => $$('div.page-' + j + '.isUpdated').length > 0, { timeout: 150000 })
                j++;
            }
        }
        expect(this.noMoreResults.isExisting());
        assert.equal(i+1, totalPages, '!!!!! Some pages are still not loaded successfully !!!!!');
        this.backTopButton.scrollIntoView();
        this.backTopButton.waitForClickable();
        this.backTopButton.click();
    }

    confirmScreenshotFolderIsExisting(category) {
        let screenshotMainFolder = 'screenshots/';
        if (!fs.existsSync(screenshotMainFolder)) {
            fs.mkdirSync(screenshotMainFolder);
            // return screenshotFolder;
        }
        screenshotSubFolder = 'screenshots/' + category + '/';
        if (!fs.existsSync(screenshotSubFolder)) {
            fs.mkdirSync(screenshotSubFolder);
            return screenshotSubFolder;
        }
    }

    calculateDiscount(category) {

        let priceNow, priceWas, itemBrand, itemName, name, filePath, percent, discountTxt,
            discountRate, pricingHtml, itemDetail, itemsCalculated = 0,
            itemCounts = this.items.length;
        this.getTodayDate();
        this.items.forEach(item => {
            try {
                itemsCalculated++;
                if (item.getAttribute('class').startsWith('item')) {
                    pricingHtml = item.$('div.pricing').getHTML(false);
                    if (pricingHtml.includes('was')) {
                        priceWas = this.getNumber(item.$('p.price.was span.price-display').getText());
                        priceNow = this.getNumber(item.$('p.price.now span.price-display').getText());
                        itemDetail = item.$('div.item-detail').getText();
                        if (itemDetail.includes('SAVE') && itemDetail.includes('%')) {
                            discountTxt = (item.$('p.offer').getText().split(' '))[1];
                            discountRate = discountTxt.slice(0, 2);
                            priceNow = priceNow - (priceNow * discountRate / 100);
                        }
                        if (itemDetail.includes('EXTRA') && itemDetail.includes('%')) {
                            discountTxt = (item.$('p.offer').getText().slice(-3));
                            discountRate = discountTxt.slice(0, 2);
                            priceNow = priceNow - (priceNow * discountRate / 100);
                        }

                        percent = ((1 - (priceNow / priceWas)) * 100).toFixed(0);

                        if (percent >= Number(discount)) {
                            itemBrand = item.$('div.item-brand').getText();
                            itemName = item.$('div.item-detail h4 a').getText();
                            name = itemBrand + ' ' + itemName;
                            name = name.split('.').join('').split('/').join('');

                            priceNow = Number(priceNow).toFixed(0);
                            let fileName = percent + '% Off (Now $' + priceNow + ') ' + name + '.png';
                            filePath = screenshotSubFolder + today + '--> ' + percent + '% Off (Now $' + priceNow + ') ' + name + '.png';
                            if (!existingItems.includes(fileName)) {
                                item.scrollIntoView(false);
                                browser.waitUntil(() => item.$('div.pricing').isDisplayedInViewport());
                                item.$('img').isDisplayed();
                                this.drawHighlight(item);
                                browser.saveScreenshot(filePath);
                                this.removeHighlight(item);
                            }
                        }
                    }
                }
            } catch (error) {
                console.log('An error happened while scanning --->> ' + name);
                item.scrollIntoView();
                this.drawHighlight(item);
                filePath = 'errorScreenshot/' + category + ' error.png';
                browser.saveScreenshot(filePath);
                this.removeHighlight(item);
                throw error;
            }

        })
        assert.equal(itemCounts, itemsCalculated, '!!!!! Some items are not calculated !!!!!');
        console.log('\n=====>>> ' + category + ' bargains search is finished after scanning ' + totalItems + ' items <<<=====\n')
    }

    getNumber(text) {
        return Number(text.slice(1).split(',').join(''));
    }

    getItemsCount() {
        return this.items.length;
    }

    calculateTotalPages() {
        totalItems = Number(this.totalItemsElement.getText());
        totalPages = Math.floor((totalItems / Number(this.loadMoreBtn.getText().split(' ')[2]))) + 1;
    }

    getExistingItems() {
        existingItems = [];
        const directoryPath = path.join(screenshotSubFolder);
        fs.readdir(directoryPath, function (err, files) {
            files.forEach(function (file) {
                let fileName = file.toString().split(' ').slice(1).join(' ');
                existingItems.push(fileName);
            });
            // console.log('********: ' +existingItems.length);
        });

        return existingItems;
    }

    getTodayDate() {
        let date = new Date();
        today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    }
}

module.exports = new onSalePage();