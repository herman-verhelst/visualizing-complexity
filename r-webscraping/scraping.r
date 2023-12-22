library(rvest)

url <- "https://www.wikipedia.org/"
webpage <- read_html(url)

paragraphs <- webpage %>%
  html_nodes("p") %>%
  html_text()

print(paragraphs)

