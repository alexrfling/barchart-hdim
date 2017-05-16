// NOTE http://www.htmlwidgets.org/develop_intro.html

HTMLWidgets.widget({

    name: 'barchart',

    type: 'output',

    factory: function (el, width, height) {

        var chart = new Barchart(el.id);

        // booleans converted from R may be true, false, 'TRUE', or 'FALSE'
        function getBool (bool) {
            return (bool === true || bool === 'TRUE');
        }

        return {
            renderValue: function (x) {
                var negColor = x.options.negColor;
                var posColor = x.options.posColor;
                var byName = getBool(x.options.byName);
                var ascending = getBool(x.options.ascending);
                var noTransition = getBool(x.options.noTransition);
                var hardReload = getBool(x.options.hardReload);

                if (!chart.data || hardReload) {
                    var data = HTMLWidgets.dataframeToD3(x.data);
                    var options = {
                        height: height,
                        negColor: negColor,
                        posColor: posColor,
                        byName: byName,
                        ascending: ascending,
                        noTransition: noTransition
                    };

                    chart.initialize(data, options);

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
