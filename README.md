# barchart-hdim
Interactive bar chart for R/Shiny

![alt text](https://raw.githubusercontent.com/alexrfling/barchart/master/img/example.png)

## Overview
`barchart` takes a data frame, and optional parameters, and generates an interactive bar chart of the data. `barchartOutput` and `renderBarchart` are the corresponding Shiny wrappers.

## Boilerplate
Requires the package `htmlwidgets`. If not already installed, run:
```r
install.packages('htmlwidgets')
install.packages('/path/to/barchart_0.1.tar.gz', repos = NULL, type = 'source')
```
To use, run:
```r
library(htmlwidgets)
library(barchart)
```

## Usage

<a name='barchart' href='#barchart'>#</a> __barchart__(_data_, _width_, _height_, _negColor_, _posColor_, _byName_, _ascending_, _enableTransitions_, _filterZeros_, _hardReload_)

Renders an interactive bar chart widget of _data_ with the following optional parameters:
  * _width_ - the width of the widget (default: `NULL`)
  * _height_ - the height of the widget (default: `NULL`)
  * _negColor_ - the color of bars with negative `value` fields (default: `'#dc3912'`)
  * _posColor_ - the color of bars with positive `value` fields (default: `'#109618'`)
  * _byName_ - if `TRUE`, determines bar ordering by comparing their `key` fields; otherwise, their `value` fields are compared (default: `TRUE`)
  * _ascending_ - if `TRUE`, sorts the bars ascending; otherwise, they are sorted descending (default: `TRUE`)
  * _enableTransitions_ - if `TRUE`, the widget will render/update with transitions; otherwise, the widget will render/update without transitions (default: `TRUE`)
  * _filterZeros_ - if `TRUE`, filters out elements whose value is `0` from the bar chart; otherwise, all elements are included in the bar chart (default: `TRUE`)
  * _hardReload_ - if `TRUE`, completely re-renders the widget; otherwise, smoothly transitions the widget (default: `FALSE`)

<a name='barchartOutput' href='#barchartOutput'>#</a> __barchartOutput__(_outputId_, _width_ = '100%', _height_ = '400px')

Shiny UI wrapper.

<a name='renderBarchart' href='#renderBarchart'>#</a> __renderBarchart__(_expr_, _env_ = parent.frame(), _quoted_ = FALSE)

Shiny server wrapper.

### Example
Data in R:
```r
data = data.frame(-6:6)
```
Create an interactive bar chart of `data`:
```r
barchart(data)
```
See <a href='https://github.com/alexrfling/barchart-hdim/blob/master/app.R'>app.R</a> for more example usage.
