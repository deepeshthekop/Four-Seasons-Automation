import directory from '../pages/hotel-directory.page.js';
import resort from '../pages/resort.page.js';
import accommodations from '../pages/accommodations.page.js';
import cart from '../components/cart.component.js';
import consent from '../components/consent.component.js';
import { booking } from '../data/booking.data.js';
import { futureStay } from '../utils/dates.js';

describe('Cabo Del Sol room cart', () => {
    it('preserves the selected room, rate and displayed price in the cart', async () => {
        const stay = futureStay(booking.daysAhead, booking.nights);
        console.log(`Stay: ${stay.arrival} to ${stay.departure}`);
        await directory.open();
        await consent.dismissIfPresent();
        await directory.selectProperty(booking.directoryName);
        await expect(browser).toHaveUrl(expect.stringContaining(booking.propertyPath));
        await expect(resort.heading).toHaveText('Cabo Del Sol', { ignoreCase: true });
        await consent.dismissIfPresent();
        await resort.availability.setStay(stay);
        await expect(resort.availability.dates).toHaveText(expect.stringContaining(stay.summary));
        await resort.availability.checkRates();
        await expect(browser).toHaveUrl(expect.stringContaining('/cabodelsol/accommodations/'));
        await expect($('h1')).toHaveText('Cabo San Lucas Luxury Accommodations', { ignoreCase: true });
        const search = new URL(await browser.getUrl()).searchParams;
        expect(search.get('generalReservationForm.locationId')).toBe(booking.propertyCode);
        expect(search.get('generalReservationForm.checkInDate')).toBe(stay.arrival);
        expect(search.get('generalReservationForm.checkOutDate')).toBe(stay.departure);
        expect(search.get('generalReservationForm.guestCountPerRoom[0].adultCount')).toBe('2');
        expect(search.get('generalReservationForm.guestCountPerRoom[0].childCount')).toBe('0');
        const selected = await accommodations.addAvailableRoom();
        await cart.open();
        await expect(cart.tab).toHaveText('Cart (1)');
        await expect(cart.panel.$('h3')).toHaveText(booking.propertyName);
        const actual = await cart.readRoom();
        console.log(`Cart: ${JSON.stringify(actual)}`);
        expect(actual.roomName === selected.roomName || actual.roomName.startsWith(`${selected.roomName} - `)).toBe(true);
        expect(actual.ratePlan).toBe(selected.ratePlan);
        expect(actual.text).toContain('2 adults');
        expect(actual.currency).toBe(selected.currency);
        const nightlyText = selected.nightlyPrice.replaceAll(',', '');
        const nightlyPrice = Number(nightlyText);
        const decimalPlaces = nightlyText.split('.')[1]?.length ?? 0;
        const halfDisplayUnit = 0.5 * 10 ** -decimalPlaces;
        const roomAmount = Number(actual.displayedPrice.replaceAll(',', ''));
        // The nightly display is rounded; the cart holds the stay amount with cents, so direct
        // equality is invalid. Scale its rounding interval [price - half unit, price + half unit)
        // by the nights, comparing only the room amount, never Est. Total or taxes/fees.
        const minimum = (nightlyPrice - halfDisplayUnit) * booking.nights;
        const maximum = (nightlyPrice + halfDisplayUnit) * booking.nights;
        console.log(`Room price consistency: ${actual.currency} ${roomAmount} in [${minimum}, ${maximum})`);
        expect(roomAmount).toBeGreaterThanOrEqual(minimum);
        expect(roomAmount).toBeLessThan(maximum);
    });
});
