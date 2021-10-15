library(shiny)
library(rgl)

shinyUI(
  fluidPage(
    mainPanel(
      rglwidgetOutput("egg", width = "900px", height = "900px")
    )
  )
)
