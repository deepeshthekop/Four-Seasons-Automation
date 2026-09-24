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
  // Remove commas for parsing
  const nightlyPrice = Number(nightlyText); 
  // Convert to number for calculations

  const priceParts = nightlyText.split("."); 
  // Split into whole and decimal parts
  let decimalPlaces = 0;
  if (priceParts.length > 1) {
    decimalPlaces = priceParts[1].length; // 
  }
  // If there is a decimal part, count its length to determine the number of decimal places
  // Our nightly price display is rounded to the nearest whole number, so we expect 0 decimal places.
  // So the if statement is likely unnecessary, but we include it for completeness.

  const displayUnit = 1 / 10 ** decimalPlaces;
  // DisplayUnit = what is the smallest price difference this UI is capable of showing
  // decimalPlaces = 0 -> 10 ** 0 = 1 i.e. 10 ^ 0 = 1 -> displayUnit = 1 / 1 = 1
  const halfDisplayUnit = displayUnit / 2;
  // Half of the display unit is used to create a range around the nightly price
  // halfDisplayUnit = 1 / 2 = 0.5 for decimalPlaces = 0

  const minimumNightlyPrice = nightlyPrice - halfDisplayUnit;
  const maximumNightlyPrice = nightlyPrice + halfDisplayUnit;
   /* 
  The minimum and maximum nightly prices are calculated by subtracting and adding 
  the half display unit to the nightly price, respectively.
  */

  return {
    minimum: minimumNightlyPrice * nights,
    maximum: maximumNightlyPrice * nights,
  };
}

/*
UI shows:
"1,756"
     ↓
Remove comma
"1756"
     ↓
Convert to number
1756
     ↓
UI displayed 0 decimal places
     ↓
Therefore display precision = $1
     ↓
Half of $1 = $0.50
     ↓
Possible underlying nightly average:
1755.50 ≤ price < 1756.50
     ↓
Stay = 2 nights
     ↓
Possible full-stay amount:
3511.00 ≤ amount < 3513.00
     ↓
Cart says 3511.79
     ↓
PASS
*/