class CheckoutPage {
  get enhancementsBtn() {
    return $('button[data-cy="EnhanceViewContinueButton"]');
  }

  get firstName() {
    return $("#primaryFirstName");
  }

  get lastName() {
    return $("#primaryLastName");
  }

  get email() {
    return $("#primaryEmail");
  }

  get phone() {
    return $("#primaryPhone");
  }

  get country() {
    return $("#primaryCountry");
  }

  get nameOnCard() {
    return $("#paymentName");
  }

  get cardNumber() {
    return $("#paymentCardNumber");
  }

  get expirationDate() {
    return $("#paymentExpiry");
  }

  get confirmationCheckbox() {
    return $("#confirmation-checkbox");
  }

  get bookingBtn() {
    return $('button[type="submit"]');
  }

  async tapEnhancementsBtn() {
    await this.enhancementsBtn.waitForClickable({ timeout: 30000 });
    await this.enhancementsBtn.click();
  }

  async waitForBookingForm() {
    await this.firstName.waitForDisplayed({ timeout: 30000 });
    await this.firstName.waitForEnabled({ timeout: 30000 });
  }

  async fillGuestDetails(guest) {
    await this.firstName.setValue(guest.firstName);
    await this.lastName.setValue(guest.lastName);
    await this.email.setValue(guest.email);
    await this.phone.setValue(guest.phone);
    await this.country.selectByVisibleText(guest.country);
  }

  async fillGuestPaymentDetails(guest) {
    await this.nameOnCard.setValue(guest.nameOnCard);
    await this.cardNumber.setValue(guest.cardNumber);
    await this.expirationDate.setValue(guest.expirationDate);
  }

  async acceptConfirmation() {
    await this.confirmationCheckbox.waitForClickable({ timeout: 30000 });

    if (!(await this.confirmationCheckbox.isSelected())) {
      await this.confirmationCheckbox.click();
    }
  }

  async completeBooking() {
    await this.bookingBtn.waitForClickable({ timeout: 30000 });
    await this.bookingBtn.click();
  }
}

export default new CheckoutPage();
