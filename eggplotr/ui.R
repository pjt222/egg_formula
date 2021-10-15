library(shiny)
library(rgl)

shinyUI(
  fluidPage(
  sidebarLayout(
    sidebarPanel(
      sliderInput("L","Length", 1, 10, 8, .5),
      sliderInput("w", "w", 1, 10, 7, .5),
      sliderInput("B", "B" , 1, 10, 3.5, .5),
      sliderInput("DL4", "DL4",1, 10, 5, .5),
      sliderInput("seq01","seq01",0.01, 0.2, 0.05, .05),
      sliderInput("seq02","seq02",1, 15, 2, 1),
      textInput("color","color", "black")
    ),
    mainPanel(
      rglwidgetOutput("egg", width = "900px", height = "900px")
    )
  )  
    
  )
)
