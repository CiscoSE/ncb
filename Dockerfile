# Dockerfile

# FROM directive instructing base image to build upon
FROM python:2-onbuild

ADD . .
# EXPOSE port 8000 to allow communication to/from server
EXPOSE 5008

# CMD specifcies the command to execute to start the server running.
CMD ["python","run.py"]
# done!
