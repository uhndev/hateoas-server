#!/usr/bin/env python

import sys
import json
import random
import models
import config
import requests

users = []
studies = []
centres = []
userEnrollments = []
subjectEnrollments = []

def createObjects():
  # create coordinators/interviewers
  for id in range(config.minCoord, config.maxCoord):
    users.append(models.User())

  # create studies
  centreStart = config.minCollectionCentre
  for sid in range(config.minStudy, config.maxStudy):
    study = models.Study(sid)
    # create collection centres
    for cid in range(0, 3):
      centre = models.CollectionCentre(centreStart, study)
      centres.append(centre)
      centreStart += 1
    studies.append(study)

  # create user enrollments
  enrollments = []
  for ueid in range(config.minUserEnrollment, config.maxUserEnrollment):
    randCentre = random.choice(centres)
    enrollment = models.UserEnrollment(ueid, randCentre.id)
    while (enrollment.user, enrollment.collectionCentre) in enrollments:
      enrollment = models.UserEnrollment(ueid, randCentre.id)

    enrollments.append((enrollment.user, enrollment.collectionCentre))
    userEnrollments.append(enrollment)

  # create subject enrollments
  subjects = {}
  for seid in range(config.minSubjectEnrollment, config.maxSubjectEnrollment):
    randCentre = random.choice(centres)
    enrollment = models.SubjectEnrollment(seid, studies[randCentre.study - config.minStudy], randCentre.id)
    while enrollment.username in subjects:
      enrollment = models.SubjectEnrollment(seid, studies[randCentre.study - config.minStudy], randCentre.id)
    subjects[enrollment.username] = True
    subjectEnrollments.append(enrollment)

def makeRequests():
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
        r = requests.post(config.url + '/api/'+model[0], data=json.dumps(instance.__dict__), headers=config.headers)
        if r.status_code != 200 and r.status_code != 201:
          print '\n--------------------------ERROR--------------------------'
          print 'Error Code: ' + `r.status_code`
          print json.dumps(instance.__dict__)
          raise ValueError(r.text)
        sys.stdout.write(".")
        sys.stdout.flush()
      print "\nCreated " + `len(model[1])` + " " + model[0] + "s"
  except ValueError as error:
    print error

def main():
  createObjects()
  makeRequests()

if __name__ == '__main__':
  main()
