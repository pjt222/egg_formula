ui <- fluidPage(
  useWaiter(),
  waiterShowOnLoad(spin_pulsar(), color = "#696969"),
  includeCSS("www/vanish.css"),
  titlePanel("eggplotr"),
  sidebarLayout(
    sidebarPanel(
      selectInput("e", "engine", c("b.r.a.i.n.","rgl", "rgl_persp", "threejs")),
      sliderInput("L", "L", 1, 20, 8, .5, ticks = FALSE), # animate = TRUE),
      sliderInput("w", "w", 1, 20, 7, .5, ticks = FALSE), # animate = TRUE),
      sliderInput("B", "B", 1, 10, 3.5, .5, ticks = FALSE), # animate = TRUE),
      sliderInput("DL4", "DL4", 1, 10, 5, .5, ticks = FALSE), # animate = TRUE),
      sliderInput("seq01", "seq01", 0.01, 0.2, 0.05, .01, ticks = FALSE), # animate = TRUE),
      sliderInput("seq02", "seq02", 1, 15, 2, 1, ticks = FALSE), # animate = TRUE),
      colourInput("color", "color", "#e67e22")
    ),
    mainPanel(
      tabsetPanel(
        id = "engine_tabs",
        selected = "b.r.a.i.n.",
        type = "hidden",
        tabPanel("b.r.a.i.n.", htmlOutput("egg_brain", width = "900px", height = "900px")),
        tabPanel("rgl", rglwidgetOutput("egg_rgl", width = "900px", height = "900px")),
        tabPanel("rgl_persp", rglwidgetOutput("egg_rgl_persp", width = "900px", height = "900px")),
        tabPanel("threejs", scatterplotThreeOutput("egg_threejs", width = "900px", height = "900px"))
      )
    )
  )
)
