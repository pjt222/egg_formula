# Must be executed BEFORE rgl is loaded on headless devices.
# options(rgl.useNULL = TRUE)

library(shiny)
library(rgl)
library(tidyverse)

source("../egg_coords.R")

shinyServer(
  function(input, output) {
    output$egg <- renderRglwidget({
      plot_egg(
        L = 8,
        w = 7,
        B = 3.5,
        DL4 = 5.0,
        seq01 = 0.05,
        seq02 = 2,
        color = "black"
      )
      rglwidget()
    })
  }
)
