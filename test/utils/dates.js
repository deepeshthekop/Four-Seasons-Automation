export function futureStay(daysAhead, nights) {
    const arrival = new Date();
    arrival.setHours(12, 0, 0, 0);
    arrival.setDate(arrival.getDate() + daysAhead);
    const departure = new Date(arrival);
    departure.setDate(departure.getDate() + nights);
    const iso = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const label = date => date.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    const summary = date => date.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    }).replace(',', '');
    return { arrival: iso(arrival), departure: iso(departure),
        arrivalLabel: label(arrival), departureLabel: label(departure),
        summary: `Selected Dates ${summary(arrival)} to ${summary(departure)}` };
}
