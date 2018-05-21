"""
Copyright (c) 2018 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.0 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
"""
import random
import string
import shutil
import errno


"""
Common functions
"""
__author__ = 'Santiago Flores Kanter (sfloresk@cisco.com)'


def random_word(length):
    """
    Create a random word. Useful to create unique IDs
    :param length: length of the word to be returned
    :return: random word
    """
    return ''.join(random.choice(string.lowercase) for i in range(length))


def copy_files(src, dst):
    """
    Copy files from one directory to another
    :param src: file/directory to copy from
    :param dst: file/directory to copy to
    :return: None
    """
    try:
        shutil.copytree(src, dst)
    except OSError as exc:
        # python >2.5
        if exc.errno == errno.ENOTDIR:
            shutil.copy(src, dst)
        else:
            raise


def create_zip(zip_name, path):
    """
    Create a zip file
    :param zip_name: name of the file
    :param path: directory where is going to be saved
    :return: None
    """
    shutil.make_archive(zip_name, 'zip', path)



