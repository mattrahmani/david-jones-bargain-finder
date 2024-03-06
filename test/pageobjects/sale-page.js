const { assert } = require("chai");
const Page = require("./page");
const fs = require("fs");
const path = require("path");
let screenshotSubFolder,
  lastPage,
  existingItems = [],
  today,
  currentPage,
  itemsCalculated = 0,
  totalItems;

class onSalePage extends Page {
  get items() {
    return $("div.products").$$("div.item");
  }
  get lastPageButton() {
    return $("div.bottom li.visible-pagination:nth-last-child(2) a");
  }
  get nextBtn() {
    return $("div.bottom li.next a");
  }
  get pageLoad() {
    return $("body[class*=loading]");
  }
  get noResultsFound() {
    return $("div.product-no-results");
  }
  get backTopBtn() {
    return $("div#back-top");
  }

  async catchBargains(category) {
    existingItems = this.getExistingItems("./screenshots");
    $(".bottom ul").waitForDisplayed({ timeout: 10000 });
    lastPage = Number(this.lastPageButton.getText());
    this.getTodayDate();
    currentPage = 1;
    while (currentPage <= lastPage) {
      let firstProductID = this.items[0].getAttribute("data-pdid");
      console.log(`${category} --->> page ${currentPage} of ${lastPage}`);
      this.calculateDiscount(category);
      currentPage++;
      if (this.nextBtn.isExisting()) {
        this.nextBtn.scrollIntoView();
        this.nextBtn.waitForClickable();
        browser.execute("arguments[0].click();", this.nextBtn);
        this.backTopBtn.waitForDisplayed({ reverse: true });
        if (this.noResultsFound.isExisting() || !this.items[0].isExisting()) {
          currentPage = lastPage + 1;
        } else {
          browser.waitUntil(
            () => firstProductID != this.items[0].getAttribute("data-pdid"),
            { timeout: 120000 }
          );
        }
      }
      // console.log(`Scanned items: ${itemsCalculated}`);
    }
  }

  confirmScreenshotFolderIsExisting(category) {
    let screenshotMainFolder = "screenshots/";
    if (!fs.existsSync(screenshotMainFolder)) {
      fs.mkdirSync(screenshotMainFolder);
    }
    screenshotSubFolder = "screenshots/" + category + "/";
    if (!fs.existsSync(screenshotSubFolder)) {
      fs.mkdirSync(screenshotSubFolder);
      return screenshotSubFolder;
    }
  }

  calculateDiscount(category) {
    let priceNow,
      priceWas,
      itemBrand,
      itemName,
      name,
      filePath,
      percent,
      discountTxt,
      discountRate,
      pricingHtml,
      itemDetail;
    itemsCalculated = itemsCalculated + this.items.length;

    this.items.forEach((item) => {
      try {
        item.waitForExist();

        // itemsCalculated++;
        if (item.getAttribute("class").startsWith("item")) {
          pricingHtml = item.$("div.pricing").getHTML(false);
          if (pricingHtml.includes("was")) {
            priceWas = this.getNumber(
              item.$("p.price.was span.price-display").getText()
            );
            priceNow = this.getNumber(
              item.$("p.price.now span.price-display").getText()
            );
            itemDetail = item.$("div.item-detail").getText();
            if (itemDetail.includes("SAVE") && itemDetail.includes("%")) {
              discountTxt = item.$("p.offer").getText().split(" ")[1];
              discountRate = discountTxt.slice(0, 2);
              priceNow = priceNow - (priceNow * discountRate) / 100;
            }
            if (itemDetail.includes("EXTRA") && itemDetail.includes("%")) {
              discountTxt = item.$("p.offer").getText().slice(-3);
              discountRate = discountTxt.slice(0, 2);
              priceNow = priceNow - (priceNow * discountRate) / 100;
            }

            percent = ((1 - priceNow / priceWas) * 100).toFixed(0);

            if (percent >= Number(discount)) {
              itemBrand = item.$("div.item-brand").getText();
              itemName = item.$("div.item-detail h4 a").getText();
              name = itemBrand + " " + itemName;
              name = name.split(".").join("").split("/").join("");

              priceNow = Number(priceNow).toFixed(0);
              let fileName = `${percent}% Off (Now $${priceNow}) ${name}.png`;
              filePath =
                screenshotSubFolder +
                today +
                "--> " +
                percent +
                "% Off (Now $" +
                priceNow +
                ") " +
                name +
                ".png";
              if (!existingItems.includes(fileName)) {
                browser.waitUntil(
                  () => {
                    item.scrollIntoView();
                    return this.isInViewport(item);
                  },
                  { timeout: 30000 }
                );
                browser.waitUntil(
                  () => {
                    return item.$("img").isDisplayed();
                  },
                  { timeout: 60000 }
                );
                item.saveScreenshot(filePath);
              }
            }
          }
        }
      } catch (error) {
        console.log("An error happened while scanning --->> " + name);
        if (item.isExisting()) {
          item.scrollIntoView();
          this.drawHighlight(item);
          filePath = "errorScreenshot/" + category + " error.png";
          browser.saveScreenshot(filePath);
          this.removeHighlight(item);
        } else {
          filePath = "errorScreenshot/" + category + " error.png";
          browser.saveScreenshot(filePath);
        }
        throw error;
      }
    });
  }

  verifyAllPagesAreScanned(category) {
    const errorMsg = "Some pages are not scanned";
    const isScanned = currentPage + 3 >= lastPage;
    expect(isScanned).toBe(true);
    console.log(
      `=====>>> ${category} bargains search is finished after scanning ${itemsCalculated} items <<<=====\n`
    );
  }

  getNumber(text) {
    return Number(text.slice(1).split(",").join(""));
  }

  getExistingItems(directory) {
    if (!fs.existsSync(directory)) return [];

    const entries = fs.readdirSync(directory, { withFileTypes: true });
    return entries.reduce((acc, entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        acc.push(...this.getExistingItems(fullPath));
      } else if (entry.name.endsWith(".png")) {
        const newItem = entry.name.split("--> ")[1];
        if (newItem) {
          acc.push(newItem);
        }
      }
      return acc;
    }, []);
  }

  getTodayDate() {
    let date = new Date();
    today =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  }

  getTotalItems() {
    totalItems = 0;
    totalItems = $("span.search-numbers").getText();
    console.log(`Total items --->> ${totalItems}`);
    return totalItems;
  }

  isInViewport(item) {
    return browser.execute(function (element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }, item);
  }
}

module.exports = new onSalePage();
