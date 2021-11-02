options(rgl.useNULL = TRUE)
library(shiny)
library(colourpicker)
library(rgl)
library(shinyWidgets)
library(threejs)

fluidPage(
  includeCSS("www/vanish.css"),
  titlePanel("eggplotr"),
  sidebarLayout(
    sidebarPanel(
      selectInput("e", "engine", c("rgl", "threejs")),
      sliderInput("L", "Length", 1, 20, 8, .5, ticks = FALSE),# animate = TRUE),
      sliderInput("w", "w", 1, 20, 7, .5, ticks = FALSE),# animate = TRUE),
      sliderInput("B", "B", 1, 10, 3.5, .5, ticks = FALSE),# animate = TRUE),
      sliderInput("DL4", "DL4", 1, 10, 5, .5, ticks = FALSE),# animate = TRUE),
      sliderInput("seq01", "seq01", 0.01, 0.2, 0.05, .01, ticks = FALSE),# animate = TRUE),
      sliderInput("seq02", "seq02", 1, 15, 2, 1, ticks = FALSE),# animate = TRUE),
      colourInput("color", "color", "orange")
    ),
    mainPanel(
      tabsetPanel(
        id = "engine_tabs",
        type = "hidden",
        tabPanel("rgl", rglwidgetOutput("egg_rgl", width = "900px", height = "900px")),
        tabPanel("threejs", scatterplotThreeOutput("egg_threejs", width = "900px", height = "900px"))
      )
    )
  )
)
