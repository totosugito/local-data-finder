import json

import weaviate
import weaviate.classes as wvc
import weaviate.classes.config as wc
from weaviate.config import AdditionalConfig, Timeout

db_name = "TalentV2"
ollama_api = "http://host.docker.internal:11434"
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
    vectorizer_config=wvc.config.Configure.Vectorizer.text2vec_ollama(model="snowflake-arctic-embed:latest", api_endpoint=ollama_api),
    generative_config=wvc.config.Configure.Generative.ollama(api_endpoint=ollama_api, model="llama3:latest"),
    properties=[
        wc.Property(name="sex", data_type=wc.DataType.TEXT),
        wc.Property(name="connections", data_type=wc.DataType.INT),
        wc.Property(name="followers", data_type=wc.DataType.INT),
        wc.Property(name="about", data_type=wc.DataType.TEXT),
        wc.Property(name="experiences", data_type=wc.DataType.TEXT),
        wc.Property(name="educations", data_type=wc.DataType.TEXT),
        wc.Property(name="licenses", data_type=wc.DataType.TEXT),
        wc.Property(name="skills", data_type=wc.DataType.TEXT),
        wc.Property(name="projects", data_type=wc.DataType.TEXT),
        wc.Property(name="publications", data_type=wc.DataType.TEXT),
        wc.Property(name="courses", data_type=wc.DataType.TEXT),
        wc.Property(name="languages", data_type=wc.DataType.TEXT),
        wc.Property(name="interests", data_type=wc.DataType.TEXT),
        wc.Property(name="name", data_type=wc.DataType.TEXT),
        wc.Property(name="label", data_type=wc.DataType.TEXT),
        wc.Property(name="image", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="summary", data_type=wc.DataType.TEXT),
        wc.Property(name="email", data_type=wc.DataType.TEXT),
        wc.Property(name="city", data_type=wc.DataType.TEXT),
        wc.Property(name="countryCode", data_type=wc.DataType.TEXT),
    ],
)

# ======================================
# fill database
# ======================================
collection_ = client.collections.get(name=db_name)
fid = open('./data/LinkedinDatasetV2.json', mode="r", encoding="utf-8")
data_ = json.load(fid)
fid.close()

for item in data_['data']:
    properties = {
        "sex": item['sex'],
        "connections": item['connections'],
        "followers": item['followers'],
        "about": item['about'],
        "experiences": item['experiences'],
        "educations": item['education'],
        "licenses": item['licenses'],
        "skills": item['skills'],
        "projects": item['projects'],
        "publications": item['publications'],
        "courses": item['courses'],
        "languages": item['languages'],
        "interests": item['interests'],
        "name": item['basics.name'],
        "label": item['basics.label'],
        "image": item['basics.image'],
        "summary": item['basics.summary'],
        "email": item['basics.email'],
        "city": item['basics.location.city'],
        "countryCode": item['basics.location.countryCode'],
    }

    uuid = collection_.data.insert(properties)
    print(f"{item['basics.name']}: {uuid}", end='\n')

# ======================================
# ask the question
# ======================================
# user_input = input("What query do you have for people recommendations? ")
# response = collection_.query.near_text(
#     query=user_input,
#     limit=3
# )
#
# print(f"Here are the recommended for you based on your interest in {user_input}:")
# for item in response.objects:
#     print(item)
#     print(f"Fullname: {item.properties['fullName']}")
#     print(item)
#     print('---\n\n\n')
client.close()
