#!/usr/bin/env python

import re
import csv
import sys
import json
import random
import config
import requests
from faker import Factory

fake = Factory.create()
users = []

def sanitize_input(string):
  mod_str = "".join(string.split()).lower()
  mod_str = re.sub('\([^)]*\)', '', mod_str)
  return re.sub('(^dr\.|^dr)', '', mod_str)

class User:
  def __init__(self, firstname, lastname):
    sanitized_firstname = sanitize_input(firstname)
    sanitized_lastname = sanitize_input(lastname)
    self.username = sanitized_firstname + '.' + sanitized_lastname
    self.email = sanitized_firstname + '.' + sanitized_lastname + '@uhn.ca'
    self.firstname = firstname
    self.lastname = lastname
    self.dob = fake.iso8601()
    self.password = "Password123"
    self.prefix = random.choice(['Mr.', 'Mrs.', 'Ms.', 'Dr.'])
    self.gender = random.choice(['Male', 'Female'])
    self.group = 'altumadmin'

def createUserObjects():
  with open('staff.csv', 'rb') as file:
    reader = csv.reader(file)
    staff_list = list(reader)

  header = staff_list[0]

  user_registry = {}
  for i in range(1, len(staff_list)):
    user_object = User(staff_list[i][1], staff_list[i][0])
    if user_object.username not in user_registry and staff_list[i][1] and staff_list[i][0]:
      users.append(user_object)
      user_registry[user_object.username] = True

def makeRequests():
  try:
    for instance in users:
      r = requests.post(config.url + '/api/user', data=json.dumps(instance.__dict__), headers=config.headers)
      if r.status_code != 200 and r.status_code != 201:
        print '\n--------------------------ERROR--------------------------'
        print 'Error Code: ' + `r.status_code`
        print json.dumps(instance.__dict__)
        raise ValueError(r.text)
      sys.stdout.write(".")
      sys.stdout.flush()
    print "\nCreated " + `len(users)` + " users"
  except ValueError as error:
    print error

def main():
  createUserObjects()
  makeRequests()

if __name__ == '__main__':
  main()
