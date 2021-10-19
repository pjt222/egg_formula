options(rgl.useNULL = TRUE)
library(shiny)
library(rgl)
library(tidyverse)

source("../egg_coords.R")

function(input, output) {
  output$egg <- renderRglwidget({
    plot_egg(
      L = input$L,
      w = input$w,
      B = input$B,
      DL4 = input$DL4,
      seq01 = input$seq01,
      seq02 = input$seq02,
      color = input$color
    )
    rgl.viewpoint(zoom = .22)
    rglwidget()
  })
}
