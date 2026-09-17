class AccommodationsPage {
    get addButtons() { return $$('.RoomListing-room-results button[data-tracking-id="add-to-cart"]'); }

    async addAvailableRoom() {
        await browser.waitUntil(async () => (await this.addButtons).length > 0, {
            timeout: 45000,
            timeoutMsg: 'No directly bookable room/rate appeared in Cabo Del Sol results'
        });
        for (const button of await this.addButtons) {
            if (!(await button.isDisplayed()) || !(await button.isEnabled())) continue;
            const room = await button.$('./ancestor::div[contains(concat(" ", normalize-space(@class), " "), " FilteredColumnsList-item ")][1]');
            // Scope to the smallest card containing both rate details and its price disclaimer.
            const rate = await button.$('./ancestor::div[.//*[@data-cy="rate-card-fees-disclaimer"] and .//button[normalize-space(.)="Rate Details"]][1]');
            const priceText = await rate.getText();
            const price = priceText.match(/Avg\. price per night\s+([A-Z]{3})\s+([\d,]+(?:\.\d+)?)/);
            if (!price) throw new Error(`Cannot read nightly price from selected rate: ${priceText}`);
            const selected = {
                roomName: await room.$('a[href*="/accommodations/"][target="_blank"]').getText(),
                ratePlan: await rate.$('p').getText(),
                currency: price[1],
                nightlyPrice: price[2],
                priceText
            };
            if (!selected.roomName || !selected.ratePlan) throw new Error('Selected room/rate identity is empty');
            console.log(`Selected: ${JSON.stringify(selected)}`);
            await button.click();
            return selected;
        }
        throw new Error('No visible, enabled Add to Cart action found');
    }
}
export default new AccommodationsPage();
