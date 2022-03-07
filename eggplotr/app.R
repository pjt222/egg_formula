source("R/0_libraries.R")
source("R/1_engine_definitions.R")
source("R/egg_coords.R")
source("ui.R")
source("server.R")

shinyApp(ui = ui, server = server)
