import availability from '../components/availability.component.js';

class ResortPage {
    get heading() { return $('h1'); }
    get availability() { return availability; }
}
export default new ResortPage();
