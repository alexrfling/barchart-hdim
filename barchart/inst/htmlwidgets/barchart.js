// NOTE http://www.htmlwidgets.org/develop_intro.html

HTMLWidgets.widget({

    name: 'barchart',

    type: 'output',

    factory: function (el, width, height) {

        var chart = new Barchart(el.id, height);

        return {
            renderValue: function (x) {
                if (x.data && !chart.data) {
                    var data = HTMLWidgets.dataframeToD3(x.data);
                    chart.initializeVis(data, x.settings.negColor, x.settings.posColor);
                } else if (x.settings.negColor !== chart.negColor || x.settings.posColor !== chart.posColor) {
                    chart.updateColors(x.settings.negColor, x.settings.posColor);
                } else {
                    var data = HTMLWidgets.dataframeToD3(x.data);
                    chart.updateData(data);
                }
            },

            resize: function (width, height) {
                // Barchart handles its own resizing (except for height...)
            }
        };
    }
});
