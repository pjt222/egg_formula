server <- function(input, output) {
  waiter_hide()
  
  output$egg_rgl <- {
    renderRglwidget({
      plot_egg(
        L = input$L,
        w = input$w,
        B = input$B,
        DL4 = input$DL4,
        seq01 = input$seq01,
        seq02 = input$seq02,
        color = input$color,
        engine = "rgl"#input$e
      )
      rgl.viewpoint(zoom = .5)
      rglwidget()
    })
  }

  output$egg_threejs <- {
    renderScatterplotThree({
      plot_egg(
        L = input$L,
        w = input$w,
        B = input$B,
        DL4 = input$DL4,
        seq01 = input$seq01,
        seq02 = input$seq02,
        color = input$color,
        engine = "threejs"#input$e
      )
    })
  }
  
  observeEvent(input$e, {
    updateTabsetPanel(inputId = "engine_tabs", selected = input$e)
  })
}
