import pdb,code, sys, traceback, urllib, re

def info(type, value, tb):
  p = re.compile("'[^']*'")
  updated_value = p.sub(" ", str(value))
  search_query = urllib.quote(type.__name__ + " " + updated_value)
  traceback.print_exception(type, value, tb)
  print "https://www.google.com/search?q=%s" % search_query

def modifyEnv():
  sys.excepthook = info
