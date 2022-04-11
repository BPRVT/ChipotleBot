//Benjamin Rosenbloom
// VERSION 1.0
//This is a puppeteer script that will order Chipotle for you. 

const puppeteer = require('puppeteer'); // v13.0.0 or later
//THIS IS ALL MAGIC MATH THAT HANDLES BROWSER SIZE CALCS AND OFFSETT 
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const timeout = 15000;
    page.setDefaultTimeout(timeout);

    async function waitForSelectors(selectors, frame, options) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame, options);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function scrollIntoViewIfNeeded(element, timeout) {
      await waitForConnected(element, timeout);
      const isInViewport = await element.isIntersectingViewport({threshold: 0});
      if (isInViewport) {
        return;
      }
      await element.evaluate(element => {
        element.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'auto',
        });
      });
      await waitForInViewport(element, timeout);
    }

    async function waitForConnected(element, timeout) {
      await waitForFunction(async () => {
        return await element.getProperty('isConnected');
      }, timeout);
    }

    async function waitForInViewport(element, timeout) {
      await waitForFunction(async () => {
        return await element.isIntersectingViewport({threshold: 0});
      }, timeout);
    }

    async function waitForSelector(selector, frame, options) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to waitForSelector');
      }
      let element = null;
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (element) {
          element = await element.waitForSelector(part, options);
        } else {
          element = await frame.waitForSelector(part, options);
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('>>'));
        }
        if (i < selector.length - 1) {
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
      }
      if (!element) {
        throw new Error('Could not find element: ' + selector.join('|'));
      }
      return element;
    }

    async function waitForElement(step, frame, timeout) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      }, timeout);
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to querySelectorAll');
      }
      let elements = [];
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (i === 0) {
          elements = await frame.$$(part);
        } else {
          const tmpElements = elements;
          elements = [];
          for (const el of tmpElements) {
            elements.push(...(await el.$$(part)));
          }
        }
        if (elements.length === 0) {
          return [];
        }
        if (i < selector.length - 1) {
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
        }
      }
      return elements;
    }

    async function waitForFunction(fn, timeout) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, timeout);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
    {
        const targetPage = page;
        await targetPage.setViewport({"width":875,"height":937})
    }
    //END CRAZY MAGIC MATH FOR OFFSETT AND ALL 
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        //Go To Chipotle 
        await targetPage.goto('https://www.chipotle.com/');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["body > div.app-container.scrollable.browser-is-chrome > div.app > div.header-container.header > div > div.left-container > div > div > h6"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 26, y: 9.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Enter email address"],["body > div.app-container.browser-is-chrome > div.cmg-sign-in-modal > span > div.cmg-modal-container.full-screen > div > div > div > div.modal-inner > div.modal-content > div > div > div.fields > form > div.cmg-input.input.username.text > div > div.text-input-container > input"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 37, y: 8.8125} });
    }
    //ENTER EMAIL BLOCK HERE, FILL IT IN
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Enter email address"],["body > div.app-container.browser-is-chrome > div.cmg-sign-in-modal > span > div.cmg-modal-container.full-screen > div > div > div > div.modal-inner > div.modal-content > div > div > div.fields > form > div.cmg-input.input.username.text > div > div.text-input-container > input"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('EMAIL HERE ');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "EMAIL HERE ");
        }
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Tab");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up("Tab");
    }
    //PASSWORD BLOCK FILL IT IN 
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Enter password"],["body > div.app-container.browser-is-chrome > div.cmg-sign-in-modal > span > div.cmg-modal-container.full-screen > div > div > div > div.modal-inner > div.modal-content > div > div > div.fields > form > div.cmg-input.input.password.password > div > div.password-input-container > input"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('PASSWORD HERE ');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "PASSWORD HERE ");
        }
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Enter");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up("Enter");
    }
    //GOES TO BURRITO BOWL, YOU CAN CHANGE IF YOU ORDER OTHER KINDS OF FOOD. 
    {
        const targetPage = page;
        await page.waitForTimeout(3000)
        const element = await waitForSelectors([["aria/Burrito Bowl"],["#menu > div > div:nth-child(2) > div > div.thumbnail > img"]], targetPage, {timeout, visible: true} );
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 173.1875, y: 108} });
    }
    {
      // CUSTOMIZE WHAT YOU WANT ON YOUR BOWL HERE
      // MY ORDER:
      // CHICKEN, WHITE RICE (EXTRA) 
      // BLACK BEANS, TOMATO, SOUR CREAM, CORN (EXTRA), LETTUCE, CHEESE (EXTRA)
        const targetPage = page;
        await page.waitForTimeout(6000)
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(1) > div > div > div.cards > div:nth-child(2) > div.card-selection-overlay"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 223, y: 39.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(2) > div > div > div.cards > div:nth-child(1) > div.card-selection-overlay"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 225, y: 33.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(2) > div > div > div.cards > div.meal-builder-item-selector-card-container.selected > div.customizations-container > div > div.kebab-menu-container > div.cmg-kebab-menu-container > div > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 25, y: 23.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Extra"],["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(2) > div > div > div.cards > div.meal-builder-item-selector-card-container.selected.customizing > div.customizations-container > div > div > div:nth-child(3)"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 73.5, y: 31.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(3) > div > div > div.cards > div:nth-child(1) > div.card-selection-overlay"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 356, y: 18.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(4) > div > div > div.cards > div:nth-child(2) > div.card-selection-overlay"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 320, y: 47.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(4) > div > div > div.cards > div:nth-child(3) > div.card-selection-overlay"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 437, y: 32.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(4) > div > div > div.cards > div:nth-child(3) > div.customizations-container > div > div.kebab-menu-container > div.cmg-kebab-menu-container > div > img"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 28, y: 15.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(4) > div > div > div.cards > div.meal-builder-item-selector-card-container.selected.customizing > div.customizations-container > div > div > div:nth-child(3)"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 54.5, y: 47.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(4) > div > div > div.cards > div:nth-child(6) > div.card-selection-overlay"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 312, y: 60.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(4) > div > div > div.cards > div:nth-child(8) > div.card-selection-overlay"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 345, y: 37.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-content > div.meal-builder-content-inner > div > div > div:nth-child(4) > div > div > div.cards > div:nth-child(9) > div.card-selection-overlay"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 292, y: 56.1875} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/ADD TO BAG"],["#cmg-app-content > div.router-view-container > div > div > div.meal-builder-footer-container.footer > div > div.actions > div > div > div"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 56.3828125, y: 8} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Enter the Meal Name"],["body > div.app-container.browser-is-chrome > div.cmg-meal-builder-meal-name-modal > span > div.cmg-modal-container > div > div > div > div.modal-inner > div.modal-content > div > div.input-container > div > div > div.text-input-container > input"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 98, y: 3.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["body > div.app-container.browser-is-chrome > div.cmg-meal-builder-meal-name-modal > span > div.cmg-modal-container > div > div > div > div.modal-inner > div.modal-content > div > div.buttons > div.button.save.size-md.type-primary"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 108.5234375, y: 39.75} });
    }
    //END TOPPINGS  
    {
      const targetPage = page;
      const element = await waitForSelectors([["body > div.app-container.scrollable.browser-is-chrome > div.app > div.header-container.header > div.full-screen-wrapper.fullModal.bag-container > div.bag.has-meals > div.footer.group-participant > div > div"]], targetPage, { timeout, visible: true });
      await scrollIntoViewIfNeeded(element, timeout);
      await element.click({ offset: { x: 68, y: 15} });
    }
    //CHECKOUT 
    {
      const targetPage = page;
      const element = await waitForSelectors([["#cmg-app-content > div.router-view-container > div > div > div.valid-order > div.checkout-form > div > div.pickup.container > div.pickup-times-container.mobile-constrained > div.times-container > div > div:nth-child(1) > div.time"]], targetPage, { timeout, visible: true });
      await scrollIntoViewIfNeeded(element, timeout);
      await element.click({ offset: { x: 51.734375, y: 12.5} });
      await page.waitForTimeout(3000)

      
    }
    {
      //SUBMIT ORDER BUTTON 
      const targetPage = page;
      const element = await waitForSelectors([["aria/SUBMIT ORDER"],["#cmg-app-content > div.router-view-container > div > div > div.valid-order > div.submit-container > div > div > div"]], targetPage, { timeout, visible: true });
      await scrollIntoViewIfNeeded(element, timeout);
      await element.click({ offset: { x: 72.375, y: 7.5} });
      await page.waitForTimeout(10000);
      await page.screenshot({path: 'Reciept.jpg', type: 'jpeg', fullPage: true});
      await page.waitForTimeout(10000);

    }
    
    await browser.close();
    //KILL SESSION
    
})();
