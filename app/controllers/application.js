import Ember from 'ember';
const sqlite = requireNode('sqlite3').verbose();
const db = new sqlite.Database(':memory:');

export default Ember.Controller.extend({
  parseResults(res) {
    this.set('successMsg', `Query returned successfully with ${res.length} results.`);
  },

  clearMessages() {
    this.set('successMsg', null);
    this.set('errMsg', null);
    this.set('loading', true);
  },

  actions: {
    submitQuery(query) {
      this.clearMessages();

      db.serialize(() => {
        this.set('loading', false);
        db.all(query, (err, res) => {
          if (err) {
            return this.set('errMsg', err.message);
          }

          this.parseResults(res);
        });
      });
    },
  },
});
