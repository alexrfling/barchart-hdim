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
barchart <- function(vector, width = NULL, height = NULL) {

  # read the vector
  data <- vector[,1]
  data <- cbind(rownames(vector), data)
  data <- data.frame(data)
  colnames(data) = c("key", "value")

  # create a list that contains the settings
  settings <- list(
    id = "barchart"
  )

  # pass the data and settings using 'x'
  x <- list(
    data = data,
    settings = settings
  )

  # create the widget
  htmlwidgets::createWidget("barchart", x, width = width, height = height)
}

#' @export
barchartOutput <- function(outputId, width = "100%", height = "400px") {
  shinyWidgetOutput(outputId, "barchart", width, height, package = "barchart")
}

#' @export
renderBarchart <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, barchartOutput, env, quoted = TRUE)
}
