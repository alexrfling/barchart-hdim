# if not installed already, run
#   install.packages('htmlwidgets')
#   install.packages('/path/to/barchart_0.1.tar.gz', repos = NULL, type = 'source')
library(htmlwidgets)
library(barchart)

COLORS = list(
    Red = '#dc3912',
    Orange = '#e67300',
    Yellow = '#ff9900',
    Green = '#109618',
    Blue = '#3366cc',
    Purple = '#990099'
)

ui <- fluidPage(

    absolutePanel(top = '0.5%', left = '0.5%', width = '19%', fixed = TRUE,
        wellPanel(style = 'overflow-y: scroll; height: 99vh;',

            sliderInput(inputId = 'length',
                        label = 'Vector length:',
                        min = 0,
                        max = 40,
                        value = 20),

            hr(), #-------------------------------------------------------------

            selectInput(inputId = 'negColor',
                        label = 'Negative bar color:',
                        choices = COLORS,
                        selected = COLORS$Red),

            hr(), #-------------------------------------------------------------

            selectInput(inputId = 'posColor',
                        label = 'Positive bar color:',
                        choices = COLORS,
                        selected = COLORS$Green),

            hr(), #-------------------------------------------------------------

            radioButtons(inputId = 'byName',
                         label = 'Sort bars by:',
                         choices = list(
                             'name' = TRUE,
                             'value' = FALSE
                         ),
                         selected = TRUE),

            hr(), #-------------------------------------------------------------

            radioButtons(inputId = 'ascending',
                         label = 'Order bars:',
                         choices = list(
                             'ascending' = TRUE,
                             'descending' = FALSE
                         ),
                         selected = TRUE),

            hr(), #-------------------------------------------------------------

            checkboxInput(inputId = 'filterZeros',
                          label = 'Filter zeros',
                          value = TRUE),

            hr(), #-------------------------------------------------------------

            checkboxInput(inputId = 'enableTransitions',
                          label = 'Enable transitions',
                          value = TRUE),

            hr(), #-------------------------------------------------------------

            checkboxInput(inputId = 'hardReload',
                          label = 'Hard reload',
                          value = FALSE)
        )
    ),

    absolutePanel(top = '0.5%', left = '20%', right = '0.5%', style = 'height: 99vh',

        barchartOutput(outputId = 'chart', width = '100%', height = '100%')

    )
)

getData <- function (length) {
    data <- rnorm(length)
    data <- data.frame(data)

    if (length > 0) {
        rownames(data) <- sapply(1:length, function (j) { return(paste('Var', j)) })
    }

    return(data)
}

server <- function (input, output) {

    data <- reactive({
        getData(input$length)
    })

    output$chart <- renderBarchart({

        barchart(data(),
            filterZeros = input$filterZeros,
            negColor = input$negColor,
            posColor = input$posColor,
            byName = input$byName,
            ascending = input$ascending,
            enableTransitions = input$enableTransitions,
            hardReload = input$hardReload)
    })
}

shinyApp(ui, server)
