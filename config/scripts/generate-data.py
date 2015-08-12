#!/usr/bin/env python

import sys
import json
import random
import requests
from faker import Factory

# assume admin user exists already with id 1
minCoord = 2
maxCoord = 10

# subject users' ids begin after coordinators created
minSubject = maxCoord + 1
maxSubject = minSubject + 20

# maximum number of studies to be created
maxStudy = 5

# max number of user enrollments
maxUserEnrollment = 20

# max number of subject enrollments
maxSubjectEnrollment = 100

fake = Factory.create()

users = []
studies = []
centres = []
userEnrollments = []
subjectEnrollments = []

class User:
  def __init__(self):
    self.username = fake.user_name()
    self.email = fake.company_email()
    self.firstname = fake.first_name()
    self.lastname = fake.last_name()
    self.dob = fake.iso8601()
    self.password = self.firstname + self.lastname + "123"
    self.prefix = random.choice(['Mr.', 'Mrs.', 'Ms.', 'Dr.'])
    self.gender = random.choice(['Male', 'Female'])
    self.group = 2

class Study:
  def __init__(self, id):
    self.id = id
    self.name = 'STUDY-' + `id`
    self.attributes = {}
    self.attributes['procedure'] = fake.words()
    self.attributes['area'] = ['BOTH', 'LEFT', 'RIGHT']
    self.reb = random.randint(0, 100)
    self.administrator = random.randint(minCoord, maxCoord)
    self.pi = random.randint(minCoord, maxCoord)

class CollectionCentre:
  def __init__(self, id, study):
    self.id = id
    self.name = study.name + '-CC-' + `id`
    self.study = study.id
    self.contact = random.randint(minCoord, maxCoord)

class UserEnrollment:
  def __init__(self, id, centreID):
    self.collectionCentre = centreID
    self.user = random.randint(minCoord, maxCoord)
    self.centreAccess = random.choice(['coordinator', 'interviewer'])

class SubjectEnrollment:
  def __init__(self, id, study, centreID):
    # subject user info
    self.username = fake.user_name()
    self.email = fake.company_email()
    self.firstname = fake.first_name()
    self.lastname = fake.last_name()
    self.dob = fake.iso8601()
    self.password = self.firstname + self.lastname + "123"
    self.prefix = random.choice(['Mr.', 'Mrs.', 'Ms.', 'Dr.'])
    self.gender = random.choice(['Male', 'Female'])

    # subject enrollment info
    self.study = study.id
    self.collectionCentre = centreID
    self.doe = fake.iso8601()
    self.studyMapping = {}
    for key, values in study.attributes.iteritems():
      self.studyMapping[key] = random.choice(values)

    self.status = random.choice([
      'REGISTERED',
      'ONGOING',
      'LOST TO FOLLOWUP',
      'WITHDRAWN',
      'INELIGIBLE',
      'DECEASED',
      'TERMINATED',
      'COMPLETED'
    ])

def createObjects():
  # create coordinators/interviewers
  for id in range(minCoord, maxCoord+1):
    users.append(User())

  # create studies
  centreStart = 1
  userEnrollmentStart = 1
  subjectEnrollmentStart = 1
  for sid in range(1, maxStudy+1):
    study = Study(sid)
    # create collection centres
    for cid in range(0, 3):
      centre = CollectionCentre(centreStart, study)
      centres.append(centre)
      centreStart += 1
    studies.append(study)

  # create user enrollments
  for ueid in range(1, maxUserEnrollment+1):
    randCentre = random.choice(centres)
    enrollment = UserEnrollment(userEnrollmentStart, randCentre.id)
    userEnrollmentStart += 1
    userEnrollments.append(enrollment)

  # create subject enrollments
  for seid in range(1, maxSubjectEnrollment+1):
    randCentre = random.choice(centres)
    enrollment = SubjectEnrollment(subjectEnrollmentStart, studies[randCentre.study - 1], randCentre.id)
    subjectEnrollmentStart += 1
    subjectEnrollments.append(enrollment)

def makeRequests():
  token = ''
  url = 'http://localhost:1337'
  payload = { 'identifier': 'admin', 'password': 'admin1234' }

  r = requests.post(url + '/auth/local', data=json.dumps(payload))
  token = json.loads(r.text)['token']['payload']
  headers = { 'Authorization': 'Bearer ' + token }

  models = [
    ['user', users],
    ['study', studies],
    ['collectioncentre', centres],
    ['userenrollment', userEnrollments],
    ['subjectenrollment', subjectEnrollments]
  ]

  try:
    for model in models:
      for instance in model[1]:
        r = requests.post(url + '/api/'+model[0], data=json.dumps(instance.__dict__), headers=headers)
        if r.status_code != 200:
          raise ValueError(r.text)
  except ValueError as error:
    print '--------------------------ERROR--------------------------'
    print error

def main():
  createObjects()
  makeRequests()

if __name__ == '__main__':
  main()
