export function stayRoomAmountRange(displayedNightlyPrice, nights) {
    const nightlyText = displayedNightlyPrice.replaceAll(',', '');
    const nightlyPrice = Number(nightlyText);
    const decimalPlaces = nightlyText.split('.')[1]?.length ?? 0;
    const halfDisplayUnit = 0.5 * 10 ** -decimalPlaces;
    // The nightly display is rounded, while the cart retains cents for the whole stay.
    // Scale [price - half display unit, price + half display unit) by the nights;
    // direct equality is invalid. This range excludes Est. Total and taxes/fees.
    return {
        minimum: (nightlyPrice - halfDisplayUnit) * nights,
        maximum: (nightlyPrice + halfDisplayUnit) * nights
    };
}
