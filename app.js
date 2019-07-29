(() => {
  class Tab {
    constructor(title = 'New tab', active = false, content = '') {
      this.id = this.uid();
      this.title = ko.observable(title);
      this.content = ko.observable(content);
      this.active = ko.observable(active);
      this.hasFile = ko.observable(false);

      this.dz = null; // dropzone instance
    }

    uid = () => {
      let dt = new Date().getTime();
      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });

      return uuid.replace(/-/g, '');
    }

    activateDropzone() {
      const ele = `[id='${this.id}'] .droppable`;
      const viewerSelector = `[id='${this.id}'] .viewer`;

      this.dz = new Dropzone(ele, {
        url: "#",
        createImageThumbnails: false,
        maxThumbnailFilesize: 10, // MB
        thumbnailWidth: 120,
        maxFiles: 1,
        acceptedFiles: ".csv",
        autoProcessQueue: false,
        // previewTemplate: "",
      });

      this.dz.on("addedfile", file => {
        this.title(file.name);
        this.hasFile(true);

        var reader = new FileReader();
        reader.onload = function (event) {
          const {
            target: {
              result: csv
            }
          } = event;

          const result = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
          });

          const {
            data,
            meta
          } = result;
          const viewer = document.querySelector(viewerSelector);
          const hot = new Handsontable(viewer, {
            data: data,
            rowHeaders: true,
            colHeaders: meta.fields,
            // colHeaders: true,
            columnSorting: true,
            licenseKey: "non-commercial-and-evaluation"
          });
        };

        reader.readAsText(file);
      });
    }

    removeDropzone() {
      if (!this.dz) {
        return;
      }

      this.dz.disable();
    }
  }

  class App {
    constructor(tabs = []) {
      this.tabs = ko.observableArray(tabs);

      this.tabs.subscribe(this.tabChanged, this, "arrayChange");
    }

    tabChanged(data) {
      console.log(data);
      data.forEach(changed => {
        const {
          status,
          value
        } = changed;

        if (status === "deleted") {
          value.removeDropzone();
        } else if (status === "added") {
          setTimeout(() => {
            value.activateDropzone();
          });
        } else {
          throw new Error('Not supported event');
        }
      });
    }

    activateTab(tab) {
      const _tabs = this.tabs().map(t => {
        t.active(t.id === tab.id);

        return t;
      });

      this.tabs(_tabs);
    }

    closeTab(tab) {
      this.tabs.remove(t => t.id === tab.id);
    }

    newTab() {
      const newTab = new Tab();

      this.tabs.push(newTab);
      this.activateTab(newTab);
    }
  }

  const app = new App();
  ko.applyBindings(app);

  app.newTab();
})();