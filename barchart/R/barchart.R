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
barchart <- function (vector,
                      width = NULL,
                      height = NULL,
                      filterZeros = TRUE,
                      negColor = '#dc3912',
                      posColor = '#109618',
                      byName = TRUE,
                      ascending = TRUE,
                      noTransition = FALSE,
                      hardReload = FALSE) {

    # convert the vector (a data frame) into a friendlier format
    data <- vector[, 1]

    if (filterZeros) {
        nonzeros <- which(data != 0)
        data <- cbind(rownames(vector)[nonzeros], data[nonzeros])
    } else {
        data <- cbind(rownames(vector), data)
    }

    data <- data.frame(data)
    colnames(data) <- c('key', 'value')

    options <- list(
        negColor = negColor,
        posColor = posColor,
        byName = byName,
        ascending = ascending,
        noTransition = noTransition,
        hardReload = hardReload
    )

    # pass the data and options using 'x'
    x <- list(
        data = data,
        options = options
    )

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
