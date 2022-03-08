engine_definition_brain <<- paste0(
  c(
    "
    <h1 style='color: black;'>Welcome to <em>eggplotr</em></h1>
    <p style='color: black;'>This app aimes to vizualise the 'egg-formula' presented in <em>Egg and math: introducing a universal formula for egg shape</em> by Valeriy G. Narushin, Michael N. Romanov and Darren K. Griffin (<a href='https://doi.org/10.1111/nyas.14680' style='color: black;' target='_blank' title='Egg and math: introducing a universal formula for egg shape' rel='noopener'>https://doi.org/10.1111/nyas.14680</a>).</p>
    <h2 style='color: black;'>egg-formula</h2>
    ",
    # formula
    # katex::katex_html(katex::example_math()),
    "$$\\alpha^2-\\beta$$",
    "
    <h2 style='color: black;'>engines</h2>
    <p style='color: black;'><strong></strong>There are currently four engines implemented to choose from.</p>
    <h3 style='color: black;'>b.r.a.i.n.</h3>
    <p style='color: black;'>The first ist the the <em>b.r.a.i.n.</em> engine (<strong>b</strong>iological <strong>r</strong>einforced <strong>a</strong>rtificial <strong>i</strong>ntelligence <strong>n</strong>etwork) wich is owned by every human, but used by less. To use this engine in conjuction with eggplotr just set <em>savant_mode=true&nbsp;</em>and use the following formula to visualize the result with your inner eye.</p>
    <h3 style='color: black;'>rgl and rgl_persp</h3>
    <p style='color: black;'>The second ('rgl') and third ('rgl_persp') both are based on the R-package <a href='https://dmurdoch.github.io/rgl/' style='color: black;'><em>rgl</em></a> and use the functions <em>plot3d</em> to create a scatterplot or the functions <em>shade3d</em>, <em>turn3d</em> an <em>material3d</em> to create an surface plot.</p>
    <h3 style='color: black;'>threejs</h3>
    <p style='color: black;'>The fourth is based on the R-package <em><a href='https://cran.r-project.org/web/packages/threejs/threejs.pdf' style='color: black;'>threejs</a>&nbsp;</em>and the function <em>scatterplot3js</em> to create an scatterplot.</p>
    "
  ),
  sep = "<br>"
)
