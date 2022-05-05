const { assert } = require('chai');
const Page = require('./page');
const fs = require('fs');
const path = require('path');
let screenshotSubFolder, lastPage, existingItems, today, currentPage, itemsCalculated = 0;

class onSalePage extends Page {
    get items() { return $$('div.item') }
    get lastPageButton() { return $('div.bottom li.visible-pagination:nth-last-child(2) a') }
    get nextBtn() { return $('div.bottom li.next a') }
    get pageLoad() { return $('body[class*=loading]') }
    get noResultsFound() { return $('div.product-no-results') }
    get backTopBtn() { return $('div#back-top') }

    catchBargains(category) {
        this.getTodayDate();
        lastPage = Number(this.lastPageButton.getText());
        currentPage = 1;

        while (currentPage <= lastPage) {
            let firstProductID = this.items[0].getAttribute('data-pdid');
            console.log(`${category} --->> page ${currentPage} of ${lastPage}`);
            this.calculateDiscount(category);
            currentPage++;
            if (this.nextBtn.isExisting()) {
                this.nextBtn.scrollIntoView();
                this.nextBtn.waitForClickable();
                this.nextBtn.click();
                this.backTopBtn.waitForDisplayed({ reverse: true });
                if (this.noResultsFound.isExisting() || !this.items[0].isExisting()) {
                    currentPage = lastPage + 1;
                } else {
                    browser.waitUntil(() => firstProductID != this.items[0].getAttribute('data-pdid'), { timeout: 20000 })
                }
            }
        };
    }

    confirmScreenshotFolderIsExisting(category) {
        let screenshotMainFolder = 'screenshots/';
        if (!fs.existsSync(screenshotMainFolder)) {
            fs.mkdirSync(screenshotMainFolder);
        }
        screenshotSubFolder = 'screenshots/' + category + '/';
        if (!fs.existsSync(screenshotSubFolder)) {
            fs.mkdirSync(screenshotSubFolder);
            return screenshotSubFolder;
        }
    }

    calculateDiscount(category) {

        let priceNow, priceWas, itemBrand, itemName, name, filePath, percent, discountTxt,
            discountRate, pricingHtml, itemDetail;

        this.items.forEach(item => {
            try {
                item.waitForDisplayed();

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
                                browser.waitUntil(() => {
                                    item.scrollIntoView();
                                    return this.isInViewport(item);
                                }, { timeout: 30000 });
                                browser.waitUntil(() => item.$('figure img').isDisplayed());
                                this.drawHighlight(item);
                                browser.saveScreenshot(filePath);
                                this.removeHighlight(item);
                            }
                        }
                    }
                }
            } catch (error) {
                console.log('An error happened while scanning --->> ' + name);
                if (item.isExisting()) {
                    item.scrollIntoView();
                    this.drawHighlight(item);
                    filePath = 'errorScreenshot/' + category + ' error.png';
                    browser.saveScreenshot(filePath);
                    this.removeHighlight(item);
                } else {
                    filePath = 'errorScreenshot/' + category + ' error.png';
                    browser.saveScreenshot(filePath);
                }
                throw error;
            }

        })
    }

    verifyAllPagesAreScanned(category) {
        assert.equal(currentPage - 1, lastPage, '=====>>> Some pages are not scanned <<<=====');
        console.log('=====>>> ' + category + ' bargains search is finished after scanning ' + itemsCalculated + ' items <<<=====\n')
    }

    getNumber(text) {
        return Number(text.slice(1).split(',').join(''));
    }

    getExistingScreenshots() {
        existingItems = [];
        const directoryPath = path.join(screenshotSubFolder);
        fs.readdir(directoryPath, function (err, files) {
            files.forEach(function (file) {
                let fileName = file.toString().split(' ').slice(1).join(' ');
                existingItems.push(fileName);
            });
        });

        return existingItems;
    }

    getTodayDate() {
        let date = new Date();
        today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    }

    // getTotalItems() {
    //     totalItems = $('span.search-numbers').getText();
    //     console.log(`Total items --->> ${totalItems}`);
    //     return totalItems;
    // }

    isInViewport(item) {
        return browser.execute(function (element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }, item)
    }


}

module.exports = new onSalePage();