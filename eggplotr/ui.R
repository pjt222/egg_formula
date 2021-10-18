library(shiny)
library(rgl)
library(shinyWidgets)

fluidPage(
  titlePanel("eggplotr"),
  sidebarLayout(
    sidebarPanel(
      chooseSliderSkin(skin = "Flat", color = "orange"),
      # setSliderColor(rep("#000000",6), c(1:6)),
      sliderInput("L", "Length", 1, 20, 8, .5),
      sliderInput("w", "w", 1, 20, 7, .5),
      sliderInput("B", "B", 1, 10, 3.5, .5),
      sliderInput("DL4", "DL4", 1, 10, 5, .5),
      sliderInput("seq01", "seq01", 0.01, 0.2, 0.05, .01),
      sliderInput("seq02", "seq02", 1, 15, 2, 1),
      textInput("color", "color", "orange"),
      tags$style(".well {
                 background-color:#696969;
                 border-color:#696969;
                 border-width:0px;
                 }")
    ),
    mainPanel(
      rglwidgetOutput("egg", width = "900px", height = "900px")
    )
  ),
  setBackgroundColor("#696969")
)
