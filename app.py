from subprocess import *

from flask import Flask, g, request, jsonify
import random
import requests
import urllib2
import BeautifulSoup
import code
import re
app = Flask(__name__)

@app.route("/ohloh", methods=["POST"])
def ohloh():
  regex = re.compile("import (\S*)")
  from_regex = re.compile("from (\S*)")

  file_contents = request.form["contents"]
  match = regex.findall(file_contents)

  urls = []
  for lib in match:
    match_regex = re.compile("file")
    soup = BeautifulSoup.BeautifulSoup(urllib2.urlopen("http://code.ohloh.net/search?s=import%20" + lib + "&pp=0&fl=Python&mp=1&ml=1&me=1&md=1&ff=1&filterChecked=true&format=json"))

    for b in soup.findAll('a'):
      if b.get('href') and match_regex.search(b['href']):
        urls.append({'lib' : lib, 'name': b.string, 'url': b['href']})

  return jsonify({'links' : urls})

@app.route("/stackoverflow", methods=["POST"])
def stackoverflow():
  regex = re.compile("import (\S*)")
  from_regex = re.compile("from (\S*)")

  file_contents = request.form["contents"]
  match = regex.findall(file_contents)

  urls = []

  for lib in match:
    resp = requests.get("http://api.stackoverflow.com/1.1/search?tagged=python%3B" + lib + "&intitle=python%20" + lib + "&pagesize=10")
    resp_dict = resp.json()
    for question in resp_dict["questions"]:
      urls.append({'url' : question['question_answers_url'], 'name' : question['title']})
  return jsonify({'links': urls })

@app.route("/command", methods=["POST"])
def command():
  global process

  if process:
    result = process.poll()
    if result == 0 or result == 1:
      process = None

  if not process:
    file_content = request.form["contents"]
    tmp_filename = "%d.py" % random.randint(0, 9999999)
    f = open(tmp_filename, "w+")
    f.write("import modify_env\nmodify_env.modifyEnv()\n" + file_content)
    process = Popen("python %s > /tmp/log.out 2>&1" % tmp_filename, shell=True, stderr=PIPE, stdout=PIPE, bufsize=1)
  else:
    return jsonify({"success": False, "error": "process already running"})
  return jsonify({"success": True})

@app.route("/poll")
def poll():
  global process
  if process:
    return jsonify({"success": True, poll_result: process.poll()})
  else:
    return jsonify({"success": False, "error": "no process"})

@app.route("/kill")
def kill():
  global process
  if process:
    process.kill()
    return jsonify({"success" : True})
  else:
    return jsonify({"success" : False, "error": "no process"})

@app.route("/getoutput")
def get_output():
  return jsonify({"success" : True, "output": open("/tmp/log.out").read()})

if __name__ == "__main__":
  global process
  process = None
  app.run(host="0.0.0.0", port=4000, debug=True)
