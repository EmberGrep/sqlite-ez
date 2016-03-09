import Ember from 'ember';
const sqlite = requireNode('sqlite3').verbose();
const dialog = requireNode('electron').remote.dialog;
const fs = requireNode('fs');

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

  openDbPath(path) {
    const db = new sqlite.Database(path);

    this.set('dbPath', path);
    this.set('db', db);
  },

  actions: {
    openFile() {
      dialog.showOpenDialog((files) => {
        if (files === undefined) {
          return
        }

        if (!files[0].match(/.sqlite$/)) {
          return this.set('errMsg', 'You must select an SQLite database to open');
        }

        this.openDbPath(files[0]);
      });
    },

    createFile() {
      dialog.showSaveDialog({defaultPath: 'database.sqlite'}, (files) => {
        if (files === undefined) {
          return
        }

        if (!files.match(/.sqlite$/)) {
          return this.set('errMsg', 'You must save a file with the extension ".sqlite"');
        }

        this.openDbPath(files);
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
