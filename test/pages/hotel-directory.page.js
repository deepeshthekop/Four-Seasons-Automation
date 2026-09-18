class HotelDirectoryPage {
  async open() {
    await browser.url("/find_a_hotel_or_resort/");
  }
  async selectProperty(name) {
    const directoryContent = $(
      "#all-hotels-resorts-hotel-tab.IconTabContainer-page--active",
    );
    const northAmericaButton = directoryContent.$("button*=North America");
    await northAmericaButton.waitForDisplayed();

    const regionId = await northAmericaButton.getAttribute("aria-controls");
    const isExpanded = await northAmericaButton.getAttribute("aria-expanded");
    if (isExpanded === "false") {
      await northAmericaButton.click();
    }

    const northAmericaRegion = directoryContent.$(
      `[role="region"][id="${regionId}"]`,
    );
    const propertyLink = northAmericaRegion.$(`a=${name}`);
    await propertyLink.waitForDisplayed();
    await propertyLink.click();
  }
}
export default new HotelDirectoryPage();
