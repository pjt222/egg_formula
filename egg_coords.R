#' @param L Eilänge
#' @param w maximalen Breite
#' @param B Abstand zwischen dem Bereich der maximalen Breite und der halben Länge des Eies
#' @param DL4 Eidurchmesser (ein Viertel der Eilänge vom spitzen Ende entfernt)
#' @param seq01 Schrittweite der x-achse
#' @param seq01 Schrittweite in in Grad in sclice_to_circle
#' @param color Color passed to plot3d
plot_egg <- function(
  L = 8, # Eilänge
  w = 3.5 * 2, # 
  B = 1.7 * 2, # 
  DL4 = 3.3 * 2, # 
  seq01 = 0.01,
  seq02 = 1,
  color = "#696969",
  ...
) {
  # libraries ----
  library(tidyverse)
  library(rgl)
  # constants ----
  x <- seq(-L / 2, L / 2, by = L * seq01)
  # functions -----
  Term1 <- function(x, ...) {
    # TODO mind + -
    B / 2 * ((L^2 - 4 * x^2) / (L^2 + 8 * w * x + 4 * w^2))^.5
  }
  
  Term21 <- function(x, ...) {
    (
      (5.5 * L^2 + 11 * L * w + 4 * w^2)^.5 * (3^.5 * B * L - 2 * DL4 * (L^2 + 2 * w * L + 4 * w^2)^.5)
    ) /
      (
        3^.5 * B * L * ((5.5 * L^2 + 11 * L * w + 4 * w^2)^.5 - 2 * (L^2 + 2 * w * L + 4 * w^2)^.5)
      )
  }
  Term22 <- function(x, ...) {
    1 - (
      (
        L * (L^2 + 8 * w * x + 4 * w^2)
      ) /
        (
          2 * (L - 2 * w) * x^2 + (L^2 + 8 * L * w - 4 * w^2) * x + 2 * L * w^2 + L^2 * w + L^3
        )
    )^.5
  }
  
  # create data ----
  Term2 <- 1 - Term21(x) * Term22(x)
  
  res <- Term1(x) * Term2
  
  egg_slice <- data.frame(
    x = x,
    y_p = res
  ) %>%
    pivot_longer(
      cols = starts_with("y_"),
      names_to = "y_direction",
      values_to = "y"
    )
  
  slice_to_circle <- lapply(seq_along(egg_slice$x), function(u) {
    tibble(
      theta_slice = seq.int(0, 360, seq02),
      x = egg_slice[["x"]][u],
      y_slice = round(sin(theta_slice), 8),
      z = round(cos(theta_slice), 8)
    )
  })
  
  slice_to_circle <- bind_rows(slice_to_circle)
  
  all_egg_slices <- full_join(
    x = egg_slice,
    y = slice_to_circle,
    by = "x"
  ) %>%
    mutate(
      y_one = y * y_slice,
      z_one = y * z,
      y_two = y * z,
      z_two = y * y_slice
    ) %>%
    select(-c(y_slice, y, z, y_direction)) %>%
    pivot_longer(
      cols = starts_with("y_"),
      names_to = "direction_y",
      values_to = "y"
    ) %>%
    pivot_longer(
      cols = starts_with("z_"),
      names_to = "direction_z",
      values_to = "z"
    ) %>%
    select(x, y, z) %>%
    distinct() %>%
    mutate(
      yEQz = ifelse(y == z, TRUE, FALSE)
    ) %>%
    filter(
      !(yEQz)
    )
  
  # plot ----
  plot3d(
    x = all_egg_slices$x,
    y = all_egg_slices$y,
    z = all_egg_slices$z,
    col = color,
    alpha = .1,
    axes = FALSE,
    box = FALSE,
    add = FALSE,
    axis.scales = FALSE,
    xlim = c(-L + 1, L + 1), ylim = c(-L + 1, L + 1), zlim = c(-L + 1, L + 1),
    xlab = "", ylab = "", zlab = ""
  )
}






