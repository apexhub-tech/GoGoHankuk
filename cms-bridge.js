/* Shared "fake backend" for testing the Admin Dashboard -> Client Site data flow
   with no real server. Both apps must be served from the SAME origin (same
   host + port) for this to work, since localStorage is scoped per-origin —
   see .claude/launch.json, which serves this whole gogo/ folder as the root.

   window.GGH_CMS.write(partial) merges `partial` into the shared record and
   notifies any other open tab/page on the same origin immediately.
   window.GGH_CMS.read() returns the current shared record.
   window.GGH_CMS.onUpdate(fn) calls fn(record) now and on every future change
   (both same-tab writes and cross-tab writes via the native `storage` event).

   Swap-out plan for a real backend: replace the localStorage read/write in
   this file with Firestore get/onSnapshot/set calls. Nothing in the admin
   dashboard or the client site needs to change — they only ever call
   GGH_CMS.read() / GGH_CMS.write() / GGH_CMS.onUpdate(). */
(function () {
  var KEY = 'ggh_cms_v2';
  var listeners = [];

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function write(partial) {
    var current = read();
    var next = Object.assign({}, current, partial, { updatedAt: new Date().toISOString() });
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('GGH_CMS: could not write to localStorage', e);
    }
    listeners.forEach(function (fn) { fn(next); });
    return next;
  }

  function onUpdate(fn) {
    listeners.push(fn);
    fn(read());
  }

  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    var next = read();
    listeners.forEach(function (fn) { fn(next); });
  });

  window.GGH_CMS = { read: read, write: write, onUpdate: onUpdate, KEY: KEY };
})();
