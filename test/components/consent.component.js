class ConsentComponent {
    async dismissIfPresent() {
        const accept = $('#onetrust-accept-btn-handler');
        // OneTrust loads asynchronously; absence is allowed, interaction failures are not.
        try {
            await accept.waitForDisplayed({ timeout: 8000 });
        } catch (error) {
            if (!(await accept.isDisplayed())) return;
            throw error;
        }
        await accept.click();
        await $('#onetrust-banner-sdk').waitForDisplayed({ reverse: true });
    }
}
export default new ConsentComponent();
