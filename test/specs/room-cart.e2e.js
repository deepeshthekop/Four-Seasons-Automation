import directory from "../pages/hotel-directory.page.js";
import resort from "../pages/resort.page.js";
import accommodations from "../pages/accommodations.page.js";
import cart from "../components/cart.component.js";
import consent from "../components/consent.component.js";
import checkout from "../pages/checkout.page.js";
import { booking, futureStay } from "../data/booking.data.js";
import { stayRoomAmountRange } from "../utils/pricing.js";
import { guest } from "../data/checkout.data.js";

describe("Cabo Del Sol room cart", () => {
  it("shows the selected room and rate in the cart with pricing consistent with the displayed nightly rate", async () => {
    const stay = futureStay(booking.daysAhead, booking.nights);

    console.log(`Stay: ${stay.arrival} to ${stay.departure}`);

    await directory.open();
    const consentAccepted = await consent.dismissIfPresent();
    await directory.selectProperty(booking.directoryName);

    await expect(browser).toHaveUrl(
      expect.stringContaining(booking.propertyPath),
    );
    await expect(resort.heading).toHaveText("Cabo Del Sol", {
      ignoreCase: true,
    });

    if (!consentAccepted) {
      await consent.dismissIfPresent();
    }

    await resort.setStay(stay);

    // Verify that the resort page shows the correct stay dates in the summary
    await expect(resort.dates).toHaveText(
      expect.stringContaining(stay.summary),
    );

    await resort.checkRates();

    await expect(browser).toHaveUrl(
      expect.stringContaining("/cabodelsol/accommodations/"),
    );
    await expect($("h1")).toHaveText("Cabo San Lucas Luxury Accommodations", {
      ignoreCase: true,
    });

    /*
    Verify that the booking information we selected on the resort page 
    was correctly carried into the accommodations/results page URL.
    */
    const search = new URL(await browser.getUrl()).searchParams;

    expect(search.get("generalReservationForm.locationId")).toBe(
      booking.propertyCode,
    );
    expect(search.get("generalReservationForm.checkInDate")).toBe(stay.arrival);
    expect(search.get("generalReservationForm.checkOutDate")).toBe(
      stay.departure,
    );
    expect(
      search.get("generalReservationForm.guestCountPerRoom[0].adultCount"),
    ).toBe(String(booking.adults));
    expect(
      search.get("generalReservationForm.guestCountPerRoom[0].childCount"),
    ).toBe(String(booking.children));

    // Add the first available room to the cart and capture its details for later verification
    // Selected variable will contain the room name, rate plan, nightly price, and currency.
    const selected = await accommodations.addAvailableRoom();

    await cart.open();

    await expect(cart.tab).toHaveText("Cart (1)");
    await expect(cart.panel.$("h3")).toHaveText(booking.propertyName);

    /* 
    Verify that the room and rate in the cart match what we selected on the 
    accommodations page, and that the displayed full-stay room amount is consistent 
    with the nightly price and number of nights booked.
    */
    const actual = await cart.readRoom();

    console.log(
      `Cart:
      Room: ${actual.roomName}
      Rate: ${actual.ratePlan}
      Occupancy: ${actual.occupancy.adults} adults, ${actual.occupancy.children} children
      Room amount: ${actual.currency} ${actual.displayedPrice}`,
    );

    // The room name in the cart includes the rate plan, so we need to extract just the room name for comparison.
    // Split on " - " and take the first part, which is the room name.
    const cartRoomName = actual.roomName.split(" - ")[0];

    expect(cartRoomName).toBe(selected.roomName);
    expect(actual.ratePlan).toBe(selected.ratePlan);
    expect(actual.occupancy).toEqual({
      adults: booking.adults,
      children: booking.children,
    });
    expect(actual.currency).toBe(selected.currency);

    /*
    Account for the displayed average nightly price being rounded when validating the 
    full-stay room amount in the cart.
    */
    const { minimum, maximum } = stayRoomAmountRange(
      selected.nightlyPrice,
      booking.nights,
    );
    const roomAmount = Number(actual.displayedPrice.replaceAll(",", ""));

    console.log(
      `Price verification:
      Displayed nightly price: ${selected.currency} ${selected.nightlyPrice}
      Expected room amount: ${selected.currency} ${minimum} to ${maximum}
      Actual room amount: ${actual.currency} ${actual.displayedPrice}`,
    );

    expect(roomAmount).toBeGreaterThanOrEqual(minimum);
    expect(roomAmount).toBeLessThan(maximum);

    await cart.clickCheckoutLink();
    await checkout.tapEnhancementsBtn();

    await checkout.waitForBookingForm();

    await checkout.fillGuestDetails(guest);
    await expect(checkout.firstName).toHaveValue(guest.firstName);
    await expect(checkout.lastName).toHaveValue(guest.lastName);
    await expect(checkout.email).toHaveValue(guest.email);
    await expect(checkout.phone).toHaveValue(guest.phone);
    await expect(checkout.country).toHaveValue(guest.countryCode);

    await checkout.fillGuestPaymentDetails(guest);
    await expect(checkout.nameOnCard).toHaveValue(guest.nameOnCard);
    await expect(checkout.expirationDate).toHaveValue(guest.expirationDate);

    await checkout.acceptConfirmation();
    await expect(checkout.confirmationCheckbox).toBeSelected();
  });
});
