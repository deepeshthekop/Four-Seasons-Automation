class AccommodationsPage {
    get addButtons() { return $$('.RoomListing-room-results button[data-tracking-id="add-to-cart"]'); }

    async addAvailableRoom() {
        await browser.waitUntil(async () => {
            const buttons = await this.addButtons;
            return buttons.length > 0;
        }, {
            timeout: 45000,
            timeoutMsg: 'No directly bookable room/rate appeared in Cabo Del Sol results'
        });

        const buttons = await this.addButtons;
        for (const button of buttons) {
            const isVisible = await button.isDisplayed();
            if (!isVisible) {
                continue;
            }

            const isEnabled = await button.isEnabled();
            if (!isEnabled) {
                continue;
            }

            const selected = await this.readRoomAndRate(button);
            console.log(`Selected: ${JSON.stringify(selected)}`);
            await button.click();
            return selected;
        }
        throw new Error('No visible, enabled Add to Cart action found');
    }

    async readRoomAndRate(button) {
        // Ancestors keep the captured room and rate scoped to this Add to Cart button.
        const roomCardSelector = './ancestor::div[contains(concat(" ", normalize-space(@class), " "), " FilteredColumnsList-item ")][1]';
        const rateCardSelector = './ancestor::div[.//*[@data-cy="rate-card-fees-disclaimer"] and .//button[normalize-space(.)="Rate Details"]][1]';
        const roomCard = await button.$(roomCardSelector);
        const rateCard = await button.$(rateCardSelector);
        const priceText = await rateCard.getText();
        // Example: "Avg. price per night\nCAD 2,549"
        const priceMatch = priceText.match(/Avg\. price per night\s+([A-Z]{3})\s+([\d,]+(?:\.\d+)?)/);
        if (!priceMatch) {
            throw new Error(`Cannot read nightly price from selected rate: ${priceText}`);
        }

        const roomName = await roomCard.$('a[href*="/accommodations/"][target="_blank"]').getText();
        const ratePlan = await rateCard.$('p').getText();
        const currency = priceMatch[1];
        const nightlyPrice = priceMatch[2];
        if (!roomName || !ratePlan) {
            throw new Error('Selected room/rate identity is empty');
        }

        return { roomName, ratePlan, currency, nightlyPrice, priceText };
    }
}
export default new AccommodationsPage();
