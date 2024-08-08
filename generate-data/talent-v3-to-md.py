import json

charTitle = '### '


def get_first_name(value):
    ss = value.split(' ')
    if len(ss) > 0:
        return ss[0].lower()
    else:
        return ""


def create_title(value):
    return '## %s\n' % value


def create_single_value(label, value):
    # return '%s : **%s**\n\n' % (label, value)
    return '%s%s\n%s\n\n' % (charTitle, label, value)


def create_list_value(label, values):
    values = values.replace("'", '"')
    vv = json.loads(values)
    if len(vv) == 0:
        return ''

    ss = '%s%s\n' % (charTitle, label)
    for value in vv:
        ss += '- %s\n' % value
    return ss + '\n'


def create_table_experience(label, values):
    values = values.replace("'", '"')
    vv = json.loads(values)
    if len(vv) == 0:
        return ''
    ss = '%s%s\n' % (charTitle, label)
    ss += '| Company | Location | Start Date | End Date | Position | Description |\n'
    ss += '| ----- | ----- | ----- | ----- | ----- | ----- |\n'
    for value in vv:
        ss += '| %s | %s | %s | %s | %s | %s |\n' % (value['company'], value['location'], value['startDate'],
                                                     value['endDate'], value['position'], value['description'])
    return ss + '\n'


def create_table_education(label, values):
    values = values.replace("'", '"')
    vv = json.loads(values)
    if len(vv) == 0:
        return ''
    ss = '%s%s\n' % (charTitle, label)
    ss += '| Institution | Degree | Start Date | End Date | Description |\n'
    ss += '| ----- | ----- | ----- | ----- | ----- |\n'
    for value in vv:
        ss += '| %s | %s | %s | %s | %s |\n' % (value['institution'], value['degree'], value['startDate'],
                                                value['endDate'], value['description'])
    return ss + '\n'


if __name__ == '__main__':
    idxStart = 0
    idxEnd = 4000

    inputFile = './data/LinkedinDatasetV3.json'
    outputDir = './out-md/'
    outputTotalFile = outputDir + 'user_' + str(idxStart + 1).zfill(4) + '-' + str(idxEnd + 1).zfill(4) + '.md'

    # read json input file
    fid = open(inputFile, mode="r", encoding="utf-8")
    data_ = json.load(fid)
    fid.close()

    # create total file output
    fodTotal = open(outputTotalFile, mode='w', encoding="utf-8")

    for i in range(idxStart, idxEnd):
        item = data_['data'][i]

        # create formatted *.MD file
        name_ = item['basics.name']
        print(str(i+1) + '. ' + name_)
        text = create_title(name_)
        text += create_single_value('User ID', str(i + 1))
        text += create_single_value('Fullname', name_)
        text += create_single_value('Connection', item['connections'])
        text += create_single_value('Followers', item['followers'])
        text += create_single_value('About', item['about'])
        text += create_table_experience('Experiences', item['experiences'])  # experiences
        text += create_table_education('Education', item['education'])  # education
        text += create_list_value("Licenses", item['licenses'])  # licenses
        text += create_list_value("Skills", item['skills'])  # skills
        text += create_list_value("Projects", item['projects'])  # projects
        text += create_list_value("Publications", item['publications'])  # publications
        text += create_list_value("Courses", item['courses'])  # courses
        text += create_list_value("Languages", item['languages'])  # languages
        text += create_list_value("Interest", item['interests'])  # interests
        text += create_single_value('Label', item['basics.label'])
        text += create_single_value('Summary', item['basics.summary'])
        text += create_single_value('Email', item['basics.email'])
        text += create_single_value('City', item['basics.location.city'])
        text += create_single_value('Country Code', item['basics.location.countryCode'])

        # write to single *.MD file
        outFile = outputDir + str(i + 1).zfill(4) + '-' + get_first_name(name_) + '.md'
        fod = open(outFile, mode='w', encoding="utf-8")
        fod.write(text)
        fod.close()

        # write total file
        fodTotal.write(text)
        fodTotal.write('\n\n---\n\n')

    # close total file output
    fodTotal.close()
