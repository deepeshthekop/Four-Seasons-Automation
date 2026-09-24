class ResortPage {
  get heading() {
    return $("h1");
  }

  get form() {
    return $('[role="form"][aria-label="Check Rates and Availability"]');
  }

  get dates() {
    return this.form.$("#datefield-id");
  }

  async selectDate(label) {
    const day = $(`button[aria-label$="${label}"]`);

    // Bounded for this scenario's 30-day lead time and two-night stay.
    // Dates more than three month advances away are not supported here.
    const maximumMonthAdvances = 3;

    for (let month = 0; month < maximumMonthAdvances; month++) {
      const targetDateIsVisible = await day.isDisplayed();
      if (targetDateIsVisible) {
        break;
      }

      await $('button[aria-label="Next month"]').click();
    }

    await day.waitForEnabled({ timeout: 30000 });
    await day.click();
  }

  async setStay(stay) {
    await this.form.waitForDisplayed({ timeout: 30000 });
    await this.dates.click();

    await this.selectDate(stay.arrivalLabel);
    await this.selectDate(stay.departureLabel);

    await $("button=Apply").click();
  }

  async checkRates() {
    await this.form.$("button=Check Rates").click();
  }
}

export default new ResortPage();
