import json

import weaviate
import weaviate.classes as wvc
import weaviate.classes.config as wc
from weaviate.config import AdditionalConfig, Timeout

db_name = "Talent"
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
        wc.Property(name="userId", data_type=wc.DataType.TEXT),
        wc.Property(name="fullName", data_type=wc.DataType.TEXT),
        wc.Property(name="workplace", data_type=wc.DataType.TEXT),
        wc.Property(name="location", data_type=wc.DataType.TEXT),
        wc.Property(name="connections", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="followers", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="about", data_type=wc.DataType.TEXT),
        #wc.Property(name="thumbnail", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="experiences", data_type=wc.DataType.TEXT),
        wc.Property(name="educations", data_type=wc.DataType.TEXT),
        wc.Property(name="licenses", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="volunteering", data_type=wc.DataType.TEXT, skip_vectorization=True),
        wc.Property(name="skills", data_type=wc.DataType.TEXT),
        wc.Property(name="interests", data_type=wc.DataType.TEXT),
        wc.Property(name="activities", data_type=wc.DataType.TEXT),
    ],
)

# ======================================
# fill database
# ======================================
collection_ = client.collections.get(name=db_name)
fid = open('./data/LinkedinDataset.json', mode="r", encoding="utf-8")
data_ = json.load(fid)
fid.close()

for item in data_['data']:
    # print(item['ID'])
    # json.loads(item["Educations"].replace("'", '"'))
    # json.loads(item["Skills"].replace("'", '"'))
    # json.loads(item["Experiences"].replace("'", '"'))

    key_ = 'Workplace'
    Workplace = ''
    if key_ in item:
    	Workplace = item[key_]

    key_ = 'Location'
    Location = ''
    if key_ in item:
    	Location = item[key_]

    key_ = 'Connections'
    Connections = ''
    if key_ in item:
    	Connections = item[key_]

    key_ = 'Followers'
    Followers = ''
    if key_ in item:
    	Followers = item[key_]

    key_ = 'About'
    About = ''
    if key_ in item:
    	About = item[key_]

    key_ = 'Experiences'
    Experiences = ''
    if key_ in item:
    	Experiences = item[key_]

    key_ = 'Educations'
    Educations = ''
    if key_ in item:
    	Educations = item[key_]

    key_ = 'Licenses'
    Licenses = ''
    if key_ in item:
    	Licenses = item[key_]

    key_ = 'Volunteering'
    Volunteering = ''
    if key_ in item:
    	Volunteering = item[key_]

    key_ = 'Skills'
    Skills = ''
    if key_ in item:
    	Skills = item[key_]

    key_ = 'Interests'
    Interests = ''
    if key_ in item:
    	Interests = item[key_]

    key_ = 'Activities'
    Activities = ''
    if key_ in item:
    	Activities = item[key_]

    properties = {
          "userId": item['ID'],
          "fullName": item['FullName'],
          "workplace": Workplace,
          "location": Location,
          "connections": Connections,
          "followers": Followers,
          "about": About,
          #"thumbnail": item['Thumbnail'],
          "experiences": Experiences,
          "educations": Educations,
          "licenses": Licenses,
          "volunteering": Volunteering,
          "skills": Skills,
          "interests": Interests,
          "activities": Activities,
      }

    uuid = collection_.data.insert(properties)
    #uuid = collection_.data.insert(item)
    print(f"{item['FullName']}: {uuid}", end='\n')

# ======================================
# ask the question
# ======================================
user_input = input("What query do you have for people recommendations? ")
response = collection_.query.near_text(
    query=user_input,
    limit=3
)

print(f"Here are the recommended for you based on your interest in {user_input}:")
for item in response.objects:
    print(item)
    print(f"Fullname: {item.properties['fullName']}")
    print(item)
    print('---\n\n\n')
client.close()
