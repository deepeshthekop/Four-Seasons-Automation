/*
Open the Four Seasons hotel directory, make sure the North America section is expanded, 
select the exact Cabo Del Sol property, and verify that navigation succeeded.
*/

class HotelDirectoryPage {
  async open() {
    await browser.url("/find_a_hotel_or_resort/");
  }

  async selectProperty(name) {
    const directoryContent = $(
      "#all-hotels-resorts-hotel-tab.IconTabContainer-page--active",
    );
    const northAmericaButton = directoryContent.$("button*=North America");
    // Search for the button inside directoryContent
    // Find a <button> whose text contains "North America"
    await northAmericaButton.waitForDisplayed();

    const regionId = await northAmericaButton.getAttribute("aria-controls");
    // For an accordion, aria-controls stores the id of the region that the button controls
    const isExpanded = await northAmericaButton.getAttribute("aria-expanded");
    if (isExpanded === "false") {
      await northAmericaButton.click();
    }
    // North America collapsed → click it
    // North America already expanded → do nothing

    const northAmericaRegion = directoryContent.$(
      `[role="region"][id="${regionId}"]`,
    );
    // Here, we locate the actual North America rehion

    const propertyLink = northAmericaRegion.$(`a=${name}`);
    // Search inside the North America region for a link whose text is exactly the property name
    // a= is WebdriverIO's link-text selector
    // i.e., Find an <a> link with the text "Los Cabos (Cabo Del Sol)"

    await propertyLink.waitForDisplayed();
    await propertyLink.click();
  }
}

export default new HotelDirectoryPage();
// This line creates an instance of our class and exports that instance

/*
open()
  ↓
Open Find a Hotel or Resort


selectProperty(name)
  ↓
Find active hotel directory
  ↓
Find North America button
  ↓
Wait for it
  ↓
Read which region it controls
  ↓
Check whether it's expanded
  ↓
If collapsed → expand it
  ↓
Find the corresponding North America region
  ↓
Find exact property inside that region
  ↓
Wait until property is displayed
  ↓
Click property


There are really three concepts worth remembering from this file: 
element scoping (directoryContent → northAmericaRegion → propertyLink), 
state-aware interaction (aria-expanded before clicking), and 
accessibility-based DOM relationships (aria-controls tells us which region belongs to the button)
*/
