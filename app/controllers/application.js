import Ember from 'ember';
const sqlite = requireNode('sqlite3').verbose();
const dialog = requireNode('electron').remote.dialog;

export default Ember.Controller.extend({
  db: null,

  restoreFromLocalStorage() {
    if (window.localStorage.query && window.localStorage.dbPath) {
      if (window.localStorage.query !== 'undefined') {
        this.set('query', window.localStorage.query);
      }

      this.openDbPath(window.localStorage.dbPath);
    }
  },

  setLocalstorage() {
    if (this.get('query')) {
      window.localStorage.query = this.get('query');
    }

    window.localStorage.dbPath = this.get('dbPath');
  },

  parseResults(res) {
    this.set('successMsg', `Query returned successfully with ${res.length} results.`);

    this.set('results', res);
    this.set('firstItem',res[0]);
  },

  clearMessages() {
    this.set('successMsg', null);
    this.set('errMsg', null);
    this.set('loading', true);
    this.set('results', null);
  },

  openDbPath(path) {
    const existing = this.get('db');

    if (existing && existing.close) {
      existing.close();
    }

    const db = new sqlite.Database(path);

    this.set('dbPath', path);
    this.set('db', db);
    this.setLocalstorage();
  },

  actions: {
    openFile() {
      dialog.showOpenDialog((files) => {
        if (files === undefined) {
          return;
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
          return;
        }

        if (!files.match(/.sqlite$/)) {
          return this.set('errMsg', 'You must save a file with the extension ".sqlite"');
        }

        this.openDbPath(files);
      });
    },

    submitQuery(query) {
      this.setLocalstorage();
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
