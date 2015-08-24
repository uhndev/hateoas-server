import random
import config
from faker import Factory

fake = Factory.create()

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
    self.name = 'STUDY-' + `id` + '-' + fake.word().upper()
    self.attributes = {}
    self.attributes['procedure'] = fake.words()
    self.attributes['area'] = ['BOTH', 'LEFT', 'RIGHT']
    self.reb = fake.country_code() + '-' + `random.randint(100, 999)`
    self.administrator = random.randint(config.minCoord, config.maxCoord - 1)
    self.pi = random.randint(config.minCoord, config.maxCoord - 1)

class CollectionCentre:
  def __init__(self, id, study):
    self.id = id
    self.name = 'CC-' + `id` + '-' + study.name
    self.study = study.id
    self.contact = random.randint(config.minCoord, config.maxCoord - 1)

class UserEnrollment:
  def __init__(self, id, centreID):
    self.collectionCentre = centreID
    self.user = random.randint(config.minCoord, config.maxCoord - 1)
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
