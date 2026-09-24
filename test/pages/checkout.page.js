class CheckoutPage {
    get bookingBtn() {
        return $('button[data-cy="EnhanceViewContinueButton"]');
    }

    get PrimaryGuestFirstName() {
        return $('#primaryFirstName');
    }

    get PrimaryGuestLastName() {
        return $('#primaryLastName');
    }

    get PrimaryGuestEmail() {
        return $('#primaryEmail');
    }

    get PrimaryGuestPhone() {
        return $('#primaryPhone');
    }

    get PrimaryGuestCountry() {
        return $('#primaryCountry');
    }

    get PrimaryGuestNameOnCard() {
        return $('#paymentName');
    }

    get PrimaryGuestCardNumber() {
        return $('#paymentCardNumber');
    }


    async completeBooking() {
        await 
        
        
        await this.bookingBtn.waitForClickable({ timeout: 30000 });
        await this.bookingBtn.click();
    }

}

export default new CheckoutPage();