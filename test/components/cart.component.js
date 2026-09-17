class CartComponent {
    get panel() { return $('[role="dialog"][aria-label="User Panel"]'); }
    get tab() { return this.panel.$('#cart-tab'); }

    async open() {
        // Adding a stay navigates to Discover. Wait for the new page and cart update.
        await browser.waitUntil(async () =>
            new URL(await browser.getUrl()).pathname === '/cabodelsol/discover/' &&
            (await $('#shopping_cart_icon').getText()).includes('(1)'),
        { timeout: 45000, timeoutMsg: 'Added stay did not appear in the cart indicator' });
        await $('.LoadingIndicator').waitForDisplayed({ reverse: true, timeout: 30000 });
        await $('#shopping_cart_icon').waitForClickable();
        await $('#shopping_cart_icon').click();
        await this.panel.waitForDisplayed();
        await this.tab.click();
        await this.panel.$('[data-cy="shopping-cart-item__taxes-and-fees"]').waitForDisplayed();
    }

    async readRoom() {
        const disclaimer = await this.panel.$('[data-cy="shopping-cart-item__taxes-and-fees"]');
        const item = await disclaimer.$('./ancestor::div[.//button[normalize-space(.)="Remove"]][1]');
        const priceText = await disclaimer.$('./..').$('span.text-subtitle2').getText();
        const price = priceText.match(/^([A-Z]{3})\s+([\d,]+(?:\.\d+)?)$/);
        if (!price) throw new Error(`Cannot read cart room price: ${priceText}`);
        return {
            roomName: await item.$('span.text-subtitle2').getText(),
            ratePlan: await item.$('span.text-caption').getText(),
            currency: price[1],
            displayedPrice: price[2],
            text: await item.getText()
        };
    }
}
export default new CartComponent();
