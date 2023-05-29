from bs4 import BeautifulSoup
import requests

url = 'https://careers.google.com/jobs/results/?distance=50&has_remote=false&hl=en_US&jlo=en_US&q=software%20engineer'

result = requests.get(url)
print(result)
doc = BeautifulSoup(result.text, "html.parser")
print(doc.prettify()) 
title = doc.find_all(string="Software Engineer")
parent = title[0].parent
print(parent)

print(doc.prettify())

