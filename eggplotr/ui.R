options(rgl.useNULL = TRUE)
library(shiny)
library(colourpicker)
library(rgl)
library(shinyWidgets)

fluidPage(
  titlePanel("eggplotr"),
  sidebarLayout(
    sidebarPanel(
      tags$head(
        tags$style("
          .irs-bar-edge, .irs-bar, .irs-single, .irs-from, .irs-to
            {
              background: #696969 !important;
              border-color: #000000 !important;
              border-width: 2px !important;
            }
          .well
            {
              background-color:#696969;
              border-style:none;
              border-color:#696969;
              border-width:0px;
            }
          ")
      ),
      sliderInput("L", "Length", 1, 20, 8, .5, ticks = FALSE, animate = TRUE),
      sliderInput("w", "w", 1, 20, 7, .5, ticks = FALSE, animate = TRUE),
      sliderInput("B", "B", 1, 10, 3.5, .5, ticks = FALSE, animate = TRUE),
      sliderInput("DL4", "DL4", 1, 10, 5, .5, ticks = FALSE, animate = TRUE),
      sliderInput("seq01", "seq01", 0.01, 0.2, 0.05, .01, ticks = FALSE, animate = TRUE),
      sliderInput("seq02", "seq02", 1, 15, 2, 1, ticks = FALSE, animate = TRUE),
      colourInput("color", "color", "orange")
    ),
    mainPanel(
      rglwidgetOutput("egg", width = "900px", height = "900px")
    )
  ),
  setBackgroundColor("#696969")
)
