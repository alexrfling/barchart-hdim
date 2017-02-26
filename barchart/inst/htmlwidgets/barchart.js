// NOTE http://www.htmlwidgets.org/develop_intro.html

HTMLWidgets.widget({

    name: 'barchart',

    type: 'output',

    factory: function (el, width, height) {

        var chart = new Barchart(el.id, height);

        return {
            renderValue: function (x) {
                var negColor = x.settings.negColor;
                var posColor = x.settings.posColor;
                var byName = (x.settings.byName === 'TRUE' ? true : false);
                var descending = (x.settings.descending === 'TRUE' ? true : false);

                if (!chart.data) {
                    var data = HTMLWidgets.dataframeToD3(x.data);

                    chart.initializeVis(data, negColor, posColor, byName, descending);

                } else if (negColor !== chart.negColor || posColor !== chart.posColor) {

                    chart.updateColors(negColor, posColor);

                } else if (byName !== chart.byName || descending !== chart.descending) {

                    chart.updateSort(byName, descending);

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
