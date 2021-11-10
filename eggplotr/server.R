server <- function(input, output, session) {
  waiter_hide()

  w <- Waiter$new(
    id = c("egg_rgl", "egg_threejs"),
    html = spin_pulsar(),
    color = "#696969"
  )
  
  observeEvent(
    c(input$L, input$w, input$B, input$DL4, input$seq01, input$seq02, input$color),
    {
     shinyGetPar3d("userMatrix", session)
    },
    ignoreInit = TRUE
  )

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
        engine = "rgl" # input$e
        # , userMatrix = input$par3d$userMatrix
      )
      rgl.viewpoint(zoom = .5)
      par3d(userMatrix = input$par3d$userMatrix)
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
        engine = "threejs" # input$e
      )
    })
  }

  observeEvent(input$e, {
    w$show()
    updateTabsetPanel(inputId = "engine_tabs", selected = input$e)
    w$hide()
  })
}
