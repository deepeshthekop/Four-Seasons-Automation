/*
Given the rounded average nightly price shown on the accommodations page, 
determine the valid range for the full-stay room amount in the cart.

For example,
Displayed nightly price: CAD 1,756
Stay:                    2 nights
Cart room amount:        CAD 3,511.79
*/

export function stayRoomAmountRange(displayedNightlyPrice, nights) {
  const nightlyText = displayedNightlyPrice.replaceAll(",", "");
  const nightlyPrice = Number(nightlyText);

  const priceParts = nightlyText.split(".");
  let decimalPlaces = 0;
  if (priceParts.length > 1) {
    decimalPlaces = priceParts[1].length;
  }

  const displayUnit = 1 / 10 ** decimalPlaces;
  // DisplayUnit = what is the smallest price difference this UI is capable of showing
  const halfDisplayUnit = displayUnit / 2;

  const minimumNightlyPrice = nightlyPrice - halfDisplayUnit;
  const maximumNightlyPrice = nightlyPrice + halfDisplayUnit;

  return {
    minimum: minimumNightlyPrice * nights,
    maximum: maximumNightlyPrice * nights,
  };
}
