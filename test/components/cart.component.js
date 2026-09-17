class CartComponent {
    get panel() { return $('[role="dialog"][aria-label="User Panel"]'); }
    get tab() { return this.panel.$('#cart-tab'); }

    async open() {
        // Adding a stay navigates to Discover. Wait for the new page and cart update.
        await browser.waitUntil(async () => {
            const currentUrl = new URL(await browser.getUrl());
            const isDiscoverPage = currentUrl.pathname === '/cabodelsol/discover/';
            if (!isDiscoverPage) {
                return false;
            }

            const cartIndicator = await $('#shopping_cart_icon').getText();
            return cartIndicator.includes('(1)');
        }, {
            timeout: 45000,
            timeoutMsg: 'Added stay did not appear in the cart indicator'
        });
        await $('.LoadingIndicator').waitForDisplayed({ reverse: true, timeout: 30000 });
        await $('#shopping_cart_icon').waitForClickable();
        await $('#shopping_cart_icon').click();
        await this.panel.waitForDisplayed();
        await this.tab.click();
        await this.panel.$('[data-cy="shopping-cart-item__taxes-and-fees"]').waitForDisplayed();
    }

    async readRoom() {
        const disclaimer = await this.panel.$('[data-cy="shopping-cart-item__taxes-and-fees"]');
        // Find the enclosing removable cart item rather than reading unrelated panel text.
        const cartItemSelector = './ancestor::div[.//button[normalize-space(.)="Remove"]][1]';
        const item = await disclaimer.$(cartItemSelector);
        const priceContainer = await disclaimer.$('./..');
        const priceText = await priceContainer.$('span.text-subtitle2').getText();
        // Example: "CAD 5,098.71"
        const priceMatch = priceText.match(/^([A-Z]{3})\s+([\d,]+(?:\.\d+)?)$/);
        if (!priceMatch) {
            throw new Error(`Cannot read cart room price: ${priceText}`);
        }

        const currency = priceMatch[1];
        const displayedPrice = priceMatch[2];
        const text = await item.getText();
        const occupancy = this.readOccupancy(text);
        const roomName = await item.$('span.text-subtitle2').getText();
        const ratePlan = await item.$('span.text-caption').getText();

        return { roomName, ratePlan, currency, displayedPrice, occupancy, text };
    }

    readOccupancy(text) {
        const lines = text.split('\n');
        for (const line of lines) {
            const adultsMatch = line.match(/^(\d+) adults?\b/);
            if (!adultsMatch) {
                continue;
            }

            const adults = Number(adultsMatch[1]);
            const childrenMatch = line.match(/(\d+) (?:children|child)\b/);
            let children = 0;
            // The cart omits the child count when no children are included.
            if (childrenMatch) {
                children = Number(childrenMatch[1]);
            }

            return { adults, children };
        }
        throw new Error(`Cannot read cart occupancy: ${text}`);
    }
}
export default new CartComponent();
