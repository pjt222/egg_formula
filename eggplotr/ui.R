options(rgl.useNULL = TRUE)
library(shiny)
library(colourpicker)
library(rgl)
library(shinyWidgets)

fluidPage(
  includeCSS("www/vanish.css"),
  titlePanel("eggplotr"),
  sidebarLayout(
    sidebarPanel(
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
  )
)
