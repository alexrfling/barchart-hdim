#' @import htmlwidgets
#' @export

# You can learn more about package authoring with RStudio at:
#
#   http://r-pkgs.had.co.nz/
#
# Some useful keyboard shortcuts for package authoring:
#
#   Build and Reload Package:  'Cmd + Shift + B'
#   Check Package:             'Cmd + Shift + E'
#   Test Package:              'Cmd + Shift + T'
barchart <- function (vector, width = NULL, height = NULL, negColor = '#dc3912', posColor = '#109618', byName = TRUE, ascending = TRUE) {

    # read the vector
    data <- vector[, 1]
    nonzero <- which(data != 0)
    data <- cbind(rownames(vector)[nonzero], data[nonzero])
    data <- data.frame(data)
    colnames(data) = c('key', 'value')

    # create a list that contains the settings
    settings <- list(
        id = 'barchart',
        negColor = negColor,
        posColor = posColor,
        byName = byName,
        ascending = ascending
    )

    # pass the data and settings using 'x'
    x <- list(
        data = data,
        settings = settings
    )

    # create the widget
    htmlwidgets::createWidget('barchart', x, width = width, height = height)
}

#' @export
barchartOutput <- function (outputId, width = '100%', height = '400px') {
    shinyWidgetOutput(outputId, 'barchart', width, height, package = 'barchart')
}

#' @export
renderBarchart <- function (expr, env = parent.frame(), quoted = FALSE) {
    if (!quoted) { expr <- substitute(expr) } # force quoted
    shinyRenderWidget(expr, barchartOutput, env, quoted = TRUE)
}
