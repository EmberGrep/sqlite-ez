import Ember from 'ember';
const sqlite = requireNode('sqlite3').verbose();
const dialog = requireNode('electron').remote.dialog;

export default Ember.Controller.extend({
  db: null,

  parseResults(res) {
    this.set('successMsg', `Query returned successfully with ${res.length} results.`);
  },

  clearMessages() {
    this.set('successMsg', null);
    this.set('errMsg', null);
    this.set('loading', true);
  },

  actions: {
    openDb() {
      dialog.showOpenDialog((files) => {
        if (files === undefined) {
          return
        }

        if (!files[0].match(/.sqlite$/)) {
          return this.set('errMsg', 'You must select an SQLite database to open');
        }

        const db = new sqlite.Database(files[0]);

        this.set('db', db);
      });
    },

    submitQuery(query) {
      this.clearMessages();

      const db = this.get('db');

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
