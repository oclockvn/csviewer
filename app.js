(() => {
  class Tab {
    constructor(title = 'New tab', active = false, content = '') {
      this.id = this.uid();
      this.title = ko.observable(title);
      this.content = ko.observable(content);
      this.active = ko.observable(active);
    }

    uid = () => {
      let dt = new Date().getTime();
      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });

      return uuid;
    }
  }

  class App {
    constructor(tabs = []) {
      this.tabs = ko.observableArray(tabs);
    }

    activateTab (tab) {
      const _tabs = this.tabs().map(t => {
        t.active(t.id === tab.id);

        return t;
      });

      this.tabs(_tabs);
    }

    closeTab (tab) {
      this.tabs.remove(t => t.id === tab.id);
    }

    newTab() {
      const newTab = new Tab();

      this.tabs.push(newTab);
      this.activateTab(newTab);
    }
  }

  const app = new App([
    new Tab('New tab', true),
    new Tab(),
    new Tab(),
    new Tab()
  ]);

  ko.applyBindings(app);
})();