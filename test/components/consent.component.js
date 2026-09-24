/*
The cookie-consent banner isn't really a page. 
It's a UI component/overlay that can appear on top of a page.
*/

class ConsentComponent {
  async dismissIfPresent() {
    const accept = $("#onetrust-accept-btn-handler");

    // OneTrust loads asynchronously; absence is allowed, interaction failures are not.
    try {
      await accept.waitForDisplayed({ timeout: 8000 });
      // Wait for the accept button to be displayed, with a timeout of 8 seconds
    } catch (error) {
      if (!(await accept.isDisplayed())) {
        return false;
      }
      throw error;
    }
    await accept.click();
    await $("#onetrust-banner-sdk").waitForDisplayed({ reverse: true });
    // Wait for the banner to disappear after clicking accept
    return true;
  }
}
export default new ConsentComponent();

/*
Consent appeared
      ↓
Accept button displayed
      ↓
Click Accept
      ↓
Wait for banner to disappear
      ↓
Continue test
*

/*
The consent banner is optional, so if the Accept button genuinely isn't displayed, I return false and continue. 
But I don't want to catch and ignore every exception because that could hide a real WebDriver or interaction problem. 
If the element is actually displayed and the wait still failed, I rethrow the original error so the test fails with useful diagnostic information.
That is the reason why we use throw error instead of just returning false.
*/

/*
wait failed
    ↓
Is Accept actually absent?
    ↓
YES → that's okay → return false

NO → something unexpected happened
    ↓
throw original error
    ↓
test fails
*/
