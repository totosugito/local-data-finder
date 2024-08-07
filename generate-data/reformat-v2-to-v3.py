import json

inputFile = './data/LinkedinDatasetV2.json'
outputFile = './data/LinkedinDatasetV3.json'

fid = open(inputFile, mode="r", encoding="utf-8")
data_ = json.load(fid)
fid.close()

idxMale = 1
idxFemale = 1
for item in data_['data']:
    sex = item['sex']
    if sex == 'Male':
        filename = 'males/' + str(idxMale) + '.jpg'
        idxMale += 1
    else:
        filename = 'females/' + str(idxFemale) + '.jpg'
        idxFemale += 1

    item['basics.image'] = filename

contents = json.dumps({"data": data_}, indent=1)
fod = open(outputFile, mode="w", encoding="utf-8")
fod.write(contents)
fod.close()
print(idxMale)
print(idxFemale)