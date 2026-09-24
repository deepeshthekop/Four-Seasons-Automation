export const booking = {
  directoryName: "Los Cabos (Cabo Del Sol)",
  propertyName: "Four Seasons Resort Cabo Del Sol",
  propertyPath: "/cabodelsol/",
  propertyCode: "SJD245",
  adults: 2,
  children: 0,
  daysAhead: 30,
  nights: 2,
};

// Calculate arrival and departure dates dynamically.
// Return those dates in all the formats our test needs.
// Same two dates, but represented in 3 differente ways because 3 different parts of the website need them.
export function futureStay(daysAhead, nights) {
  const arrival = new Date(); // Month DD, YYYY + current time
  arrival.setHours(12, 0, 0, 0); 
  // Set time to 12:00 PM, noon
  // For safe internal time when manipulating dates to avoid timezone/boundary bugs
  arrival.setDate(arrival.getDate() + daysAhead);

  const departure = new Date(arrival); 
  // Create a new Date object for departure based on arrival
  departure.setDate(departure.getDate() + nights);

  // Format the dates for the reservation URL -> YYYY-MM-DD
  function formatUrlDate(date) {
    const year = date.getFullYear(); // 2026
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    // Months are zero-indexed, so we add 1 and pad with leading zero
    const day = String(date.getDate()).padStart(2, "0");
    // Pad the day with leading zero if necessary
    // padStart(2, "0") ensures the string is at least 2 characters long, adding "0" to the start if it's shorter

    return `${year}-${month}-${day}`;
  }

  // Format the dates for the calendar label -> Weekday, Month DD, YYYY
  function formatCalendarLabel(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // Format the dates for the summary -> Month DD YYYY
  function formatSummaryDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .replace(",", "");
  }

  const arrivalSummary = formatSummaryDate(arrival);
  const departureSummary = formatSummaryDate(departure);

  return {
    arrival: formatUrlDate(arrival),
    departure: formatUrlDate(departure),
    arrivalLabel: formatCalendarLabel(arrival),
    departureLabel: formatCalendarLabel(departure),
    summary: `Selected Dates ${arrivalSummary} to ${departureSummary}`,
  };
}

/*
booking
   │
   ├── Which hotel?
   ├── How many guests?
   ├── How far in the future?
   └── How many nights?
                │
                ▼
          futureStay()
                │
       calculate real dates
                │
        ┌───────┼─────────┐
        ▼       ▼         ▼
       URL    Calendar   Summary
    2026-...  Thursday... Selected Dates...
*/