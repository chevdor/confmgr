# List available commands
_default:
  just --choose --chooser "fzf +s -x --tac --cycle"
# Generate the readme as .md
md:
    #!/usr/bin/env bash
    asciidoctor -b docbook -a leveloffset=+1 -o - README.adoc | pandoc   --markdown-headings=atx --wrap=preserve -t markdown_strict -f docbook - > README.md
