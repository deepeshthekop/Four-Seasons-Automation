class CartComponent {
  // User panel
  get panel() {
    return $('[role="dialog"][aria-label="User Panel"]');
  }

  // Cart tab
  get tab() {
    return this.panel.$("#cart-tab");
  }

  // Open the cart and wait for the cart contents to be ready.
  async open() {
    // Adding a stay(room) navigates to Discover. Wait for the new page and cart update.
    // borwser.waitUntil() lets us define our own condition.
    // This is useful when WebdriverIO does not have singlt built-in wait that we need
    await browser.waitUntil(
      async () => {
        const currentUrl = new URL(await browser.getUrl()); 
        // Get the current URL of the browser and turn it into a URL object so we can easily check the pathname.
        const isDiscoverPage = currentUrl.pathname === "/cabodelsol/discover/";
        if (!isDiscoverPage) {
          return false;
        }

        const cartIndicator = await $("#shopping_cart_icon").getText();
        return cartIndicator.includes("(1)");
      },
      {
        timeout: 45000,
        timeoutMsg: "Added stay did not appear in the cart indicator",
      },
    );

    // Wait for the loading indicator to DISAPPEAR
    // Prevents us from trying to interact with the cart while the site is still loading
    await $(".LoadingIndicator").waitForDisplayed({
      reverse: true, 
      timeout: 30000,
    });

    await $("#shopping_cart_icon").waitForClickable();
    await $("#shopping_cart_icon").click();

    await this.panel.waitForDisplayed();
    await this.tab.click();
    await this.panel
      .$('[data-cy="shopping-cart-item__taxes-and-fees"]')
      .waitForDisplayed();
  }
  
  /*
  shopping cart icon
      ↓
  opens User Panel
      ↓
  click Cart tab inside User Panel
  */

  // Reads the information from the room currently stored in the cart.
  // Returns values we can compare against what we selected earlier.
  async readRoom() {
    const disclaimer = await this.panel.$(
      '[data-cy="shopping-cart-item__taxes-and-fees"]',
    );

    // Find the enclosing removable cart item rather than reading unrelated panel text.
    // Go upward through 'disclaimer' ancestors and find the first <div> that contains a button whose visible text is Remove.
    const cartItemSelector =
      './ancestor::div[.//button[normalize-space(.)="Remove"]][1]';
    const item = await disclaimer.$(cartItemSelector); 
    // Find the cart item that contains the disclaimer 

    const priceContainer = await disclaimer.$("./.."); 
    // Go to the parent of the current element
    const priceText = await priceContainer.$("span.text-subtitle2").getText();
    // Get the text of the price span, which contains the currency and price i.e., CAD 5,098.71


    // Example: "CAD 5,098.71"
    // The regex separates the currency from the price and returns an array
    const priceMatch = priceText.match(/^([A-Z]{3})\s+([\d,]+(?:\.\d+)?)$/);
    
    if (!priceMatch) {
      throw new Error(`Cannot read cart room price: ${priceText}`);
    }

    const currency = priceMatch[1]; 
    // Captures the currency code (e.g., CAD)
    const displayedPrice = priceMatch[2]; 
    // Captures the numeric amount (e.g., 5,098.71)

    const text = await item.getText(); 
    // Get the full text of the cart item, which includes room name, rate plan, occupancy, and price.
    const occupancy = this.readOccupancy(text); 
    // Extracts the occupancy information (adults and children) from the text.
    const roomName = await item.$("span.text-subtitle2").getText(); 
    // Get the room name from the cart item.
    const ratePlan = await item.$("span.text-caption").getText(); 
    // Get the rate plan from the cart item.

    return { roomName, ratePlan, currency, displayedPrice, occupancy, text };
  }

  // Notice that this method is NOT async, because it does not interact with the browser.
  // It receives a normal JS string and parses it locally.
  // Hence, await is not necessary.
  readOccupancy(text) {
    const lines = text.split("\n"); 
    // Split the text into lines based on newline characters.
    // i.e., converts the single string into an array.
    
    for (const line of lines) {
      const adultsMatch = line.match(/^(\d+) adults?\b/);
      // The regex matches a line that starts with a number followed by "adult" or "adults".
      // (\d+) -> Captures one or more digits (the number of adults)
      // adults? -> Matches "adult" or "adults" (the ? makes the 's' optional)
      // \b -> Asserts a word boundary to ensure we don't match "adulthood" or similar words.
      if (!adultsMatch) {
        continue;
      }

      const adults = Number(adultsMatch[1]); 
      // Convert the captured string to a number for the adult count.

      const childrenMatch = line.match(/(\d+) (?:children|child)\b/);
      // (?:children|child) -> Matches either "children" or "child" without capturing it (non-capturing group).
      let children = 0; 
      // Initialize children count to 0 in case no children are found.

      if (childrenMatch) {
        children = Number(childrenMatch[1]);
        // If child info exists, convert the captured string to a number for the children count.
      }

      return { adults, children };
    }

    throw new Error(`Cannot read cart occupancy: ${text}`);
  }
}

export default new CartComponent();
// Create one instace of the CartComponent and export it so the test can directly use it's methods


/*
Regex guide:
^ -> Start of the string
[A-Z]{3} -> Match exactly 3 uppercase letters (the currency code)
\s+ -> Match one or more whitespace characters
([\d,]+(?:\.\d+)?) -> Captures the numeric amount, allowing commans and optional decimal part
$ -> End of the string
*/

/*
CartComponent
│
├── panel
│   └── whole User Panel
│
├── tab
│   └── Cart tab inside User Panel
│
├── open()
│   ├── wait for Discover
│   ├── wait for cart count (1)
│   ├── wait for loading to finish
│   ├── click cart icon
│   ├── wait for User Panel
│   ├── click Cart tab
│   └── wait for cart content
│
├── readRoom()
│   ├── identify exact cart item
│   ├── read price
│   ├── split currency + amount
│   ├── read room name
│   ├── read rate
│   └── read occupancy
│
└── readOccupancy(text)
    ├── split text into lines
    ├── find adult count
    ├── find child count if present
    └── return { adults, children }
*/