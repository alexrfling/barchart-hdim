HTMLWidgets.widget({

  name: "barchart",

  type: "output",

  factory: function(el, width, height) {

    // http://www.htmlwidgets.org/develop_intro.html

    return {
      renderValue: function(x) {
        var data = HTMLWidgets.dataframeToD3(x.data);
        barchart(el.id, height, data, x.settings.negColor, x.settings.posColor);
      },

      resize: function(width, height) {
        // barchart handles its own resizing (except for height...)
      }
    };
  }
});
