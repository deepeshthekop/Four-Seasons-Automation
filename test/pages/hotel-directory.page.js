class HotelDirectoryPage {
  async open() {
    await browser.url("/find_a_hotel_or_resort/");
  }
  async selectProperty(name) {
    const links = await $$(`a=${name}`);
    for (const link of links) {
      if (await link.isDisplayed()) {
        await link.click();
        return;
      }
    }
    throw new Error(`No visible directory link for ${name}`);
  }
}
export default new HotelDirectoryPage();
