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
                var ascending = (x.settings.ascending === 'TRUE' ? true : false);

                if (!chart.data) {
                    var data = HTMLWidgets.dataframeToD3(x.data);
                    var options = {
                        negColor: negColor,
                        posColor: posColor,
                        byName: byName,
                        ascending: ascending
                    };

                    chart.initializeVis(data, options);

                } else if (negColor !== chart.negColor || posColor !== chart.posColor) {

                    chart.updateColors(negColor, posColor);

                } else if (byName !== chart.byName || ascending !== chart.ascending) {

                    chart.updateSort(byName, ascending);

                } else {
                    var data = HTMLWidgets.dataframeToD3(x.data);

                    chart.updateData(data);
                }
            },

            resize: function (width, height) {
                // Barchart automatically resizes width
                chart.resize(height);
            }
        };
    }
});
