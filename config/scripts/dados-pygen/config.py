import sys
import json
import getpass
import requests

with open('settings.json') as jsonfile:
	settings = json.load(jsonfile)

username = raw_input('Admin username: ')
password = getpass.getpass('Admin password: ')

url = settings['url']
token = ''
payload = { 'identifier': username, 'password': password }

# save and store headers
r = requests.post(url + '/auth/local', data=json.dumps(payload))
if r.status_code != 200:
  print "Invalid credentials given."
  sys.exit()

token = json.loads(r.text)['token']['payload']
headers = { 'Authorization': 'Bearer ' + token }

# call API to determine totals to establish baseline counts
users = requests.get(url + '/api/user', headers=headers)
subjects = requests.get(url + '/api/subject', headers=headers)
studies = requests.get(url + '/api/study', headers=headers)
centres = requests.get(url + '/api/collectioncentre', headers=headers)
userEnrollments = requests.get(url + '/api/userenrollment', headers=headers)
subjectEnrollments = requests.get(url + '/api/subjectenrollment', headers=headers)

# set next user to be created based on existing total
minCoord = int(json.loads(users.text)['total']) + int(json.loads(subjects.text)['total']) + 1
maxCoord = minCoord + settings['user_limit']

# min/max number of studies to be created
numStudy = int(json.loads(studies.text)['total'])
minStudy = numStudy + 1 if (numStudy > 0) else 1
maxStudy = minStudy + settings['study_limit']

# min/max number of collection centres
numCentre = int(json.loads(centres.text)['total'])
minCollectionCentre = numCentre if (numCentre > 0) else 1

# min/max number of user enrollments
numUserEnrollment = int(json.loads(userEnrollments.text)['total'])
minUserEnrollment = numUserEnrollment if (numUserEnrollment > 0) else 1
maxUserEnrollment = minUserEnrollment + settings['user_enrollment_limit']

# min/max number of subject enrollments
numSubjectEnrollment = int(json.loads(subjectEnrollments.text)['total'])
minSubjectEnrollment = numSubjectEnrollment if (numSubjectEnrollment > 0) else 1
maxSubjectEnrollment = minSubjectEnrollment + settings['subject_enrollment_limit']
