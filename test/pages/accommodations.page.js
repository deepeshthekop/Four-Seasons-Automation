class AccommodationsPage {
  get addButtons() {
    return $$(
      '.RoomListing-room-results button[data-tracking-id="add-to-cart"]',
    );
  }

  async addAvailableRoom() {
    await browser.waitUntil(
      async () => {
        const buttons = await this.addButtons;
        return buttons.length > 0;
        // Wait until at least one Add to Cart button is present in the DOM
      },
      {
        timeout: 45000,
        timeoutMsg:
          "No directly bookable room/rate appeared in Cabo Del Sol results",
      },
    );

    const buttons = await this.addButtons;
    for (const button of buttons) {
      const isVisible = await button.isDisplayed();
      if (!isVisible) {
        continue;
        // Ignore this button and move to the next one if it's not visible
      }

      const isEnabled = await button.isEnabled();
      if (!isEnabled) {
        continue;
        // Ignore this button and move to the next one if it's not enabled
      }

      const selected = await this.readRoomAndRate(button);
      // Read the room and rate information associated with this Add to Cart button

      console.log(
        `Selected room:
        Room: ${selected.roomName}
        Rate: ${selected.ratePlan}
        Average nightly price: ${selected.currency} ${selected.nightlyPrice}`,
      );

      await button.click();
      return selected;
    }

    throw new Error("No visible, enabled Add to Cart action found");
  }

  async readRoomAndRate(button) {
    // Use XPath to locate the room and rate cards associated with the Add to Cart button.
    // Ancestors keep the captured room and rate scoped to this Add to Cart button.
    const roomCardSelector =
      './ancestor::div[contains(concat(" ", normalize-space(@class), " "), " FilteredColumnsList-item ")][1]';
    const rateCardSelector =
      './ancestor::div[.//*[@data-cy="rate-card-fees-disclaimer"] and .//button[normalize-space(.)="Rate Details"]][1]';
    const roomCard = await button.$(roomCardSelector);
    const rateCard = await button.$(rateCardSelector);
    const priceText = await rateCard.getText();

    // Use a regex to extract the currency and nightly price from the text.
    // Example: "Avg. price per night\nCAD 2,549"
    const priceMatch = priceText.match(
      /Avg\. price per night\s+([A-Z]{3})\s+([\d,]+(?:\.\d+)?)/,
    );
    if (!priceMatch) {
      throw new Error(
        `Cannot read nightly price from selected rate: ${priceText}`,
      );
    }

    // Read the room name and rate plan from the respective cards
    const roomName = await roomCard
      .$('a[href*="/accommodations/"][target="_blank"]')
      .getText();
    const ratePlan = await rateCard.$("p").getText();
    const currency = priceMatch[1];
    // Extract the currency code from the regex match
    const nightlyPrice = priceMatch[2];
    // Extract the nightly price from the regex match

    // Validate that the room name and rate plan are not empty before returning the selected room information
    if (!roomName || !ratePlan) {
      throw new Error("Selected room/rate identity is empty");
    }

    return { roomName, ratePlan, currency, nightlyPrice, priceText };
  }
}

export default new AccommodationsPage();
