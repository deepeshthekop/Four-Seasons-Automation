export function stayRoomAmountRange(displayedNightlyPrice, nights) {
  const nightlyText = displayedNightlyPrice.replaceAll(",", "");
  const nightlyPrice = Number(nightlyText);
  const priceParts = nightlyText.split(".");
  let decimalPlaces = 0;
  if (priceParts.length > 1) {
    decimalPlaces = priceParts[1].length;
  }
  const displayUnit = 1 / 10 ** decimalPlaces;
  const halfDisplayUnit = displayUnit / 2;
  // The nightly display is rounded, while the cart retains cents for the whole stay.
  // Scale [price - half display unit, price + half display unit) by the nights;
  // direct equality is invalid. This range excludes Est. Total and taxes/fees.
  const minimumNightlyPrice = nightlyPrice - halfDisplayUnit;
  const maximumNightlyPrice = nightlyPrice + halfDisplayUnit;
  return {
    minimum: minimumNightlyPrice * nights,
    maximum: maximumNightlyPrice * nights,
  };
}
