import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['results'],

  calculateTableSize() {
    console.log('compute resize');
    const scrollWidth = this.element.scrollWidth;
    const {height} = window.getComputedStyle(this.element);

    this.$('.results__reference').css({width: scrollWidth, height});
  },

  didRender() {
    this._super(...arguments);

    this.calculateTableSize();
  },

  didInsertElement() {
    window.addEventListener('resize', () => {
      Ember.run.debounce(this, this.calculateTableSize, 20, true);
    });
  }
});
