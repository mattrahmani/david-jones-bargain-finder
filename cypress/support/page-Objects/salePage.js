let fileName, i = 0;

export class SalesPage {

    navigateTo(target) {
        cy.visit('./' + target);
        cy.url().should('contain', target);
    }

    loadAllProducts(category) {
        // cy.clearCookies();
        // for (let i = 0; i < 1000; i++) {
        // browser.deleteAllCookies();
        
        cy.get('div.product-loader-button a').then(loadButton => {
            cy.waitUntil(() => {
                cy.wrap(loadButton).invoke('attr', 'class').should('equal', 'btn load-products loading-button externalLink'), 
                cy.wrap(loadButton).click()
            })


        })
        // }
        // cy.get('div.product-loader-button a', {timeout: 20000}).invoke('attr', 'class').should()
        // .invoke('attr', 'class')/*.should('not.contain.value', 'disabled')*/
        //     .should('have.value', 'btn load-products loading-button externalLink')
        //     .then(loadButton => {
        //         console.log(category.concat(i));
        //         let btnTxt = loadButton.text();
        //         if (btnTxt.includes('Load next')) {
        //             cy.wrap(loadButton).click();
        //             i++;
        //             this.loadAllProducts(category);
        //         } else {
        //             cy.waitFor(cy.wrap(loadButton).invoke('text').should('contain', 'Styles Loaded'), { timeout: 20000 });
        //         }
        //     })
        // }
    }

    //     else {
    //         this.loadMoreBtn.scrollIntoView(false);
    //         this.loadMoreBtn.waitForClickable()
    //         // browser.waitUntil(() => {
    //         //     return this.loadMoreBtn.isDisplayed();
    //         // })
    //         this.loadMoreBtn.click();
    //         j++;
    //         browser.waitUntil(() => $$('div.page-' + j + '.isUpdated').length > 0)
    //     }
    // }
    // this.backTopButton.click();
    // }

    calculateDiscount(category) {
        let priceWas, priceNow, itemDetails, percent, itemBrand, itemName, name, discount, filePath, discountRate, itemsCalculated = 0;

        cy.get('div.item').each((item, index) => {
            itemsCalculated++;
            cy.wrap(item).find('div.pricing').then(pricing => {
                if (pricing.html().includes('was')) {
                    priceWas = this.getNumber(item.find('p.price.was span.price-display').text());
                    priceNow = this.getNumber(item.find('p.price.now span.price-display').text());
                    itemDetails = item.find('div.item-detail').text();
                    if (itemDetails.includes('SAVE') && itemDetails.includes('%')) {
                        discount = (item.find('p.offer').text().split(' '))[1];
                        discountRate = discount.slice(0, 2);
                        priceNow = priceNow - (priceNow * discountRate / 100);
                    }

                    if (itemDetails.includes('EXTRA') && itemDetails.includes('%')) {
                        discount = (item.find('p.offer').text().slice(-3));
                        discountRate = discount.slice(0, 2);
                        priceNow = priceNow - (priceNow * discountRate / 100);
                    }

                    percent = ((1 - (priceNow / priceWas)) * 100).toFixed(0);

                    if (percent >= 70) {
                        itemBrand = item.find('div.item-brand').text();
                        itemName = item.find('div.item-detail h4 a').text();
                        name = itemBrand + ' ' + itemName;
                        name = name.split('.').join('').split('/').join('');
                        fileName = percent + ' ' + name;
                        cy.wrap(item).trigger('mouseover');
                        filePath = 'cypress/screenshots/electrical.spec.js/' + fileName + '.png';
                        const file = '/Volumes/Work/Automation/DavidJonesBargainFinder/' + filePath;
                        // console.log('***********************************'+this.fileExists(file))
                        // if (cy.readFile(file).should('not.exist')) {
                        cy.screenshot(fileName, { capture: 'viewport', onBeforeScreenshot: this.drawHighlight(item) });
                        // /Volumes/Work/Automation/DavidJonesBargainFinder/cypress/screenshots/electrical.spec.js/50 Tefal FX202D Ultimate Fry Deluxe Airfryer.png
                        // }
                    }
                }
            })
        })
    }

    getNumber(text) {
        return Number(text.slice(1).split(',').join(''));
    }

    fileExists(file) {
        return cy.readFile(file);
    }


    showItem(ele) {
        cy.wrap(item).trigger('mouseover');
        // ele.scrollIntoView();
        // cy.wrap(ele).scrollIntoView().should('be.visible');
        this.drawHighlight(ele);
        cy.wait(100).screenshot(fileName, { capture: 'viewport' });
    }

    drawHighlight(element) {
        cy.get(element).then(ele => {
            ele.css('border', '4px solid magenta');
        })
        // browser.execute('arguments[0].style.outline = "#f00 solid 4px";', element);
    }

    removeHighlight(element) {
        cy.get(element).then(ele => {
            ele.css('border', '0px solid magenta');
        })
    }


}

export const onSalesPage = new SalesPage();