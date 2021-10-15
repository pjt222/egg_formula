library(shiny)
library(rgl)

shinyUI(
  fluidPage(
    mainPanel(
      rglwidgetOutput("egg"),
      width = 10,
      offset = 2
    )
  )
)
