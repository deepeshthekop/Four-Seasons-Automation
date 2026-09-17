export const booking = {
    directoryName: 'Los Cabos (Cabo Del Sol)',
    propertyName: 'Four Seasons Resort Cabo Del Sol',
    propertyPath: '/cabodelsol/',
    propertyCode: 'SJD245',
    adults: 2,
    children: 0,
    daysAhead: 30,
    nights: 2
};

export function futureStay(daysAhead, nights) {
    const arrival = new Date();
    arrival.setHours(12, 0, 0, 0);
    arrival.setDate(arrival.getDate() + daysAhead);
    const departure = new Date(arrival);
    departure.setDate(departure.getDate() + nights);

    function formatUrlDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatCalendarLabel(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    function formatSummaryDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        }).replace(',', '');
    }

    const arrivalSummary = formatSummaryDate(arrival);
    const departureSummary = formatSummaryDate(departure);
    return {
        arrival: formatUrlDate(arrival),
        departure: formatUrlDate(departure),
        arrivalLabel: formatCalendarLabel(arrival),
        departureLabel: formatCalendarLabel(departure),
        summary: `Selected Dates ${arrivalSummary} to ${departureSummary}`
    };
}
