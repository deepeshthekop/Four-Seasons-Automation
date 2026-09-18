import directory from "../pages/hotel-directory.page.js";
import resort from "../pages/resort.page.js";
import accommodations from "../pages/accommodations.page.js";
import cart from "../components/cart.component.js";
import consent from "../components/consent.component.js";
import { booking, futureStay } from "../data/booking.data.js";
import { stayRoomAmountRange } from "../utils/pricing.js";

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

    const selected = await accommodations.addAvailableRoom();

    await cart.open();

    await expect(cart.tab).toHaveText("Cart (1)");
    await expect(cart.panel.$("h3")).toHaveText(booking.propertyName);

    const actual = await cart.readRoom();

    console.log(
      `Cart:
      Room: ${actual.roomName}
      Rate: ${actual.ratePlan}
      Occupancy: ${actual.occupancy.adults} adults, ${actual.occupancy.children} children
      Room amount: ${actual.currency} ${actual.displayedPrice}`,
    );

    const cartRoomName = actual.roomName.split(" - ")[0];

    expect(cartRoomName).toBe(selected.roomName);
    expect(actual.ratePlan).toBe(selected.ratePlan);
    expect(actual.occupancy).toEqual({
      adults: booking.adults,
      children: booking.children,
    });
    expect(actual.currency).toBe(selected.currency);

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
  });
});
