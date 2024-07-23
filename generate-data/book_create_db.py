import json
import csv
import weaviate
import weaviate.classes as wvc
import weaviate.classes.config as wc
from weaviate.config import AdditionalConfig, Timeout

db_name = "Book"
client = weaviate.connect_to_local(port=8080, grpc_port=50052, additional_config=AdditionalConfig(
    timeout=Timeout(init=2, query=200, insert=120)  # Values in seconds
))
client.collections.delete(name=db_name)
print(client.is_connected())

# ======================================
# create db schema
# ======================================
questions = client.collections.create(
    name=db_name,
    vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_ollama(model="snowflake-arctic-embed:latest",
                                                                      api_endpoint="http://host.docker.internal:11434"),
    generative_config=wvc.config.Configure.Generative.ollama(api_endpoint="http://host.docker.internal:11434",
                                                             model="llama3:latest"),
    properties=[
	wc.Property(name="title", data_type=wc.DataType.TEXT),
        wc.Property(name="isbn10", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="isbn13", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="categories", data_type=wc.DataType.TEXT),
        wc.Property(name="thumbnail", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="description", data_type=wc.DataType.TEXT),
        wc.Property(name="num_pages", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="average_rating", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="published_year", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="authors", data_type=wc.DataType.TEXT, skip_vectorization=True),
    ],
)

# ======================================
# fill database
# ======================================
collection_ = client.collections.get(name=db_name)
f = open("./7k-books-kaggle.csv", "r")
current_book = None
try:
    reader = csv.reader(f)
    # Iterate through each row of data
    for book in reader:
      current_book = book
      # 0 - isbn13
      # 1 - isbn10
      # 2 - title
      # 3 - subtitle
      # 4 - authors
      # 5 - categories
      # 6 - thumbnail
      # 7 - description
      # 8 - published_year
      # 9 - average_rating
      # 10 - num_pages
      # 11 - ratings_count

      properties = {
          "isbn13": book[0],
          "isbn10": book[1],
          "title": book[2],
          "subtitle": book[3],
          "authors": book[4],
          "categories": book[5],
          "thumbnail": book[6],
          "description": book[7],
          "published_year": book[8],
          "average_rating": book[9],
          "num_pages": book[10],
          "ratings_count": book[11],
      }

      uuid = collection_.data.insert(properties)      

      print(f"{book[2]}: {uuid}", end='\n')
except Exception as e:
  print(f"Exception: {e}.")

f.close()

# ======================================
# ask the question
# ======================================
user_input = input("What query do you have for book recommendations? ")
response = collection_.generate.near_text(
    query=user_input,
    limit=2,
    single_prompt="Explain why this book might be interesting to read. The book's title is {title}" #, with a description: {description}, and is in the genre: {categories}."
)


print(f"Here are the recommended books for you based on your interest in {user_input}:")
for book in response.objects:
    print(f"Book Title: {book.properties['title']}")
    print(f"Book Description: {book.properties['description']}")
    print('---\n\n\n')
client.close()
